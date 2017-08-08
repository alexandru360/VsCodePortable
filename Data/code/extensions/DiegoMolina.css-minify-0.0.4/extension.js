const {
    commands,
    window
} = require('vscode');

const path = require('path');
const fs = require('fs');

const Minifier = require('./cssMinifier.js');

function activate(context) {

    let disposable = commands.registerCommand('extension.minify', function () {
        if (window.activeTextEditor.document.languageId === 'css') {
            let content = window.activeTextEditor.document.getText().split("\n");
            let fileName = window.activeTextEditor.document.fileName;
            let filePath = path.dirname(fileName);
            let name = path.basename(fileName).replace('css', 'min.css');
            let savePath = path.join(filePath, name);

            const mini = new Minifier();
            mini.setContent(content);
            mini.cleanCSS().then(data => {
                fs.writeFile(savePath, data, response => {
                    window.showInformationMessage(`A minified file has been created with this name: ${name}`);
                });
            }, reason => window.showErrorMessage(reason));

        } else {
            window.showWarningMessage("This extension must be use on a CSS file");
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;