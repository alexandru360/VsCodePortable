'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const path = require("path");
class RequestBodyDocumentLinkProvider {
    constructor() {
        this._linkPattern = /^(\<\s+)(\S+)(\s*)$/g;
    }
    provideDocumentLinks(document, _token) {
        const results = [];
        const base = path.dirname(document.uri.fsPath);
        const text = document.getText();
        let lines = text.split(/\r?\n/g);
        for (var index = 0; index < lines.length; index++) {
            var line = lines[index];
            let match;
            if (match = this._linkPattern.exec(line)) {
                let filePath = match[2];
                const offset = match[1].length;
                const linkStart = new vscode_1.Position(index, offset);
                const linkEnd = new vscode_1.Position(index, offset + filePath.length);
                results.push(new vscode_1.DocumentLink(new vscode_1.Range(linkStart, linkEnd), this.normalizeLink(document, filePath, base)));
            }
        }
        return results;
    }
    normalizeLink(document, link, base) {
        const uri = vscode_1.Uri.parse(link);
        if (uri.scheme) {
            return uri;
        }
        // assume it must be a file
        let resourcePath;
        if (!uri.path) {
            resourcePath = document.uri.path;
        }
        else if (path.isAbsolute(uri.path)) {
            resourcePath = uri.path;
        }
        else if (vscode_1.workspace.rootPath) {
            resourcePath = path.join(vscode_1.workspace.rootPath, uri.path);
        }
        else {
            resourcePath = path.join(base, uri.path);
        }
        return vscode_1.Uri.parse(`command:rest-client._openDocumentLink?${encodeURIComponent(JSON.stringify({ fragment: uri.fragment, path: resourcePath }))}`);
    }
}
exports.RequestBodyDocumentLinkProvider = RequestBodyDocumentLinkProvider;
//# sourceMappingURL=documentLinkProvider.js.map