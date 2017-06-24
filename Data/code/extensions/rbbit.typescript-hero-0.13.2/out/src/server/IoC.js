"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DeclarationIndex_1 = require("./indices/DeclarationIndex");
const TypescriptParser_1 = require("../common/ts-parsing/TypescriptParser");
const ServerLogger_1 = require("./utilities/ServerLogger");
const ImportResolveExtension_1 = require("./extensions/ImportResolveExtension");
const IoCSymbols_1 = require("./IoCSymbols");
const ServerConnection_1 = require("./utilities/ServerConnection");
const inversify_1 = require("inversify");
const container = new inversify_1.Container();
container.bind(ServerConnection_1.ServerConnection).toConstantValue(new ServerConnection_1.ServerConnection());
container.bind(DeclarationIndex_1.DeclarationIndex).to(DeclarationIndex_1.DeclarationIndex).inSingletonScope();
container.bind(TypescriptParser_1.TypescriptParser).to(TypescriptParser_1.TypescriptParser);
container.bind(IoCSymbols_1.iocSymbols.extensions).to(ImportResolveExtension_1.ImportResolveExtension).inSingletonScope();
container
    .bind(IoCSymbols_1.iocSymbols.loggerFactory)
    .toFactory((context) => {
    const connection = context.container.get(ServerConnection_1.ServerConnection);
    return (prefix) => {
        return new ServerLogger_1.ServerLogger(connection, prefix);
    };
});
exports.Container = container;
