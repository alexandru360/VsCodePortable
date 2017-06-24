"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let NamespaceImport = NamespaceImport_1 = class NamespaceImport {
    constructor(libraryName, alias, start, end) {
        this.libraryName = libraryName;
        this.alias = alias;
        this.start = start;
        this.end = end;
    }
    get isNew() {
        return this.start !== undefined && this.end !== undefined;
    }
    generateTypescript({ stringQuoteStyle, eol }) {
        return `import * as ${this.alias} from ${stringQuoteStyle}${this.libraryName}${stringQuoteStyle}${eol}\n`;
    }
    clone() {
        return new NamespaceImport_1(this.libraryName, this.alias, this.start, this.end);
    }
};
NamespaceImport = NamespaceImport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new NamespaceImport_1(json.libraryName, json.alias, json.start, json.end) }),
    tslib_1.__metadata("design:paramtypes", [String, String, Number, Number])
], NamespaceImport);
exports.NamespaceImport = NamespaceImport;
var NamespaceImport_1;
