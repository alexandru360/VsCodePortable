"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let TypeAliasDeclaration = TypeAliasDeclaration_1 = class TypeAliasDeclaration {
    constructor(name, isExported, start, end) {
        this.name = name;
        this.isExported = isExported;
        this.start = start;
        this.end = end;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Keyword;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
TypeAliasDeclaration = TypeAliasDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new TypeAliasDeclaration_1(json.name, json.isExported, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Number, Number])
], TypeAliasDeclaration);
exports.TypeAliasDeclaration = TypeAliasDeclaration;
var TypeAliasDeclaration_1;
