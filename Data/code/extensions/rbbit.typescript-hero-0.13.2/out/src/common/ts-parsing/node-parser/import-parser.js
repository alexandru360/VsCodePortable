"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_guards_1 = require("../../type-guards");
const imports_1 = require("../imports");
const SymbolSpecifier_1 = require("../SymbolSpecifier");
function parseImport(resource, node) {
    if (type_guards_1.isImportDeclaration(node)) {
        if (node.importClause && type_guards_1.isNamespaceImport(node.importClause.namedBindings)) {
            const lib = node.moduleSpecifier;
            const alias = node.importClause.namedBindings.name;
            resource.imports.push(new imports_1.NamespaceImport(lib.text, alias.text, node.getStart(), node.getEnd()));
        }
        else if (node.importClause && type_guards_1.isNamedImports(node.importClause.namedBindings)) {
            const lib = node.moduleSpecifier;
            const bindings = node.importClause.namedBindings;
            const tsImport = new imports_1.NamedImport(lib.text, node.getStart(), node.getEnd());
            tsImport.specifiers = bindings.elements.map(o => o.propertyName && o.name ?
                new SymbolSpecifier_1.SymbolSpecifier(o.propertyName.text, o.name.text) :
                new SymbolSpecifier_1.SymbolSpecifier(o.name.text));
            resource.imports.push(tsImport);
        }
        else if (node.importClause && node.importClause.name) {
            const lib = node.moduleSpecifier;
            const alias = node.importClause.name;
            resource.imports.push(new imports_1.DefaultImport(lib.text, alias.text, node.getStart(), node.getEnd()));
        }
        else if (node.moduleSpecifier && type_guards_1.isStringLiteral(node.moduleSpecifier)) {
            const lib = node.moduleSpecifier;
            resource.imports.push(new imports_1.StringImport(lib.text, node.getStart(), node.getEnd()));
        }
    }
    else if (type_guards_1.isExternalModuleReference(node.moduleReference)) {
        const alias = node.name;
        const lib = node.moduleReference.expression;
        resource.imports.push(new imports_1.ExternalModuleImport(lib.text, alias.text, node.getStart(), node.getEnd()));
    }
}
exports.parseImport = parseImport;
