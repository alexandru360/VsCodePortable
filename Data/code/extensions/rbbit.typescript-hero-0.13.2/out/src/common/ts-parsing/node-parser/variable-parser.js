"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const declarations_1 = require("../declarations");
const parse_utilities_1 = require("./parse-utilities");
const typescript_1 = require("typescript");
function parseVariable(parent, node) {
    const isConst = node.declarationList.getChildren().some(o => o.kind === typescript_1.SyntaxKind.ConstKeyword);
    if (node.declarationList && node.declarationList.declarations) {
        node.declarationList.declarations.forEach((o) => {
            const declaration = new declarations_1.VariableDeclaration(o.name.getText(), isConst, parse_utilities_1.isNodeExported(node), parse_utilities_1.getNodeType(o.type), node.getStart(), node.getEnd());
            if (type_guards_1.isCallableDeclaration(parent)) {
                parent.variables.push(declaration);
            }
            else {
                parent.declarations.push(declaration);
            }
        });
    }
}
exports.parseVariable = parseVariable;
