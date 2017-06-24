"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let StringImport = StringImport_1 = class StringImport {
    constructor(libraryName, start, end) {
        this.libraryName = libraryName;
        this.start = start;
        this.end = end;
    }
    get isNew() {
        return this.start !== undefined && this.end !== undefined;
    }
    generateTypescript({ stringQuoteStyle, eol }) {
        return `import ${stringQuoteStyle}${this.libraryName}${stringQuoteStyle}${eol}\n`;
    }
    clone() {
        return new StringImport_1(this.libraryName, this.start, this.end);
    }
};
StringImport = StringImport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new StringImport_1(json.libraryName, json.start, json.end) }),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number])
], StringImport);
exports.StringImport = StringImport;
var StringImport_1;
