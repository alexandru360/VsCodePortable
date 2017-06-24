"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_utilities_1 = require("./parse-utilities");
const declarations_1 = require("../declarations");
function parseEnum(resource, node) {
    const declaration = new declarations_1.EnumDeclaration(node.name.text, parse_utilities_1.isNodeExported(node), node.getStart(), node.getEnd());
    declaration.members = node.members.map(o => o.name.getText());
    resource.declarations.push(declaration);
}
exports.parseEnum = parseEnum;
