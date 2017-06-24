"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
require("reflect-metadata");
require("../common/transport-models");
require("../common/ts-parsing/declarations");
require("../common/ts-parsing/exports");
require("../common/ts-parsing/imports");
require("../common/ts-parsing/resources");
const IoC_1 = require("./IoC");
const IoCSymbols_1 = require("./IoCSymbols");
const TypeScriptHero_1 = require("./TypeScriptHero");
const ClientConnection_1 = require("./utilities/ClientConnection");
let extension;
function activate(context) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (IoC_1.Container.isBound(IoCSymbols_1.iocSymbols.extensionContext)) {
            IoC_1.Container.unbind(IoCSymbols_1.iocSymbols.extensionContext);
        }
        IoC_1.Container.bind(IoCSymbols_1.iocSymbols.extensionContext).toConstantValue(context);
        IoC_1.Container.bind(ClientConnection_1.ClientConnection).toConstantValue(yield ClientConnection_1.ClientConnection.create(context));
        extension = IoC_1.Container.get(TypeScriptHero_1.TypeScriptHero);
    });
}
exports.activate = activate;
function deactivate() {
    extension.dispose();
}
exports.deactivate = deactivate;
