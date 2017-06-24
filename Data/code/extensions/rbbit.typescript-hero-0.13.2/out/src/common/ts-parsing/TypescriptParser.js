"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_parser_1 = require("./node-parser");
const resources_1 = require("./resources");
const fs_1 = require("fs");
const inversify_1 = require("inversify");
const typescript_1 = require("typescript");
let TypescriptParser = class TypescriptParser {
    parseSource(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.parseTypescript(typescript_1.createSourceFile('inline.ts', source, typescript_1.ScriptTarget.ES2015, true), '/');
        });
    }
    parseFile(filePath, rootPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const parse = yield this.parseFiles([filePath], rootPath);
            return parse[0];
        });
    }
    parseFiles(filePathes, rootPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return filePathes
                .map(o => typescript_1.createSourceFile(o, fs_1.readFileSync(o).toString(), typescript_1.ScriptTarget.ES2015, true))
                .map(o => this.parseTypescript(o, rootPath));
        });
    }
    parseTypescript(source, rootPath) {
        const file = new resources_1.File(source.fileName, rootPath, source.getStart(), source.getEnd());
        const syntaxList = source.getChildAt(0);
        this.parse(file, syntaxList);
        return file;
    }
    parse(resource, node) {
        for (const child of node.getChildren()) {
            switch (child.kind) {
                case typescript_1.SyntaxKind.ImportDeclaration:
                case typescript_1.SyntaxKind.ImportEqualsDeclaration:
                    node_parser_1.parseImport(resource, child);
                    break;
                case typescript_1.SyntaxKind.ExportDeclaration:
                case typescript_1.SyntaxKind.ExportAssignment:
                    node_parser_1.parseExport(resource, child);
                    break;
                case typescript_1.SyntaxKind.EnumDeclaration:
                    node_parser_1.parseEnum(resource, child);
                    break;
                case typescript_1.SyntaxKind.TypeAliasDeclaration:
                    node_parser_1.parseTypeAlias(resource, child);
                    break;
                case typescript_1.SyntaxKind.FunctionDeclaration:
                    node_parser_1.parseFunction(resource, child);
                    continue;
                case typescript_1.SyntaxKind.VariableStatement:
                    node_parser_1.parseVariable(resource, child);
                    break;
                case typescript_1.SyntaxKind.InterfaceDeclaration:
                    node_parser_1.parseInterface(resource, child);
                    break;
                case typescript_1.SyntaxKind.ClassDeclaration:
                    node_parser_1.parseClass(resource, child);
                    continue;
                case typescript_1.SyntaxKind.Identifier:
                    node_parser_1.parseIdentifier(resource, child);
                    break;
                case typescript_1.SyntaxKind.ModuleDeclaration:
                    const newResource = node_parser_1.parseModule(resource, child);
                    this.parse(newResource, child);
                    continue;
                default:
                    break;
            }
            this.parse(resource, child);
        }
    }
};
TypescriptParser = tslib_1.__decorate([
    inversify_1.injectable()
], TypescriptParser);
exports.TypescriptParser = TypescriptParser;
