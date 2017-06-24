"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_1 = require("../../common/helpers");
const quick_pick_items_1 = require("../../common/quick-pick-items");
const ts_parsing_1 = require("../../common/ts-parsing");
const declarations_1 = require("../../common/ts-parsing/declarations");
const imports_1 = require("../../common/ts-parsing/imports");
const TypescriptHeroGuards_1 = require("../../common/type-guards/TypescriptHeroGuards");
const helpers_2 = require("../helpers");
const IoC_1 = require("../IoC");
const IoCSymbols_1 = require("../IoCSymbols");
const ImportProxy_1 = require("../proxy-objects/ImportProxy");
const vscode_1 = require("vscode");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
function stringSort(strA, strB) {
    if (strA < strB) {
        return -1;
    }
    else if (strA > strB) {
        return 1;
    }
    return 0;
}
function importSort(i1, i2) {
    const strA = i1.libraryName.toLowerCase();
    const strB = i2.libraryName.toLowerCase();
    return stringSort(strA, strB);
}
function specifierSort(i1, i2) {
    return stringSort(i1.specifier, i2.specifier);
}
class ImportManager {
    constructor(document, _parsedDocument) {
        this.document = document;
        this._parsedDocument = _parsedDocument;
        this.imports = [];
        this.userImportDecisions = [];
        this.imports = _parsedDocument.imports.map(o => o.clone());
    }
    static get parser() {
        return IoC_1.Container.get(ts_parsing_1.TypescriptParser);
    }
    static get config() {
        return IoC_1.Container.get(IoCSymbols_1.iocSymbols.configuration);
    }
    get parsedDocument() {
        return this._parsedDocument;
    }
    static create(document) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const source = yield ImportManager.parser.parseSource(document.getText());
            source.imports = source.imports.map(o => o instanceof imports_1.NamedImport || o instanceof imports_1.DefaultImport ? new ImportProxy_1.ImportProxy(o) : o);
            return new ImportManager(document, source);
        });
    }
    addDeclarationImport(declarationInfo) {
        const alreadyImported = this.imports.find(o => declarationInfo.from === helpers_1.getAbsolutLibraryName(o.libraryName, this.document.fileName, vscode_1.workspace.rootPath) && o instanceof ImportProxy_1.ImportProxy);
        if (alreadyImported) {
            if (declarationInfo.declaration instanceof declarations_1.DefaultDeclaration) {
                delete alreadyImported.defaultAlias;
                alreadyImported.defaultPurposal = declarationInfo.declaration.name;
            }
            else {
                alreadyImported.addSpecifier(declarationInfo.declaration.name);
            }
        }
        else {
            if (declarationInfo.declaration instanceof declarations_1.ModuleDeclaration) {
                this.imports.push(new imports_1.NamespaceImport(declarationInfo.from, declarationInfo.declaration.name));
            }
            else if (declarationInfo.declaration instanceof declarations_1.DefaultDeclaration) {
                const imp = new ImportProxy_1.ImportProxy(helpers_1.getRelativeLibraryName(declarationInfo.from, this.document.fileName, vscode_1.workspace.rootPath));
                imp.defaultPurposal = declarationInfo.declaration.name;
                this.imports.push(imp);
            }
            else {
                const imp = new ImportProxy_1.ImportProxy(helpers_1.getRelativeLibraryName(declarationInfo.from, this.document.fileName, vscode_1.workspace.rootPath));
                imp.specifiers.push(new ts_parsing_1.SymbolSpecifier(declarationInfo.declaration.name));
                this.imports.push(imp);
            }
        }
        return this;
    }
    addMissingImports(index) {
        const declarations = helpers_1.getDeclarationsFilteredByImports(index.declarationInfos, this.document.fileName, vscode_1.workspace.rootPath, this.imports);
        for (const usage of this._parsedDocument.nonLocalUsages) {
            const foundDeclarations = declarations.filter(o => o.declaration.name === usage);
            if (foundDeclarations.length <= 0) {
                continue;
            }
            else if (foundDeclarations.length === 1) {
                this.addDeclarationImport(foundDeclarations[0]);
            }
            else {
                this.userImportDecisions[usage] = foundDeclarations;
            }
        }
        return this;
    }
    organizeImports() {
        this.organize = true;
        let keep = [];
        for (const actImport of this.imports) {
            if (actImport instanceof imports_1.NamespaceImport ||
                actImport instanceof imports_1.ExternalModuleImport) {
                if (this._parsedDocument.nonLocalUsages.indexOf(actImport.alias) > -1) {
                    keep.push(actImport);
                }
            }
            else if (actImport instanceof ImportProxy_1.ImportProxy) {
                actImport.specifiers = actImport.specifiers
                    .filter(o => this._parsedDocument.nonLocalUsages.indexOf(o.alias || o.specifier) > -1)
                    .sort(specifierSort);
                const defaultSpec = actImport.defaultAlias || actImport.defaultPurposal;
                if (actImport.specifiers.length ||
                    (!!defaultSpec && this._parsedDocument.nonLocalUsages.indexOf(defaultSpec))) {
                    keep.push(actImport);
                }
            }
            else if (actImport instanceof imports_1.StringImport) {
                keep.push(actImport);
            }
        }
        if (!ImportManager.config.resolver.disableImportSorting) {
            keep = [
                ...keep.filter(o => o instanceof imports_1.StringImport).sort(importSort),
                ...keep.filter(o => !(o instanceof imports_1.StringImport)).sort(importSort),
            ];
        }
        this.imports = keep;
        return this;
    }
    commit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const edits = [];
            yield this.resolveImportSpecifiers();
            if (this.organize) {
                for (const imp of this._parsedDocument.imports) {
                    edits.push(vscode_languageserver_types_1.TextEdit.del(helpers_2.importRange(this.document, imp.start, imp.end)));
                }
                edits.push(vscode_languageserver_types_1.TextEdit.insert(helpers_1.getImportInsertPosition(ImportManager.config.resolver.newImportLocation, vscode_1.window.activeTextEditor), this.imports.reduce((all, cur) => all + cur.generateTypescript(ImportManager.config.resolver.generationOptions), '')));
            }
            else {
                for (const imp of this._parsedDocument.imports) {
                    if (!this.imports.some(o => o.libraryName === imp.libraryName)) {
                        edits.push(vscode_languageserver_types_1.TextEdit.del(helpers_2.importRange(this.document, imp.start, imp.end)));
                    }
                }
                const proxies = this._parsedDocument.imports.filter(o => o instanceof ImportProxy_1.ImportProxy);
                for (const imp of this.imports) {
                    if (imp instanceof ImportProxy_1.ImportProxy &&
                        proxies.some((o) => o.isEqual(imp))) {
                        continue;
                    }
                    if (imp.start !== undefined && imp.end !== undefined) {
                        edits.push(vscode_languageserver_types_1.TextEdit.replace(helpers_2.importRange(this.document, imp.start, imp.end), imp.generateTypescript(ImportManager.config.resolver.generationOptions)));
                    }
                    else {
                        edits.push(vscode_languageserver_types_1.TextEdit.insert(helpers_1.getImportInsertPosition(ImportManager.config.resolver.newImportLocation, vscode_1.window.activeTextEditor), imp.generateTypescript(ImportManager.config.resolver.generationOptions)));
                    }
                }
            }
            const workspaceEdit = new vscode_1.WorkspaceEdit();
            workspaceEdit.set(this.document.uri, edits);
            const result = yield vscode_1.workspace.applyEdit(workspaceEdit);
            if (result) {
                delete this.organize;
                this._parsedDocument = yield ImportManager.parser.parseSource(this.document.getText());
            }
            return result;
        });
    }
    resolveImportSpecifiers() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const getSpecifiers = () => this.imports
                .reduce((all, cur) => {
                let specifiers = all;
                if (cur instanceof ImportProxy_1.ImportProxy) {
                    specifiers = specifiers.concat(cur.specifiers.map(o => o.alias || o.specifier));
                    if (cur.defaultAlias) {
                        specifiers.push(cur.defaultAlias);
                    }
                }
                if (TypescriptHeroGuards_1.isAliasedImport(cur)) {
                    specifiers.push(cur.alias);
                }
                return specifiers;
            }, []);
            for (const decision of Object.keys(this.userImportDecisions).filter(o => this.userImportDecisions[o].length > 0)) {
                const declarations = this.userImportDecisions[decision].map(o => new quick_pick_items_1.ResolveQuickPickItem(o));
                const result = yield vscode_1.window.showQuickPick(declarations, {
                    placeHolder: `Multiple declarations for "${decision}" found.`,
                });
                if (result) {
                    this.addDeclarationImport(result.declarationInfo);
                }
            }
            const proxies = this.imports.filter(o => o instanceof ImportProxy_1.ImportProxy);
            for (const imp of proxies) {
                if (imp.defaultPurposal && !imp.defaultAlias) {
                    imp.defaultAlias = yield this.getDefaultIdentifier(imp.defaultPurposal);
                    delete imp.defaultPurposal;
                }
                for (const spec of imp.specifiers) {
                    const specifiers = getSpecifiers();
                    if (specifiers.filter(o => o === (spec.alias || spec.specifier)).length > 1) {
                        spec.alias = yield this.getSpecifierAlias();
                    }
                }
            }
        });
    }
    getSpecifierAlias() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.vscodeInputBox({
                placeHolder: 'Alias for specifier',
                prompt: 'Please enter an alias for the specifier..',
                validateInput: s => !!s ? '' : 'Please enter a variable name',
            });
            return !!result ? result : undefined;
        });
    }
    getDefaultIdentifier(declarationName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = yield this.vscodeInputBox({
                placeHolder: 'Default export name',
                prompt: 'Please enter a variable name for the default export..',
                validateInput: s => !!s ? '' : 'Please enter a variable name',
                value: declarationName,
            });
            return !!result ? result : undefined;
        });
    }
    vscodeInputBox(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield vscode_1.window.showInputBox(options);
        });
    }
}
exports.ImportManager = ImportManager;
