"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let EnumDeclaration = EnumDeclaration_1 = class EnumDeclaration {
    constructor(name, isExported, start, end) {
        this.name = name;
        this.isExported = isExported;
        this.start = start;
        this.end = end;
        this.members = [];
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Enum;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
EnumDeclaration = EnumDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new EnumDeclaration_1(json.name, json.isExported, json.start, json.end);
            obj.members = json.members;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Number, Number])
], EnumDeclaration);
exports.EnumDeclaration = EnumDeclaration;
var EnumDeclaration_1;
