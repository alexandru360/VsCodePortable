'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const HTML_MODE = { language: 'html', scheme: 'file' };
const HTML_TAGS = [
    'html', 'head', 'body',
    'script', 'style',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'div', 'p', 'a', 'img', 'span', 'strong', 'em',
    'table', 'thead', 'tbody', 'th', 'tr', 'td',
    'ul', 'li', 'ol', 'dl', 'dt', 'dd',
    'form', 'input', 'label', 'button',
    'class', 'id', 'src', 'href',
    'click', 'mousemove',
];
class HTMLDefinitionProvider {
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => {
            let range = document.getWordRangeAtPosition(position);
            let word = document.getText(range);
            if (word.endsWith('?')) {
                word = word.slice(0, word.length - 1);
            }
            let wordType = 0; // 0: property, 1: function
            // check word as function or property.
            if (HTML_TAGS.findIndex(tag => tag === word.toLowerCase()) >= 0) {
                // console.log(`${word} is html tag.`);
                resolve();
            }
            // if next character is '(', so word is function
            if (document.getText(new vscode.Range(range.end, range.end.translate(0, 1))) === '(') {
                wordType = 1;
            }
            // console.log(`wordType: ${wordType}`);
            let pattern;
            if (wordType === 0) {
                pattern = `^\\s*(private\\s+)?(${word})|^\\s*(public\\s+)?(${word})|^\\s*(protected\\s+)?(${word})`;
            }
            else {
                pattern = `^\\s*(private\\s+)?(${word})\\(.*\\)|^\\s*(public\\s+)?(${word})\\(.*\\)|^\\s*(protected\\s+)?(${word})\\(.*\\)`;
            }
            let rgx = new RegExp(pattern);
            // find function|property in ts
            let htmlFile = document.fileName;
            let fileNameWithoutExtension = htmlFile.slice(0, htmlFile.lastIndexOf('.'));
            let tsFile = fileNameWithoutExtension + '.ts';
            let tsUri = vscode.Uri.file(tsFile);
            let enterClass = false;
            vscode.workspace.openTextDocument(tsFile).then((tsDoc) => {
                let lineCount = tsDoc.lineCount;
                for (var li = 0; li < tsDoc.lineCount; li++) {
                    let line = tsDoc.lineAt(li);
                    if (line.isEmptyOrWhitespace) {
                        continue;
                    }
                    if (!enterClass) {
                        if (line.text.match(/\s+class\s+/)) {
                            enterClass = true;
                        }
                        continue;
                    }
                    let m = line.text.match(rgx);
                    if (m && m.length > 0) {
                        let pos = line.text.indexOf(word);
                        resolve(new vscode.Location(tsUri, new vscode.Position(li, pos)));
                    }
                }
                resolve();
            });
        });
    }
}
function fileIs(path, ...items) {
    if (!items) {
        return false;
    }
    let lPath = path.toLowerCase();
    for (var index = 0; index < items.length; index++) {
        var element = items[index];
        if (path.endsWith(items[index].toLowerCase())) {
            return true;
        }
    }
    return false;
}
let previous = '';
function xOpenTextDocument(path, viewColumn) {
    return new Promise((resolve, reject) => {
        vscode.workspace.openTextDocument(path)
            .then((doc) => {
            vscode.window.showTextDocument(doc, viewColumn).then(() => {
                resolve(doc);
            }, (err) => {
                reject(err);
            });
        }, (err) => {
            reject(err);
        });
    });
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "angular2-switcher" is now active!');
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(HTML_MODE, new HTMLDefinitionProvider()));
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let cmdSwitchTemplate = vscode.commands.registerCommand('extension.switchTemplate', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        // vscode.window.showInformationMessage('Hello World!');
        if (!vscode.workspace) {
            return;
        }
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile = '';
        if (fileIs(currentFile, 'ts', 'scss', 'sass', 'less', 'css')) {
            targetFile = fileNameWithoutExtension + '.html';
        }
        else if (fileIs(currentFile, '.html')) {
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile = previous;
                }
                else {
                    targetFile = fileNameWithoutExtension + '.ts';
                }
            }
            else {
                targetFile = fileNameWithoutExtension + '.ts';
            }
        }
        else {
            return;
        }
        xOpenTextDocument(targetFile, editor.viewColumn).then(() => {
            previous = currentFile;
        }, (err) => {
            console.log(err);
        });
    });
    let cmdSwitchTS = vscode.commands.registerCommand('extension.switchTS', () => {
        if (!vscode.workspace) {
            return;
        }
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile = '';
        if (fileIs(currentFile, 'html', 'scss', 'sass', 'less', 'css')) {
            targetFile = fileNameWithoutExtension + '.ts';
        }
        else if (fileIs(currentFile, '.ts')) {
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile = previous;
                }
                else {
                    targetFile = fileNameWithoutExtension + '.html';
                }
            }
            else {
                targetFile = fileNameWithoutExtension + '.html';
            }
        }
        else {
            return;
        }
        xOpenTextDocument(targetFile, editor.viewColumn).then(() => {
            previous = currentFile;
        }, (err) => {
            // console.log(err);
        });
    });
    let cmdSwitchStyle = vscode.commands.registerCommand('extension.switchStyle', () => {
        if (!vscode.workspace) {
            return;
        }
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        var currentFile = editor.document.fileName;
        let fileNameWithoutExtension = currentFile.slice(0, currentFile.lastIndexOf('.'));
        var targetFile = [];
        if (fileIs(currentFile, 'scss', 'sass', 'less', 'css')) {
            if (previous && previous !== currentFile) {
                if (previous.startsWith(fileNameWithoutExtension)) {
                    targetFile.push(previous);
                }
                else {
                    targetFile.push(fileNameWithoutExtension + '.html');
                }
            }
            else {
                targetFile.push(fileNameWithoutExtension + '.html');
            }
        }
        else if (fileIs(currentFile, '.ts', '.html')) {
            targetFile.push(fileNameWithoutExtension + '.scss');
            targetFile.push(fileNameWithoutExtension + '.sass');
            targetFile.push(fileNameWithoutExtension + '.less');
            targetFile.push(fileNameWithoutExtension + '.css');
        }
        else {
            return;
        }
        var g = gen(targetFile, editor.viewColumn);
        function next() {
            var result = g.next();
            if (result.done)
                return;
            result.value.then(() => {
                previous = currentFile;
                return;
            }, (err) => {
                // console.log(err);
                next();
            });
        }
        next();
    });
    context.subscriptions.push(cmdSwitchTemplate, cmdSwitchStyle, cmdSwitchTS);
}
exports.activate = activate;
function* gen(files, viewColumn) {
    for (var index = 0; index < files.length; index++) {
        yield xOpenTextDocument(files[index], viewColumn);
    }
}
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map