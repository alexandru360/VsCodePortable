"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const declarations_1 = require("../declarations");
const exports_1 = require("../exports");
const SymbolSpecifier_1 = require("../SymbolSpecifier");
const parse_utilities_1 = require("./parse-utilities");
function parseExport(resource, node) {
    if (type_guards_1.isExportDeclaration(node)) {
        const tsExport = node;
        if (!type_guards_1.isStringLiteral(tsExport.moduleSpecifier)) {
            return;
        }
        if (tsExport.getText().indexOf('*') > -1) {
            resource.exports.push(new exports_1.AllExport(node.getStart(), node.getEnd(), tsExport.moduleSpecifier.text));
        }
        else if (tsExport.exportClause && type_guards_1.isNamedExports(tsExport.exportClause)) {
            const lib = tsExport.moduleSpecifier;
            const ex = new exports_1.NamedExport(node.getStart(), node.getEnd(), lib.text);
            ex.specifiers = tsExport.exportClause.elements.map(o => o.propertyName && o.name ?
                new SymbolSpecifier_1.SymbolSpecifier(o.propertyName.text, o.name.text) :
                new SymbolSpecifier_1.SymbolSpecifier(o.name.text));
            resource.exports.push(ex);
        }
    }
    else {
        const literal = node.expression;
        if (node.isExportEquals) {
            resource.exports.push(new exports_1.AssignedExport(node.getStart(), node.getEnd(), literal.text, resource));
        }
        else {
            const name = (literal && literal.text) ? literal.text : parse_utilities_1.getDefaultResourceIdentifier(resource);
            resource.declarations.push(new declarations_1.DefaultDeclaration(name, resource));
        }
    }
}
exports.parseExport = parseExport;
