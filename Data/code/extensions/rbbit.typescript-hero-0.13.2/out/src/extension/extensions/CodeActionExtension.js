"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CalculatedDeclarationIndex_1 = require("../declarations/CalculatedDeclarationIndex");
const IoCSymbols_1 = require("../IoCSymbols");
const BaseExtension_1 = require("./BaseExtension");
const inversify_1 = require("inversify");
const vscode_1 = require("vscode");
let CodeActionExtension = class CodeActionExtension extends BaseExtension_1.BaseExtension {
    constructor(context, loggerFactory, actionCreators, index) {
        super(context);
        this.actionCreators = actionCreators;
        this.index = index;
        this.logger = loggerFactory('CodeActionExtension');
    }
    initialize() {
        this.context.subscriptions.push(vscode_1.commands.registerCommand('typescriptHero.codeFix.executeCodeAction', (codeAction) => this.executeCodeAction(codeAction)));
        this.context.subscriptions.push(vscode_1.languages.registerCodeActionsProvider('typescript', this));
        this.context.subscriptions.push(vscode_1.languages.registerCodeActionsProvider('typescriptreact', this));
        this.logger.info('Initialized');
    }
    dispose() {
        this.logger.info('Disposed');
    }
    provideCodeActions(document, _range, context, _token) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.index.indexReady) {
                return [];
            }
            let commands = [];
            for (const diagnostic of context.diagnostics) {
                for (const creator of this.actionCreators) {
                    if (creator.canHandleDiagnostic(diagnostic)) {
                        commands = yield creator.handleDiagnostic(document, commands, diagnostic);
                    }
                }
            }
            return commands;
        });
    }
    executeCodeAction(codeAction) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!(yield codeAction.execute())) {
                vscode_1.window.showWarningMessage('The provided code action could not complete. Please see the logs.');
            }
        });
    }
};
CodeActionExtension = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.extensionContext)),
    tslib_1.__param(1, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__param(2, inversify_1.multiInject(IoCSymbols_1.iocSymbols.codeActionCreators)),
    tslib_1.__metadata("design:paramtypes", [Object, Function, Array, CalculatedDeclarationIndex_1.CalculatedDeclarationIndex])
], CodeActionExtension);
exports.CodeActionExtension = CodeActionExtension;
