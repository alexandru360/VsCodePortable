"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const communication_1 = require("../../common/communication");
const path_1 = require("path");
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
class ClientConnection extends communication_1.Connection {
    constructor(endpoint) {
        super(endpoint);
    }
    static create(context) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const module = path_1.join(__dirname, '..', '..', 'server', 'TypeScriptHeroServer');
            const options = { execArgv: ['--nolazy', '--debug=6004'] };
            const serverOptions = {
                run: { module, transport: vscode_languageclient_1.TransportKind.ipc },
                debug: { module, transport: vscode_languageclient_1.TransportKind.ipc, options },
            };
            const clientOptions = {
                documentSelector: ['typescript', 'typescriptreact'],
                synchronize: {
                    configurationSection: 'typescriptHero',
                    fileEvents: [
                        vscode_1.workspace.createFileSystemWatcher('{**/*.ts,**/*.tsx,**/package.json,**/typings.json}', true),
                    ],
                },
            };
            const client = new vscode_languageclient_1.LanguageClient('typescriptHeroServer', 'TypeScript Hero Server', serverOptions, clientOptions);
            context.subscriptions.push(client.start());
            yield client.onReady();
            return new ClientConnection(client);
        });
    }
}
exports.ClientConnection = ClientConnection;
