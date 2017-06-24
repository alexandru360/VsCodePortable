"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const declarations_1 = require("../declarations");
const function_parser_1 = require("./function-parser");
const identifier_parser_1 = require("./identifier-parser");
const parse_utilities_1 = require("./parse-utilities");
const typescript_1 = require("typescript");
function parseClassIdentifiers(tsResource, node) {
    for (const child of node.getChildren()) {
        switch (child.kind) {
            case typescript_1.SyntaxKind.Identifier:
                identifier_parser_1.parseIdentifier(tsResource, child);
                break;
            default:
                break;
        }
        parseClassIdentifiers(tsResource, child);
    }
}
exports.parseClassIdentifiers = parseClassIdentifiers;
function parseCtorParams(parent, ctor, node) {
    if (!node.parameters) {
        return;
    }
    node.parameters.forEach((o) => {
        if (type_guards_1.isIdentifier(o.name)) {
            ctor.parameters.push(new declarations_1.ParameterDeclaration(o.name.text, parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd()));
            if (!o.modifiers) {
                return;
            }
            parent.properties.push(new declarations_1.PropertyDeclaration(o.name.text, parse_utilities_1.getNodeVisibility(o), parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd()));
        }
        else if (type_guards_1.isObjectBindingPattern(o.name) || type_guards_1.isArrayBindingPattern(o.name)) {
            const identifiers = o.name;
            const elements = [...identifiers.elements];
            ctor.parameters = ctor.parameters.concat(elements.map((bind) => {
                if (type_guards_1.isIdentifier(bind.name)) {
                    return new declarations_1.ParameterDeclaration(bind.name.text, undefined, bind.getStart(), bind.getEnd());
                }
            }).filter(Boolean));
        }
    });
}
exports.parseCtorParams = parseCtorParams;
function parseClass(tsResource, node) {
    const name = node.name ? node.name.text : parse_utilities_1.getDefaultResourceIdentifier(tsResource);
    const classDeclaration = new declarations_1.ClassDeclaration(name, parse_utilities_1.isNodeExported(node), node.getStart(), node.getEnd());
    if (parse_utilities_1.isNodeDefaultExported(node)) {
        classDeclaration.isExported = false;
        tsResource.declarations.push(new declarations_1.DefaultDeclaration(classDeclaration.name, tsResource));
    }
    if (node.members) {
        node.members.forEach((o) => {
            if (type_guards_1.isPropertyDeclaration(o)) {
                const actualCount = classDeclaration.properties.length;
                if (o.modifiers) {
                    classDeclaration.properties.push(new declarations_1.PropertyDeclaration(o.name.text, parse_utilities_1.getNodeVisibility(o), parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd()));
                }
                if (actualCount === classDeclaration.properties.length) {
                    classDeclaration.properties.push(new declarations_1.PropertyDeclaration(o.name.text, parse_utilities_1.getNodeVisibility(o), parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd()));
                }
                return;
            }
            if (type_guards_1.isConstructorDeclaration(o)) {
                const ctor = new declarations_1.ConstructorDeclaration(classDeclaration.name, o.getStart(), o.getEnd());
                parseCtorParams(classDeclaration, ctor, o);
                classDeclaration.ctor = ctor;
                function_parser_1.parseFunctionParts(tsResource, ctor, o);
            }
            else if (type_guards_1.isMethodDeclaration(o)) {
                const method = new declarations_1.MethodDeclaration(o.name.text, o.modifiers !== undefined && o.modifiers.some(m => m.kind === typescript_1.SyntaxKind.AbstractKeyword), parse_utilities_1.getNodeVisibility(o), parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd());
                method.parameters = function_parser_1.parseMethodParams(o);
                classDeclaration.methods.push(method);
                function_parser_1.parseFunctionParts(tsResource, method, o);
            }
        });
    }
    parseClassIdentifiers(tsResource, node);
    tsResource.declarations.push(classDeclaration);
}
exports.parseClass = parseClass;
