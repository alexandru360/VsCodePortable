"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let InterfaceDeclaration = InterfaceDeclaration_1 = class InterfaceDeclaration {
    constructor(name, isExported, start, end) {
        this.name = name;
        this.isExported = isExported;
        this.start = start;
        this.end = end;
        this.properties = [];
        this.methods = [];
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Interface;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
InterfaceDeclaration = InterfaceDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new InterfaceDeclaration_1(json.name, json.isExported, json.start, json.end);
            obj.properties = json.properties;
            obj.methods = json.methods;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Number, Number])
], InterfaceDeclaration);
exports.InterfaceDeclaration = InterfaceDeclaration;
var InterfaceDeclaration_1;
