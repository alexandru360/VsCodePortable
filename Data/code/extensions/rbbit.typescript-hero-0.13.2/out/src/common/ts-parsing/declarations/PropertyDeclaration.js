"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const DeclarationVisibility_1 = require("./DeclarationVisibility");
const ts_json_serializer_1 = require("ts-json-serializer");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
let PropertyDeclaration = PropertyDeclaration_1 = class PropertyDeclaration {
    constructor(name, visibility, type, start, end) {
        this.name = name;
        this.visibility = visibility;
        this.type = type;
        this.start = start;
        this.end = end;
    }
    get itemKind() {
        return vscode_languageserver_types_1.CompletionItemKind.Property;
    }
    get intellisenseSortKey() {
        return `0_${this.name}`;
    }
    generateTypescript({ tabSize }) {
        return `${Array(tabSize + 1).join(' ')}` +
            `${this.visibility !== undefined ? DeclarationVisibility_1.getVisibilityText(this.visibility) + ' ' : ''}` +
            `${this.name}${this.type ? `: ${this.type}` : ''};\n`;
    }
};
PropertyDeclaration = PropertyDeclaration_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: json => new PropertyDeclaration_1(json.name, json.visibility, json.type, json.start, json.end),
    }),
    tslib_1.__metadata("design:paramtypes", [String, Number, String, Number, Number])
], PropertyDeclaration);
exports.PropertyDeclaration = PropertyDeclaration;
var PropertyDeclaration_1;
