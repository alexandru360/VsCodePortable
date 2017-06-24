"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = require("../resources");
const typescript_1 = require("typescript");
function parseModule(resource, node) {
    const newResource = (node.flags & typescript_1.NodeFlags.Namespace) === typescript_1.NodeFlags.Namespace ?
        new resources_1.Namespace(node.name.text, node.getStart(), node.getEnd()) :
        new resources_1.Module(node.name.text, node.getStart(), node.getEnd());
    resource.resources.push(newResource);
    return newResource;
}
exports.parseModule = parseModule;
