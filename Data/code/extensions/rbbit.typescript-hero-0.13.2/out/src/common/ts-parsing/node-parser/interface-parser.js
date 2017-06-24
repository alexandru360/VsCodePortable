"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const declarations_1 = require("../declarations");
const function_parser_1 = require("./function-parser");
const parse_utilities_1 = require("./parse-utilities");
function parseInterface(resource, node) {
    const name = node.name ? node.name.text : parse_utilities_1.getDefaultResourceIdentifier(resource);
    const interfaceDeclaration = new declarations_1.InterfaceDeclaration(name, parse_utilities_1.isNodeExported(node), node.getStart(), node.getEnd());
    if (parse_utilities_1.isNodeDefaultExported(node)) {
        interfaceDeclaration.isExported = false;
        resource.declarations.push(new declarations_1.DefaultDeclaration(interfaceDeclaration.name, resource));
    }
    if (node.members) {
        node.members.forEach((o) => {
            if (type_guards_1.isPropertySignature(o)) {
                interfaceDeclaration.properties.push(new declarations_1.PropertyDeclaration(o.name.text, 2, parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd()));
            }
            else if (type_guards_1.isMethodSignature(o)) {
                const method = new declarations_1.MethodDeclaration(o.name.text, true, 2, parse_utilities_1.getNodeType(o.type), o.getStart(), o.getEnd());
                method.parameters = function_parser_1.parseMethodParams(o);
                interfaceDeclaration.methods.push(method);
            }
        });
    }
    resource.declarations.push(interfaceDeclaration);
}
exports.parseInterface = parseInterface;
