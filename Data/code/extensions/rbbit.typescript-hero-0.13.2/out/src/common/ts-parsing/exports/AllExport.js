"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let AllExport = AllExport_1 = class AllExport {
    constructor(start, end, from) {
        this.start = start;
        this.end = end;
        this.from = from;
    }
};
AllExport = AllExport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new AllExport_1(json.start, json.end, json.from) }),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String])
], AllExport);
exports.AllExport = AllExport;
var AllExport_1;
