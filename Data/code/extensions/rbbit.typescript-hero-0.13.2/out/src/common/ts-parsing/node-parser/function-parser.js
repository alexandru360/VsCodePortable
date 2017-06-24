"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const declarations_1 = require("../declarations");
const identifier_parser_1 = require("./identifier-parser");
const parse_utilities_1 = require("./parse-utilities");
const variable_parser_1 = require("./variable-parser");
const typescript_1 = require("typescript");
function parseFunctionParts(resource, parent, node) {
    for (const child of node.getChildren()) {
        switch (child.kind) {
            case typescript_1.SyntaxKind.Identifier:
                identifier_parser_1.parseIdentifier(resource, child);
                break;
            case typescript_1.SyntaxKind.VariableStatement:
                variable_parser_1.parseVariable(parent, child);
                break;
            default:
                break;
        }
        parseFunctionParts(resource, parent, child);
    }
}
exports.parseFunctionParts = parseFunctionParts;
function parseMethodParams(node) {
    return node.parameters.reduce((all, cur) => {
        let params = all;
        if (type_guards_1.isIdentifier(cur.name)) {
            params.push(new declarations_1.ParameterDeclaration(cur.name.text, parse_utilities_1.getNodeType(cur.type), cur.getStart(), cur.getEnd()));
        }
        else if (type_guards_1.isObjectBindingPattern(cur.name) || type_guards_1.isArrayBindingPattern(cur.name)) {
            const identifiers = cur.name;
            const elements = [...identifiers.elements];
            params = params.concat(elements.map((o) => {
                if (type_guards_1.isIdentifier(o.name)) {
                    return new declarations_1.ParameterDeclaration(o.name.text, undefined, o.getStart(), o.getEnd());
                }
            }).filter(Boolean));
        }
        return params;
    }, []);
}
exports.parseMethodParams = parseMethodParams;
function parseFunction(resource, node) {
    const name = node.name ? node.name.text : parse_utilities_1.getDefaultResourceIdentifier(resource);
    const func = new declarations_1.FunctionDeclaration(name, parse_utilities_1.isNodeExported(node), parse_utilities_1.getNodeType(node.type), node.getStart(), node.getEnd());
    if (parse_utilities_1.isNodeDefaultExported(node)) {
        func.isExported = false;
        resource.declarations.push(new declarations_1.DefaultDeclaration(func.name, resource));
    }
    func.parameters = parseMethodParams(node);
    resource.declarations.push(func);
    parseFunctionParts(resource, func, node);
}
exports.parseFunction = parseFunction;
