"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let ModuleDeclaration = ModuleDeclaration_1 = class ModuleDeclaration {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Module;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
ModuleDeclaration = ModuleDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new ModuleDeclaration_1(json.name, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number])
], ModuleDeclaration);
exports.ModuleDeclaration = ModuleDeclaration;
var ModuleDeclaration_1;
