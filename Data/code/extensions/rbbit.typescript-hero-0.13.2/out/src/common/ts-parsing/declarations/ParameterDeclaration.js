"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let ParameterDeclaration = ParameterDeclaration_1 = class ParameterDeclaration {
    constructor(name, type, start, end) {
        this.name = name;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Variable;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        return `${this.name}${this.type ? `: ${this.type}` : ''}`;
    }
};
ParameterDeclaration = ParameterDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new ParameterDeclaration_1(json.name, json.type, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, String, Number, Number])
], ParameterDeclaration);
exports.ParameterDeclaration = ParameterDeclaration;
var ParameterDeclaration_1;
