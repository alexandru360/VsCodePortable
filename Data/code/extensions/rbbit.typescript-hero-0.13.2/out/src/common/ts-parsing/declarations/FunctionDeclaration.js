"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let FunctionDeclaration = FunctionDeclaration_1 = class FunctionDeclaration {
    constructor(name, isExported, type, start, end) {
        this.name = name;
        this.isExported = isExported;
        this.type = type;
        this.start = start;
        this.end = end;
        this.parameters = [];
        this.variables = [];
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Function;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
FunctionDeclaration = FunctionDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new FunctionDeclaration_1(json.name, json.isExported, json.type, json.start, json.end);
            obj.parameters = json.parameters;
            obj.variables = json.variables;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, String, Number, Number])
], FunctionDeclaration);
exports.FunctionDeclaration = FunctionDeclaration;
var FunctionDeclaration_1;
