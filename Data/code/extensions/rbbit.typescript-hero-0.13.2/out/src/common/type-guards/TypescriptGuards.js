"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
function isImportDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ImportDeclaration;
}
exports.isImportDeclaration = isImportDeclaration;
function isImportEqualsDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ImportEqualsDeclaration;
}
exports.isImportEqualsDeclaration = isImportEqualsDeclaration;
function isNamespaceImport(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.NamespaceImport;
}
exports.isNamespaceImport = isNamespaceImport;
function isNamedImports(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.NamedImports;
}
exports.isNamedImports = isNamedImports;
function isNamedExports(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.NamedExports;
}
exports.isNamedExports = isNamedExports;
function isStringLiteral(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.StringLiteral;
}
exports.isStringLiteral = isStringLiteral;
function isIdentifier(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.Identifier;
}
exports.isIdentifier = isIdentifier;
function isExternalModuleReference(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ExternalModuleReference;
}
exports.isExternalModuleReference = isExternalModuleReference;
function isExportDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ExportDeclaration;
}
exports.isExportDeclaration = isExportDeclaration;
function isObjectBindingPattern(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ObjectBindingPattern;
}
exports.isObjectBindingPattern = isObjectBindingPattern;
function isArrayBindingPattern(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.ArrayBindingPattern;
}
exports.isArrayBindingPattern = isArrayBindingPattern;
function isFunctionDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.FunctionDeclaration;
}
exports.isFunctionDeclaration = isFunctionDeclaration;
function isMethodSignature(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.MethodSignature;
}
exports.isMethodSignature = isMethodSignature;
function isPropertySignature(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.PropertySignature;
}
exports.isPropertySignature = isPropertySignature;
function isMethodDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.MethodDeclaration;
}
exports.isMethodDeclaration = isMethodDeclaration;
function isPropertyDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.PropertyDeclaration;
}
exports.isPropertyDeclaration = isPropertyDeclaration;
function isConstructorDeclaration(node) {
    return node !== undefined && node.kind === typescript_1.SyntaxKind.Constructor;
}
exports.isConstructorDeclaration = isConstructorDeclaration;
