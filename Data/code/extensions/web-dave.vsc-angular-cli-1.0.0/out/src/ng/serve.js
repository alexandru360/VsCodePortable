'use strict';
var vscode = require('vscode');
var run_1 = require('./run');
exports.ngserve = vscode.commands.registerCommand('extension.ngServe', function () {
    vscode.window.showInputBox({ placeHolder: 'Enter optional paramaters if any, example --port 4201 --host 0.0.0.0' })
        .then(function (optionalParams) {
        if (optionalParams === void 0) { optionalParams = ''; }
        run_1.runNgCommand([("serve " + optionalParams)], true);
    });
});
//# sourceMappingURL=serve.js.map