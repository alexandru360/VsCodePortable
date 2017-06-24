"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const CalculatedDeclarationIndex_1 = require("../declarations/CalculatedDeclarationIndex");
const CodeAction_1 = require("./CodeAction");
const CodeActionCreator_1 = require("./CodeActionCreator");
const inversify_1 = require("inversify");
let MissingImportCreator = class MissingImportCreator extends CodeActionCreator_1.CodeActionCreator {
    constructor(index) {
        super();
        this.index = index;
    }
    canHandleDiagnostic(diagnostic) {
        return /cannot find name ['"](.*)['"]/ig.test(diagnostic.message);
    }
    handleDiagnostic(document, commands, diagnostic) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const match = /cannot find name ['"](.*)['"]/ig.exec(diagnostic.message);
            if (!match) {
                return commands;
            }
            const infos = this.index.declarationInfos.filter(o => o.declaration.name === match[1]);
            if (infos.length > 0) {
                for (const info of infos) {
                    commands.push(this.createCommand(`Import "${info.declaration.name}" from "${info.from}".`, new CodeAction_1.AddImportCodeAction(document, info)));
                }
                if (!commands.some(o => o.arguments !== undefined &&
                    o.arguments.some(a => a instanceof CodeAction_1.AddMissingImportsCodeAction))) {
                    commands.push(this.createCommand('Add all missing imports if possible.', new CodeAction_1.AddMissingImportsCodeAction(document, this.index)));
                }
            }
            else {
                commands.push(this.createCommand(`Cannot find "${match[1]}" in the index.`, new CodeAction_1.NoopCodeAction()));
            }
            return commands;
        });
    }
};
MissingImportCreator = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [CalculatedDeclarationIndex_1.CalculatedDeclarationIndex])
], MissingImportCreator);
exports.MissingImportCreator = MissingImportCreator;
