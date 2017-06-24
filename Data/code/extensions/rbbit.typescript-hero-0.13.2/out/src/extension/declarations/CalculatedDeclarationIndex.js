"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const communication_1 = require("../../common/communication");
const IoCSymbols_1 = require("../IoCSymbols");
const ClientConnection_1 = require("../utilities/ClientConnection");
const inversify_1 = require("inversify");
const ts_json_serializer_1 = require("ts-json-serializer");
let CalculatedDeclarationIndex = class CalculatedDeclarationIndex {
    constructor(loggerFactory, connection) {
        this.connection = connection;
        this.serializer = new ts_json_serializer_1.TsSerializer();
        this.logger = loggerFactory('CalculatedDeclarationIndex');
        this.logger.info('Instantiated.');
        this.connection.onRequest(communication_1.Request.PartialIndexResult, ({ parts }) => {
            if (!parts) {
                return false;
            }
            if (!this.tempIndex) {
                this.tempIndex = {};
                this.logger.info('Receiving partial index result.');
            }
            const partials = this.serializer.deserialize(parts);
            for (const partial of partials) {
                this.tempIndex[partial.index] = partial.infos;
            }
            return true;
        });
        this.connection.onNotification(communication_1.Notification.IndexCreationSuccessful, () => {
            if (!this.tempIndex) {
                return;
            }
            this._index = this.tempIndex;
            delete this.tempIndex;
            this.logger.info('Index completely received, cleaning up temp index.');
        });
        this.connection.onNotification(communication_1.Notification.IndexCreationFailed, () => {
            this.logger.error('Index creation failed, cleanup temp index.');
            delete this.tempIndex;
        });
    }
    get indexReady() {
        return this._index !== undefined;
    }
    get index() {
        return this._index;
    }
    get declarationInfos() {
        return this.indexReady ?
            Object
                .keys(this.index)
                .sort()
                .reduce((all, key) => all.concat(this.index[key]), []) :
            [];
    }
};
CalculatedDeclarationIndex = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__metadata("design:paramtypes", [Function, ClientConnection_1.ClientConnection])
], CalculatedDeclarationIndex);
exports.CalculatedDeclarationIndex = CalculatedDeclarationIndex;
