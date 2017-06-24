"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DeclarationVisibility_1 = require("./DeclarationVisibility");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let MethodDeclaration = MethodDeclaration_1 = class MethodDeclaration {
    constructor(name, isAbstract, visibility, type, start, end) {
        this.name = name;
        this.isAbstract = isAbstract;
        this.visibility = visibility;
        this.type = type;
        this.start = start;
        this.end = end;
        this.parameters = [];
        this.variables = [];
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Method;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript({ tabSize }) {
        const intend = Array(tabSize + 1).join(' ');
        return `${intend}` +
            `${this.visibility !== undefined ? DeclarationVisibility_1.getVisibilityText(this.visibility) + ' ' : ''}${this.name}(` +
            `${this.parameters.map(o => o.generateTypescript()).join(', ')})` +
            `${this.type ? `: ${this.type}` : ''} {
${intend}${intend}throw new Error('Not implemented yet.');
${intend}}\n`;
    }
};
MethodDeclaration = MethodDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new MethodDeclaration_1(json.name, json.isExported, json.visibility, json.type, json.start, json.end);
            obj.parameters = json.parameters;
            obj.variables = json.variables;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, Number, String, Number, Number])
], MethodDeclaration);
exports.MethodDeclaration = MethodDeclaration;
var MethodDeclaration_1;
