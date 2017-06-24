"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const communication_1 = require("../../common/communication");
const IoC_1 = require("../IoC");
const IoCSymbols_1 = require("../IoCSymbols");
const inversify_1 = require("inversify");
const vscode_languageserver_1 = require("vscode-languageserver");
let ServerConnection = class ServerConnection extends communication_1.Connection {
    constructor() {
        super(vscode_languageserver_1.createConnection(new vscode_languageserver_1.IPCMessageReader(process), new vscode_languageserver_1.IPCMessageWriter(process)));
    }
    start() {
        if (this.started) {
            throw new Error('Server already started.');
        }
        const extensions = IoC_1.Container.getAll(IoCSymbols_1.iocSymbols.extensions);
        this.connection.onInitialize((params) => {
            extensions.forEach(o => o.initialize(this, params));
            return {
                capabilities: {},
            };
        });
        this.connection.onShutdown(() => {
            extensions.forEach(o => o.exit());
        });
        this.connection.listen();
        this.started = true;
    }
    onDidChangeConfiguration(handler) {
        if (!this.handler['onDidChangeConfiguration']) {
            this.handler['onDidChangeConfiguration'] = [];
            this.connection.onDidChangeConfiguration(params => this.handler['onDidChangeConfiguration'].forEach(o => o(params.settings.typescriptHero)));
        }
        this.handler['onDidChangeConfiguration'].push(handler);
    }
    onDidChangeWatchedFiles(handler) {
        if (!this.handler['onDidChangeWatchedFiles']) {
            this.handler['onDidChangeWatchedFiles'] = [];
            this.connection.onDidChangeWatchedFiles(params => this.handler['onDidChangeWatchedFiles'].forEach(o => o(params.changes)));
        }
        this.handler['onDidChangeWatchedFiles'].push(handler);
    }
};
ServerConnection = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [])
], ServerConnection);
exports.ServerConnection = ServerConnection;
