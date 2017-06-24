"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const usageNotAllowedParents = [
    typescript_1.SyntaxKind.ImportEqualsDeclaration,
    typescript_1.SyntaxKind.ImportSpecifier,
    typescript_1.SyntaxKind.NamespaceImport,
    typescript_1.SyntaxKind.ClassDeclaration,
    typescript_1.SyntaxKind.ImportDeclaration,
    typescript_1.SyntaxKind.InterfaceDeclaration,
    typescript_1.SyntaxKind.ExportDeclaration,
    typescript_1.SyntaxKind.ExportSpecifier,
    typescript_1.SyntaxKind.ImportSpecifier,
    typescript_1.SyntaxKind.FunctionDeclaration,
    typescript_1.SyntaxKind.EnumDeclaration,
    typescript_1.SyntaxKind.TypeAliasDeclaration,
    typescript_1.SyntaxKind.MethodDeclaration,
];
const usageAllowedIfLast = [
    typescript_1.SyntaxKind.Parameter,
    typescript_1.SyntaxKind.PropertyDeclaration,
    typescript_1.SyntaxKind.VariableDeclaration,
    typescript_1.SyntaxKind.ElementAccessExpression,
    typescript_1.SyntaxKind.BinaryExpression,
];
const usagePredicates = [
    (o) => o.parent && usageNotAllowedParents.indexOf(o.parent.kind) === -1,
    allowedIfLastIdentifier,
    allowedIfPropertyAccessFirst,
];
function allowedIfLastIdentifier(node) {
    if (!node.parent) {
        return false;
    }
    if (usageAllowedIfLast.indexOf(node.parent.kind) === -1) {
        return true;
    }
    const children = node.parent.getChildren().filter(o => o.kind === typescript_1.SyntaxKind.Identifier);
    return children.length === 1 || children.indexOf(node) === 1;
}
function allowedIfPropertyAccessFirst(node) {
    if (!node.parent) {
        return false;
    }
    if (node.parent.kind !== typescript_1.SyntaxKind.PropertyAccessExpression) {
        return true;
    }
    const children = node.parent.getChildren();
    return children.indexOf(node) === 0;
}
function parseIdentifier(resource, node) {
    if (node.parent && usagePredicates.every(predicate => predicate(node))) {
        if (resource.usages.indexOf(node.text) === -1) {
            resource.usages.push(node.text);
        }
    }
}
exports.parseIdentifier = parseIdentifier;
