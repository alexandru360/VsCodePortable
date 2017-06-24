"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const helpers_1 = require("../../common/helpers");
const ts_parsing_1 = require("../../common/ts-parsing");
const imports_1 = require("../../common/ts-parsing/imports");
const CalculatedDeclarationIndex_1 = require("../declarations/CalculatedDeclarationIndex");
const CodeAction_1 = require("./CodeAction");
const CodeActionCreator_1 = require("./CodeActionCreator");
const inversify_1 = require("inversify");
const vscode_1 = require("vscode");
let MissingImplementationInClassCreator = class MissingImplementationInClassCreator extends CodeActionCreator_1.CodeActionCreator {
    constructor(parser, index) {
        super();
        this.parser = parser;
        this.index = index;
    }
    canHandleDiagnostic(diagnostic) {
        return /class ['"](.*)['"] incorrectly implements.*['"](.*)['"]\./ig.test(diagnostic.message) ||
            /non-abstract class ['"](.*)['"].*implement inherited.*from class ['"](.*)['"]\./ig.test(diagnostic.message);
    }
    handleDiagnostic(document, commands, diagnostic) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const match = /class ['"](.*)['"] incorrectly implements.*['"](.*)['"]\./ig.exec(diagnostic.message) ||
                /non-abstract class ['"](.*)['"].*implement inherited.*from class ['"](.*)['"]\./ig.exec(diagnostic.message);
            if (!match) {
                return commands;
            }
            const parsedDocument = yield this.parser.parseSource(document.getText());
            const alreadyImported = parsedDocument.imports.find(o => o instanceof imports_1.NamedImport && o.specifiers.some(s => s.specifier === match[2]));
            const declaration = parsedDocument.declarations.find(o => o.name === match[2]) ||
                (this.index.declarationInfos.find(o => o.declaration.name === match[2] &&
                    o.from === helpers_1.getAbsolutLibraryName(alreadyImported.libraryName, document.fileName, vscode_1.workspace.rootPath)) || { declaration: undefined }).declaration;
            if (commands.some((o) => o.title.indexOf(match[2]) >= 0)) {
                return commands;
            }
            if (!declaration) {
                commands.push(this.createCommand(`Cannot find "${match[2]}" in the index or the actual file.`, new CodeAction_1.NoopCodeAction()));
                return commands;
            }
            commands.push(this.createCommand(`Implement missing elements from "${match[2]}".`, new CodeAction_1.ImplementPolymorphElements(document, match[1], declaration)));
            return commands;
        });
    }
};
MissingImplementationInClassCreator = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [ts_parsing_1.TypescriptParser, CalculatedDeclarationIndex_1.CalculatedDeclarationIndex])
], MissingImplementationInClassCreator);
exports.MissingImplementationInClassCreator = MissingImplementationInClassCreator;
