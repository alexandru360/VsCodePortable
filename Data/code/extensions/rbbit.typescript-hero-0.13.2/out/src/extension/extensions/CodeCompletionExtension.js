"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_1 = require("../../common/helpers");
const ts_parsing_1 = require("../../common/ts-parsing");
const declarations_1 = require("../../common/ts-parsing/declarations");
const imports_1 = require("../../common/ts-parsing/imports");
const CalculatedDeclarationIndex_1 = require("../declarations/CalculatedDeclarationIndex");
const helpers_2 = require("../helpers");
const IoCSymbols_1 = require("../IoCSymbols");
const BaseExtension_1 = require("./BaseExtension");
const inversify_1 = require("inversify");
const vscode_1 = require("vscode");
let CodeCompletionExtension = class CodeCompletionExtension extends BaseExtension_1.BaseExtension {
    constructor(context, loggerFactory, config, parser, index) {
        super(context);
        this.config = config;
        this.parser = parser;
        this.index = index;
        this.logger = loggerFactory('CodeCompletionExtension');
    }
    initialize() {
        this.context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('typescript', this));
        this.context.subscriptions.push(vscode_1.languages.registerCompletionItemProvider('typescriptreact', this));
        this.logger.info('Initialized');
    }
    dispose() {
        this.logger.info('Disposed');
    }
    provideCompletionItems(document, position, token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.index.indexReady) {
                return null;
            }
            const wordAtPosition = document.getWordRangeAtPosition(position);
            const lineText = document.lineAt(position.line).text;
            let searchWord = '';
            if (wordAtPosition && wordAtPosition.start.character < position.character) {
                const word = document.getText(wordAtPosition);
                searchWord = word.substr(0, position.character - wordAtPosition.start.character);
            }
            if (!searchWord ||
                token.isCancellationRequested ||
                !this.index.indexReady ||
                (lineText.substring(0, position.character).match(/["'`]/g) || []).length % 2 === 1 ||
                lineText.match(/^\s*(\/\/|\/\*\*|\*\/|\*)/g) ||
                lineText.match(/^import .*$/g) ||
                lineText.substring(0, position.character).match(new RegExp(`(\w*[.])+${searchWord}`, 'g'))) {
                return Promise.resolve(null);
            }
            this.logger.info('Search completion for word.', { searchWord });
            const parsed = yield this.parser.parseSource(document.getText());
            const declarations = helpers_1.getDeclarationsFilteredByImports(this.index.declarationInfos, document.fileName, vscode_1.workspace.rootPath, parsed.imports)
                .filter(o => !parsed.declarations.some(d => d.name === o.declaration.name))
                .filter(o => !parsed.usages.some(d => d === o.declaration.name));
            return declarations
                .filter(o => o.declaration.name.toLowerCase().indexOf(searchWord.toLowerCase()) >= 0)
                .map((o) => {
                const item = new vscode_1.CompletionItem(o.declaration.name, o.declaration.itemKind);
                item.detail = o.from;
                item.sortText = o.declaration.intellisenseSortKey;
                item.additionalTextEdits = this.calculateTextEdits(o, document, parsed);
                return item;
            });
        });
    }
    calculateTextEdits(declaration, document, parsedSource) {
        const imp = parsedSource.imports.find((o) => {
            if (o instanceof imports_1.NamedImport) {
                const importedLib = helpers_1.getAbsolutLibraryName(o.libraryName, document.fileName, vscode_1.workspace.rootPath);
                return importedLib === declaration.from;
            }
            return false;
        });
        if (imp && imp instanceof imports_1.NamedImport) {
            const modifiedImp = imp.clone();
            modifiedImp.specifiers.push(new ts_parsing_1.SymbolSpecifier(declaration.declaration.name));
            return [
                vscode_1.TextEdit.replace(helpers_2.importRange(document, imp.start, imp.end), modifiedImp.generateTypescript(this.config.resolver.generationOptions)),
            ];
        }
        else if (declaration.declaration instanceof declarations_1.ModuleDeclaration) {
            const mod = new imports_1.NamespaceImport(declaration.from, declaration.declaration.name);
            return [
                vscode_1.TextEdit.insert(helpers_1.getImportInsertPosition(this.config.resolver.newImportLocation, vscode_1.window.activeTextEditor), mod.generateTypescript(this.config.resolver.generationOptions)),
            ];
        }
        else if (declaration.declaration instanceof declarations_1.DefaultDeclaration) {
        }
        else {
            const library = helpers_1.getRelativeLibraryName(declaration.from, document.fileName, vscode_1.workspace.rootPath);
            const named = new imports_1.NamedImport(library);
            named.specifiers.push(new ts_parsing_1.SymbolSpecifier(declaration.declaration.name));
            return [
                vscode_1.TextEdit.insert(helpers_1.getImportInsertPosition(this.config.resolver.newImportLocation, vscode_1.window.activeTextEditor), named.generateTypescript(this.config.resolver.generationOptions)),
            ];
        }
        return [];
    }
};
CodeCompletionExtension = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.extensionContext)),
    tslib_1.__param(1, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__param(2, inversify_1.inject(IoCSymbols_1.iocSymbols.configuration)),
    tslib_1.__metadata("design:paramtypes", [Object, Function, Object, ts_parsing_1.TypescriptParser,
        CalculatedDeclarationIndex_1.CalculatedDeclarationIndex])
], CodeCompletionExtension);
exports.CodeCompletionExtension = CodeCompletionExtension;
