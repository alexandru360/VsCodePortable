'use strict';
var vscode = require('vscode');
var run_1 = require('./run');
exports.ngbuild = vscode.commands.registerCommand('extension.ngBuild', function () {
    vscode.window.showInputBox({ placeHolder: 'Enter optional paramaters if any, example --target=production --environment=prod' })
        .then(function (optionalParams) {
        if (optionalParams === void 0) { optionalParams = ''; }
        run_1.runNgCommand([("build " + optionalParams)], true);
    });
});
//# sourceMappingURL=build.js.map