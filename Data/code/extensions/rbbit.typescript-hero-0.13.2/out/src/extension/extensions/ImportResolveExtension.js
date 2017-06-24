"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const communication_1 = require("../../common/communication");
const helpers_1 = require("../../common/helpers");
const quick_pick_items_1 = require("../../common/quick-pick-items");
const transport_models_1 = require("../../common/transport-models");
const ts_parsing_1 = require("../../common/ts-parsing");
const declarations_1 = require("../../common/ts-parsing/declarations");
const CalculatedDeclarationIndex_1 = require("../declarations/CalculatedDeclarationIndex");
const IoCSymbols_1 = require("../IoCSymbols");
const managers_1 = require("../managers");
const ClientConnection_1 = require("../utilities/ClientConnection");
const BaseExtension_1 = require("./BaseExtension");
const fs_1 = require("fs");
const inversify_1 = require("inversify");
const path_1 = require("path");
const vscode_1 = require("vscode");
function compareIgnorePatterns(local, config) {
    if (local.length !== config.length) {
        return false;
    }
    const localSorted = local.sort();
    const configSorted = config.sort();
    for (let x = 0; x < configSorted.length; x += 1) {
        if (configSorted[x] !== localSorted[x]) {
            return false;
        }
    }
    return true;
}
function findFiles(config) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const searches = [
            vscode_1.workspace.findFiles('{**/*.ts,**/*.tsx}', '{**/node_modules/**,**/typings/**}'),
        ];
        let globs = [];
        let ignores = ['**/typings/**'];
        if (vscode_1.workspace.rootPath && fs_1.existsSync(path_1.join(vscode_1.workspace.rootPath, 'package.json'))) {
            const packageJson = require(path_1.join(vscode_1.workspace.rootPath, 'package.json'));
            if (packageJson['dependencies']) {
                globs = globs.concat(Object.keys(packageJson['dependencies']).map(o => `**/node_modules/${o}/**/*.d.ts`));
                ignores = ignores.concat(Object.keys(packageJson['dependencies']).map(o => `**/node_modules/${o}/node_modules/**`));
            }
            if (packageJson['devDependencies']) {
                globs = globs.concat(Object.keys(packageJson['devDependencies']).map(o => `**/node_modules/${o}/**/*.d.ts`));
                ignores = ignores.concat(Object.keys(packageJson['devDependencies']).map(o => `**/node_modules/${o}/node_modules/**`));
            }
        }
        else {
            globs.push('**/node_modules/**/*.d.ts');
        }
        searches.push(vscode_1.workspace.findFiles(`{${globs.join(',')}}`, `{${ignores.join(',')}}`));
        searches.push(vscode_1.workspace.findFiles('**/typings/**/*.d.ts', '**/node_modules/**'));
        let uris = yield Promise.all(searches);
        const excludePatterns = config.resolver.ignorePatterns;
        uris = uris.map((o, idx) => idx === 0 ?
            o.filter(f => f.fsPath
                .replace(vscode_1.workspace.rootPath, '')
                .split(/\\|\//)
                .every(p => excludePatterns.indexOf(p) < 0)) :
            o);
        return uris.reduce((all, cur) => all.concat(cur), []).map(o => o.fsPath);
    });
}
exports.findFiles = findFiles;
const resolverOk = 'TSH Resolver $(check)';
const resolverSyncing = 'TSH Resolver $(sync)';
const resolverErr = 'TSH Resolver $(flame)';
let ImportResolveExtension = class ImportResolveExtension extends BaseExtension_1.BaseExtension {
    constructor(context, loggerFactory, config, index, parser, connection) {
        super(context);
        this.config = config;
        this.index = index;
        this.parser = parser;
        this.connection = connection;
        this.statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 4);
        this.logger = loggerFactory('ImportResolveExtension');
    }
    initialize() {
        this.context.subscriptions.push(this.statusBarItem);
        this.statusBarItem.text = resolverOk;
        this.statusBarItem.tooltip = 'Click to manually reindex all files.';
        this.statusBarItem.command = 'typescriptHero.resolve.rebuildCache';
        this.statusBarItem.show();
        this.connection.onNotification(communication_1.Notification.IndexCreationSuccessful, () => this.statusBarItem.text = resolverOk);
        this.connection.onNotification(communication_1.Notification.IndexCreationFailed, () => this.statusBarItem.text = resolverErr);
        this.connection.onNotification(communication_1.Notification.IndexCreationRunning, () => this.statusBarItem.text = resolverSyncing);
        this.context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('typescriptHero.resolve.addImport', () => this.addImport()));
        this.context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('typescriptHero.resolve.addImportUnderCursor', () => this.addImportUnderCursor()));
        this.context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('typescriptHero.resolve.addMissingImports', () => this.addMissingImports()));
        this.context.subscriptions.push(vscode_1.commands.registerTextEditorCommand('typescriptHero.resolve.organizeImports', () => this.organizeImports()));
        this.context.subscriptions.push(vscode_1.commands.registerCommand('typescriptHero.resolve.rebuildCache', () => this.buildIndex()));
        this.context.subscriptions.push(vscode_1.workspace.onDidChangeConfiguration(() => {
            if (!compareIgnorePatterns(this.ignorePatterns, this.config.resolver.ignorePatterns)) {
                this.logger.info('The typescriptHero.resolver.ignorePatterns setting was modified, reload the index.');
                this.buildIndex();
                this.ignorePatterns = this.config.resolver.ignorePatterns;
            }
        }));
        this.buildIndex();
        this.logger.info('Initialized');
    }
    dispose() {
        this.logger.info('Disposed');
    }
    buildIndex() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.statusBarItem.text = resolverSyncing;
            const files = yield findFiles(this.config);
            this.connection.sendNotification(communication_1.Notification.CreateIndexForFiles, files);
        });
    }
    addImport() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.index.indexReady) {
                this.showCacheWarning();
                return;
            }
            try {
                const selectedItem = yield vscode_1.window.showQuickPick(this.index.declarationInfos.map(o => new quick_pick_items_1.ResolveQuickPickItem(o)), { placeHolder: 'Add import to document:' });
                if (selectedItem) {
                    this.logger.info('Add import to document', { resolveItem: selectedItem });
                    this.addImportToDocument(selectedItem.declarationInfo);
                }
            }
            catch (e) {
                this.logger.error('An error happend during import picking', e);
                vscode_1.window.showErrorMessage('The import cannot be completed, there was an error during the process.');
            }
        });
    }
    addImportUnderCursor() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.index.indexReady) {
                this.showCacheWarning();
                return;
            }
            try {
                const selectedSymbol = this.getSymbolUnderCursor();
                if (!!!selectedSymbol) {
                    return;
                }
                const resolveItems = yield this.getDeclarationsForImport({
                    cursorSymbol: selectedSymbol,
                    documentSource: vscode_1.window.activeTextEditor.document.getText(),
                    documentPath: vscode_1.window.activeTextEditor.document.fileName,
                });
                if (resolveItems.length < 1) {
                    vscode_1.window.showInformationMessage(`The symbol '${selectedSymbol}' was not found in the index or is already imported.`);
                }
                else if (resolveItems.length === 1 && resolveItems[0].declaration.name === selectedSymbol) {
                    this.logger.info('Add import to document', { resolveItem: resolveItems[0] });
                    this.addImportToDocument(resolveItems[0]);
                }
                else {
                    const selectedItem = yield vscode_1.window.showQuickPick(resolveItems.map(o => new quick_pick_items_1.ResolveQuickPickItem(o)), { placeHolder: 'Multiple declarations found:' });
                    if (selectedItem) {
                        this.logger.info('Add import to document', { resolveItem: selectedItem });
                        this.addImportToDocument(selectedItem.declarationInfo);
                    }
                }
            }
            catch (e) {
                this.logger.error('An error happend during import picking', e);
                vscode_1.window.showErrorMessage('The import cannot be completed, there was an error during the process.');
            }
        });
    }
    addMissingImports() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.index.indexReady) {
                this.showCacheWarning();
                return;
            }
            try {
                const missing = yield this.getMissingDeclarationsForFile({
                    documentSource: vscode_1.window.activeTextEditor.document.getText(),
                    documentPath: vscode_1.window.activeTextEditor.document.fileName,
                });
                if (missing && missing.length) {
                    const ctrl = yield managers_1.ImportManager.create(vscode_1.window.activeTextEditor.document);
                    missing.filter(o => o instanceof declarations_1.DeclarationInfo).forEach(o => ctrl.addDeclarationImport(o));
                    yield ctrl.commit();
                }
            }
            catch (e) {
                this.logger.error('An error happend during import fixing', e);
                vscode_1.window.showErrorMessage('The operation cannot be completed, there was an error during the process.');
            }
        });
    }
    organizeImports() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const ctrl = yield managers_1.ImportManager.create(vscode_1.window.activeTextEditor.document);
                return yield ctrl.organizeImports().commit();
            }
            catch (e) {
                this.logger.error('An error happend during "organize imports".', { error: e });
                return false;
            }
        });
    }
    addImportToDocument(declaration) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const ctrl = yield managers_1.ImportManager.create(vscode_1.window.activeTextEditor.document);
            return yield ctrl.addDeclarationImport(declaration).commit();
        });
    }
    getSymbolUnderCursor() {
        const editor = vscode_1.window.activeTextEditor;
        if (!editor) {
            return '';
        }
        const selection = editor.selection;
        const word = editor.document.getWordRangeAtPosition(selection.active);
        return word && !word.isEmpty ? editor.document.getText(word) : '';
    }
    showCacheWarning() {
        vscode_1.window.showWarningMessage('Please wait a few seconds longer until the symbol cache has been build.');
    }
    getDeclarationsForImport({ cursorSymbol, documentSource, documentPath }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info(`Calculate possible imports for document with filter "${cursorSymbol}"`);
            const parsedSource = yield this.parser.parseSource(documentSource);
            const activeDocumentDeclarations = parsedSource.declarations.map(o => o.name);
            const declarations = helpers_1.getDeclarationsFilteredByImports(this.index.declarationInfos, documentPath, vscode_1.workspace.rootPath, parsedSource.imports).filter(o => o.declaration.name.startsWith(cursorSymbol));
            return [
                ...declarations.filter(o => o.from.startsWith('/')),
                ...declarations.filter(o => !o.from.startsWith('/')),
            ].filter(o => activeDocumentDeclarations.indexOf(o.declaration.name) === -1);
        });
    }
    getMissingDeclarationsForFile({ documentSource, documentPath }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const parsedDocument = yield this.parser.parseSource(documentSource);
            const missingDeclarations = [];
            const declarations = helpers_1.getDeclarationsFilteredByImports(this.index.declarationInfos, documentPath, vscode_1.workspace.rootPath, parsedDocument.imports);
            for (const usage of parsedDocument.nonLocalUsages) {
                const foundDeclarations = declarations.filter(o => o.declaration.name === usage);
                if (foundDeclarations.length <= 0) {
                    continue;
                }
                else if (foundDeclarations.length === 1) {
                    missingDeclarations.push(foundDeclarations[0]);
                }
                else {
                    missingDeclarations.push(...foundDeclarations.map(o => new transport_models_1.ImportUserDecision(o, usage)));
                }
            }
            return missingDeclarations;
        });
    }
};
ImportResolveExtension = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.extensionContext)),
    tslib_1.__param(1, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__param(2, inversify_1.inject(IoCSymbols_1.iocSymbols.configuration)),
    tslib_1.__metadata("design:paramtypes", [Object, Function, Object, CalculatedDeclarationIndex_1.CalculatedDeclarationIndex,
        ts_parsing_1.TypescriptParser,
        ClientConnection_1.ClientConnection])
], ImportResolveExtension);
exports.ImportResolveExtension = ImportResolveExtension;
