"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declarations_1 = require("../declarations");
const parse_utilities_1 = require("./parse-utilities");
function parseTypeAlias(resource, node) {
    resource.declarations.push(new declarations_1.TypeAliasDeclaration(node.name.text, parse_utilities_1.isNodeExported(node), node.getStart(), node.getEnd()));
}
exports.parseTypeAlias = parseTypeAlias;
