"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isCallableDeclaration(obj) {
    return obj && obj.parameters && obj.variables;
}
exports.isCallableDeclaration = isCallableDeclaration;
function isExportableDeclaration(obj) {
    return obj && Object.keys(obj).indexOf('isExported') >= 0;
}
exports.isExportableDeclaration = isExportableDeclaration;
function isAliasedImport(obj) {
    return obj && Object.keys(obj).indexOf('alias') >= 0;
}
exports.isAliasedImport = isAliasedImport;
