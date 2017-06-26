'use strict';
var vscode = require('vscode');
var run_1 = require('./run');
exports.ngeject = vscode.commands.registerCommand('extension.ngEject', function () {
    run_1.runNgCommand(['eject'], true);
});
//# sourceMappingURL=eject.js.map