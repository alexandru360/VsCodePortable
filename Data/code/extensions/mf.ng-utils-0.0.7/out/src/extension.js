'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const helpers_1 = require("./helpers");
const source_file_manager_1 = require("./source-file-manager");
let sourceFileManager;
let uid = 0;
let histories = {};
function activate(context) {
    getSourceFileManager();
    vscode.window.onDidChangeActiveTextEditor(textEditor => {
        let document = textEditor.document;
        histories[document.fileName] = ++uid;
    });
    let openCommandDisposable = vscode.commands
        .registerCommand('ngUtils.openFileWithTheSameName', () => __awaiter(this, void 0, void 0, function* () {
        openFileWithTheSameName();
    }));
    context.subscriptions.push(openCommandDisposable);
    let openToTheSideCommandDisposable = vscode.commands
        .registerCommand('ngUtils.openFileWithTheSameNameToTheSide', () => __awaiter(this, void 0, void 0, function* () {
        openFileWithTheSameName(true);
    }));
    context.subscriptions.push(openToTheSideCommandDisposable);
    let renameRelatedFilesDisposable = vscode.commands
        .registerCommand('ngUtils.renameRelatedFiles', (target) => __awaiter(this, void 0, void 0, function* () {
        let filename;
        if (!target || !target.path) {
            let activeTextEditor = vscode.window.activeTextEditor;
            if (activeTextEditor) {
                let activeDocument = activeTextEditor.document;
                filename = activeDocument.fileName;
            }
            else {
                return;
            }
        }
        else {
            filename = target.fsPath;
        }
        let newName = yield vscode.window.showInputBox({
            placeHolder: 'Input new name',
        });
        if (!newName) {
            return;
        }
        yield source_file_manager_1.default.rename(filename, newName);
    }));
    context.subscriptions.push(renameRelatedFilesDisposable);
}
exports.activate = activate;
function deactivate() {
    if (sourceFileManager) {
        sourceFileManager.destroy();
    }
    sourceFileManager = undefined;
}
exports.deactivate = deactivate;
function getSourceFileManager() {
    if (!sourceFileManager && vscode.workspace.rootPath) {
        sourceFileManager = new source_file_manager_1.default(helpers_1.resolveSourceRootDirs(vscode.workspace.rootPath));
    }
    return sourceFileManager;
}
function openFileWithTheSameName(side = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        let activeDocument = activeTextEditor.document;
        let filename = activeDocument.fileName;
        let selectItemsPromise = source_file_manager_1.default.resolveSameNameFiles(filename)
            .then(files => {
            let items = files.map(file => ({
                label: file.filename,
                description: file.kind,
                file,
            }));
            items.sort((a, b) => {
                return histories[a.file.absolutePath] > histories[b.file.absolutePath] ? -1 : 1;
            });
            return items;
        });
        let selectItem = yield vscode.window.showQuickPick(selectItemsPromise, {
            placeHolder: 'Select a file',
        });
        if (!selectItem) {
            return;
        }
        let nextDocument = yield vscode.workspace.openTextDocument(selectItem.file.absolutePath);
        let activeViewColumn = activeTextEditor.viewColumn;
        let targetViewColumn = activeViewColumn;
        if (side && activeViewColumn) {
            targetViewColumn = activeViewColumn === 1 ? 2 : activeViewColumn - 1;
        }
        vscode.window.showTextDocument(nextDocument, targetViewColumn);
    });
}
//# sourceMappingURL=extension.js.map