"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_generation_1 = require("../ts-generation");
const vscode_1 = require("vscode");
function getImportInsertPosition(location, editor) {
    if (!editor) {
        return new vscode_1.Position(0, 0);
    }
    if (location === ts_generation_1.ImportLocation.TopOfFile) {
        return editor.document.lineAt(0).text.match(/use strict/) ? new vscode_1.Position(1, 0) : new vscode_1.Position(0, 0);
    }
    return new vscode_1.Position(editor.selection.active.line, 0);
}
exports.getImportInsertPosition = getImportInsertPosition;
