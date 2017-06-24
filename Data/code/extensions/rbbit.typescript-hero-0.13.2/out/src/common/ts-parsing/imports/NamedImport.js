"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let NamedImport = NamedImport_1 = class NamedImport {
    constructor(libraryName, start, end) {
        this.libraryName = libraryName;
        this.start = start;
        this.end = end;
        this.specifiers = [];
    }
    get isNew() {
        return this.start !== undefined && this.end !== undefined;
    }
    generateTypescript(options) {
        const { eol, stringQuoteStyle, spaceBraces, multiLineWrapThreshold } = options;
        const space = spaceBraces ? ' ' : '';
        const specifiers = this.specifiers.sort(this.specifierSort).map(o => o.generateTypescript()).join(', ');
        const lib = this.libraryName;
        const importString = `import {${space}${specifiers}${space}} from ${stringQuoteStyle}${lib}${stringQuoteStyle}${eol}\n`;
        if (importString.length > multiLineWrapThreshold) {
            return this.toMultiLineImport(options);
        }
        return importString;
    }
    clone() {
        const clone = new NamedImport_1(this.libraryName, this.start, this.end);
        clone.specifiers = this.specifiers.map(o => o.clone());
        return clone;
    }
    toMultiLineImport({ eol, stringQuoteStyle, tabSize }) {
        const spacings = Array(tabSize + 1).join(' ');
        return `import {
${this.specifiers.sort(this.specifierSort).map(o => `${spacings}${o.generateTypescript()}`).join(',\n')}
} from ${stringQuoteStyle}${this.libraryName}${stringQuoteStyle}${eol}\n`;
    }
    specifierSort(i1, i2) {
        const strA = i1.specifier.toLowerCase();
        const strB = i2.specifier.toLowerCase();
        if (strA < strB) {
            return -1;
        }
        else if (strA > strB) {
            return 1;
        }
        return 0;
    }
};
NamedImport = NamedImport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new NamedImport_1(json.libraryName, json.start, json.end);
            obj.specifiers = json.specifiers;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number])
], NamedImport);
exports.NamedImport = NamedImport;
var NamedImport_1;
