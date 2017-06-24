"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let NamedExport = NamedExport_1 = class NamedExport {
    constructor(start, end, from) {
        this.start = start;
        this.end = end;
        this.from = from;
    }
};
NamedExport = NamedExport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({
        factory: (json) => {
            const obj = new NamedExport_1(json.start, json.end, json.from);
            obj.specifiers = json.specifiers;
            return obj;
        },
    }),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String])
], NamedExport);
exports.NamedExport = NamedExport;
var NamedExport_1;
