"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let ConstructorDeclaration = ConstructorDeclaration_1 = class ConstructorDeclaration {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.parameters = [];
        this.variables = [];
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Constructor;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
ConstructorDeclaration = ConstructorDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new ConstructorDeclaration_1(json.name, json.start, json.end);
            obj.parameters = json.parameters;
            obj.variables = json.variables;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number])
], ConstructorDeclaration);
exports.ConstructorDeclaration = ConstructorDeclaration;
var ConstructorDeclaration_1;
