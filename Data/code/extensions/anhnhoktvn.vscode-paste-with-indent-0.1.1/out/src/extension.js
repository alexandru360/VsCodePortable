"use strict";
var vscode = require("vscode");
var pasteWithIndent = function () {
    var config = vscode.workspace.getConfiguration("pasteWithIndent");
    var editor = vscode.window.activeTextEditor;
    var start = editor.selection.start;
    var offset = start.character;
    if (offset === 0) {
        return; // Skip indentation
    }
    vscode.commands
        .executeCommand("editor.action.clipboardPasteAction")
        .then(function () {
        var end = editor.selection.end;
        var selectionToIndent = new vscode.Selection(start.line, start.character, end.line, end.character);
        var selectedText = editor.document.getText(selectionToIndent);
        var linesToIndent = selectedText.split("\n");
        if (linesToIndent.length <= 1) {
            return; // Skip indentation
        }
        linesToIndent = linesToIndent.map(function (line, i) { return (i === 0 ? line : " ".repeat(offset) + line); });
        // tab mode
        if (!editor.options.insertSpaces) {
            var size_1 = Number(editor.options.tabSize);
            var reg = new RegExp("^( {" + size_1 + "})+");
            linesToIndent = linesToIndent.map(function (line) {
                var length = line.search(/\S/);
                if (length < 2) {
                    return line;
                }
                return ("\t".repeat(Math.floor(length / size_1)) +
                    " ".repeat(length % size_1) +
                    line.substr(length));
            });
        }
        editor.edit(function (editBuilder) {
            editBuilder.replace(selectionToIndent, linesToIndent.join("\n"));
        });
    });
};
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand("pasteWithIndent.action", pasteWithIndent));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map