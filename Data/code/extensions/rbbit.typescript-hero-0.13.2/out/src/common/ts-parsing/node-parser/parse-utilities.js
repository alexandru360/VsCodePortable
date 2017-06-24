"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../resources");
const typescript_1 = require("typescript");
function isNodeExported(node) {
    const flags = typescript_1.getCombinedModifierFlags(node);
    return (flags & typescript_1.ModifierFlags.Export) === typescript_1.ModifierFlags.Export;
}
exports.isNodeExported = isNodeExported;
function isNodeDefaultExported(node) {
    const flags = typescript_1.getCombinedModifierFlags(node);
    return (flags & typescript_1.ModifierFlags.Default) === typescript_1.ModifierFlags.Default;
}
exports.isNodeDefaultExported = isNodeDefaultExported;
function getNodeType(node) {
    return node ? node.getText() : undefined;
}
exports.getNodeType = getNodeType;
function getNodeVisibility(node) {
    if (!node.modifiers) {
        return undefined;
    }
    for (const modifier of node.modifiers) {
        switch (modifier.kind) {
            case typescript_1.SyntaxKind.PublicKeyword:
                return 2;
            case typescript_1.SyntaxKind.ProtectedKeyword:
                return 1;
            case typescript_1.SyntaxKind.PrivateKeyword:
                return 0;
            default:
                break;
        }
    }
}
exports.getNodeVisibility = getNodeVisibility;
function getDefaultResourceIdentifier(resource) {
    if (resource instanceof resources_1.File && resource.isWorkspaceFile) {
        return resource.parsedPath.name;
    }
    return resource.identifier;
}
exports.getDefaultResourceIdentifier = getDefaultResourceIdentifier;
