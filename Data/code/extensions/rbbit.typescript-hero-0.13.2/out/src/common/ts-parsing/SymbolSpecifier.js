"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let SymbolSpecifier = SymbolSpecifier_1 = class SymbolSpecifier {
    constructor(specifier, alias) {
        this.specifier = specifier;
        this.alias = alias;
    }
    generateTypescript() {
        return `${this.specifier}${this.alias ? ` as ${this.alias}` : ''}`;
    }
    clone() {
        return new SymbolSpecifier_1(this.specifier, this.alias);
    }
};
SymbolSpecifier = SymbolSpecifier_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new SymbolSpecifier_1(json.specifier, json.alias) }),
    tslib_1.__metadata("design:paramtypes", [String, String])
], SymbolSpecifier);
exports.SymbolSpecifier = SymbolSpecifier;
var SymbolSpecifier_1;
