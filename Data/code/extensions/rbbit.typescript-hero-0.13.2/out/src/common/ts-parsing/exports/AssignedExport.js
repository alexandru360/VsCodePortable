"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const type_guards_1 = require("../../type-guards");
const resources_1 = require("../resources");
const ts_json_serializer_1 = require("ts-json-serializer");
let AssignedExport = AssignedExport_1 = class AssignedExport {
    constructor(start, end, declarationIdentifier, resource) {
        this.start = start;
        this.end = end;
        this.declarationIdentifier = declarationIdentifier;
        this.resource = resource;
    }
    get exported() {
        return [
            ...this.resource.declarations
                .filter(o => type_guards_1.isExportableDeclaration(o) && o.isExported && o.name === this.declarationIdentifier),
            ...this.resource.resources
                .filter(o => (o instanceof resources_1.Namespace || o instanceof resources_1.Module) && o.name === this.declarationIdentifier),
        ];
    }
};
AssignedExport = AssignedExport_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new AssignedExport_1(json.start, json.end, json.declarationIdentifier, json.resource) }),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, Object])
], AssignedExport);
exports.AssignedExport = AssignedExport;
var AssignedExport_1;
