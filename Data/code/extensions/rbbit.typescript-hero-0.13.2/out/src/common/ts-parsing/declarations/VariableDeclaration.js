"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let VariableDeclaration = VariableDeclaration_1 = class VariableDeclaration {
    constructor(name, isConst, isExported, type, start, end) {
        this.name = name;
        this.isConst = isConst;
        this.isExported = isExported;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Variable;
    }
    get intellisenseSortKey() {
        return `1_${this.name}`;
    }
    generateTypescript() {
        return `${this.name}${this.type ? `: ${this.type}` : ''}`;
    }
};
VariableDeclaration = VariableDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new VariableDeclaration_1(json.name, json.isConst, json.isExported, json.type, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Boolean, String, Number, Number])
], VariableDeclaration);
exports.VariableDeclaration = VariableDeclaration;
var VariableDeclaration_1;
