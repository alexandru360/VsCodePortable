"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const communication_1 = require("../../common/communication");
const PathHelpers_1 = require("../../common/helpers/PathHelpers");
const transport_models_1 = require("../../common/transport-models");
const DeclarationIndex_1 = require("../indices/DeclarationIndex");
const IoCSymbols_1 = require("../IoCSymbols");
const inversify_1 = require("inversify");
const ts_json_serializer_1 = require("ts-json-serializer");
let ImportResolveExtension = class ImportResolveExtension {
    constructor(loggerFactory, index) {
        this.index = index;
        this.serializer = new ts_json_serializer_1.TsSerializer();
        this.logger = loggerFactory('ImportResolveExtension');
    }
    initialize(connection, params) {
        this.rootUri = PathHelpers_1.normalizePathUri(params.rootUri || '');
        this.connection = connection;
        connection.onDidChangeWatchedFiles(changes => this.watchedFilesChanged(changes));
        connection.onNotification(communication_1.Notification.CreateIndexForFiles, files => this.buildIndex(files));
        this.logger.info('Initialized');
    }
    exit() {
        this.logger.info('Exit');
    }
    watchedFilesChanged(changes) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.rootUri) {
                this.logger.warning('No workspace opened, will not proceed.');
                return;
            }
            try {
                this.logger.info(`Watched files have changed, processing ${changes.length} changes.`);
                this.connection.sendNotification(communication_1.Notification.IndexCreationRunning);
                yield this.index.reindexForChanges(changes, this.rootUri);
                yield this.sendIndexToExtension();
                this.connection.sendNotification(communication_1.Notification.IndexCreationSuccessful);
                this.logger.info('Index rebuild successful.');
            }
            catch (e) {
                this.logger.error('There was an error during reprocessing changed files.', e);
                this.connection.sendNotification(communication_1.Notification.IndexCreationFailed);
            }
        });
    }
    buildIndex(files) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.rootUri) {
                this.logger.warning('No workspace opened, will not proceed.');
                this.connection.sendNotification(communication_1.Notification.IndexCreationSuccessful);
                return;
            }
            this.logger.info(`Build new index for ${files.length} files.`);
            try {
                yield this.index.buildIndex(files, this.rootUri);
                this.logger.info('Index successfully built.');
                yield this.sendIndexToExtension();
                this.connection.sendNotification(communication_1.Notification.IndexCreationSuccessful);
            }
            catch (e) {
                this.logger.error('There was an error during the build of the index.', e);
                this.connection.sendNotification(communication_1.Notification.IndexCreationFailed);
            }
        });
    }
    sendIndexToExtension() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const partials = Object.keys(this.index.index)
                .filter(k => this.index.index[k] !== undefined)
                .map(k => new transport_models_1.DeclarationIndexPartial(k, this.index.index[k]))
                .filter(p => p.infos.length > 0);
            for (let x = 0; x < partials.length; x += 100) {
                const parts = this.serializer.serialize(partials.slice(x, x + 100));
                yield this.connection.sendRequest(communication_1.Request.PartialIndexResult, { parts });
            }
        });
    }
};
ImportResolveExtension = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__metadata("design:paramtypes", [Function, DeclarationIndex_1.DeclarationIndex])
], ImportResolveExtension);
exports.ImportResolveExtension = ImportResolveExtension;
