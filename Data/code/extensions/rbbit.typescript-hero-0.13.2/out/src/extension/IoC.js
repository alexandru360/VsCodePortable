"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_parsing_1 = require("../common/ts-parsing");
const code_actions_1 = require("./code-actions");
const CalculatedDeclarationIndex_1 = require("./declarations/CalculatedDeclarationIndex");
const CodeActionExtension_1 = require("./extensions/CodeActionExtension");
const CodeCompletionExtension_1 = require("./extensions/CodeCompletionExtension");
const ImportResolveExtension_1 = require("./extensions/ImportResolveExtension");
const IoCSymbols_1 = require("./IoCSymbols");
const TypeScriptHero_1 = require("./TypeScriptHero");
const VscodeLogger_1 = require("./utilities/VscodeLogger");
const VscodeExtensionConfig_1 = require("./VscodeExtensionConfig");
const inversify_1 = require("inversify");
const inversify_inject_decorators_1 = require("inversify-inject-decorators");
const container = new inversify_1.Container();
container.bind(TypeScriptHero_1.TypeScriptHero).to(TypeScriptHero_1.TypeScriptHero).inSingletonScope();
container.bind(IoCSymbols_1.iocSymbols.configuration).to(VscodeExtensionConfig_1.VscodeExtensionConfig).inSingletonScope();
container.bind(CalculatedDeclarationIndex_1.CalculatedDeclarationIndex).to(CalculatedDeclarationIndex_1.CalculatedDeclarationIndex).inSingletonScope();
container.bind(ts_parsing_1.TypescriptParser).to(ts_parsing_1.TypescriptParser);
container.bind(IoCSymbols_1.iocSymbols.extensions).to(ImportResolveExtension_1.ImportResolveExtension).inSingletonScope();
container.bind(IoCSymbols_1.iocSymbols.extensions).to(CodeCompletionExtension_1.CodeCompletionExtension).inSingletonScope();
container.bind(IoCSymbols_1.iocSymbols.extensions).to(CodeActionExtension_1.CodeActionExtension).inSingletonScope();
container
    .bind(IoCSymbols_1.iocSymbols.loggerFactory)
    .toFactory((context) => {
    return (prefix) => {
        const extContext = context.container.get(IoCSymbols_1.iocSymbols.extensionContext);
        const config = context.container.get(IoCSymbols_1.iocSymbols.configuration);
        return new VscodeLogger_1.VscodeLogger(extContext, config, prefix);
    };
});
container.bind(IoCSymbols_1.iocSymbols.codeActionCreators).to(code_actions_1.MissingImportCreator);
container.bind(IoCSymbols_1.iocSymbols.codeActionCreators).to(code_actions_1.MissingImplementationInClassCreator);
exports.Container = container;
exports.IocDecorators = inversify_inject_decorators_1.default(container);
