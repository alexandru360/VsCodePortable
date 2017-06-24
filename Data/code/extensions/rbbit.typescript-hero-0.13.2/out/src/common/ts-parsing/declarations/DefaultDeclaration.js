"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const errors_1 = require("../../errors");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let DefaultDeclaration = DefaultDeclaration_1 = class DefaultDeclaration {
    constructor(name, resource, start, end) {
        this.name = name;
        this.resource = resource;
        this.start = start;
        this.end = end;
        this.isExported = true;
    }
    get exportedDeclaration() {
        if (!this.exported) {
            this.exported = this.resource.declarations.find(o => o.name === this.name);
        }
        return this.exported;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.File;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript() {
        throw new errors_1.NotImplementedYetError();
    }
};
DefaultDeclaration = DefaultDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new DefaultDeclaration_1(json.name, json.resource, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, Object, Number, Number])
], DefaultDeclaration);
exports.DefaultDeclaration = DefaultDeclaration;
var DefaultDeclaration_1;
