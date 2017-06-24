"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const declarations_1 = require("../ts-parsing/declarations");
const ts_json_serializer_1 = require("ts-json-serializer");
let ImportUserDecision = ImportUserDecision_1 = class ImportUserDecision {
    constructor(declaration, usage) {
        this.declaration = declaration;
        this.usage = usage;
    }
};
ImportUserDecision = ImportUserDecision_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new ImportUserDecision_1(json.declaration, json.usage) }),
    tslib_1.__metadata("design:paramtypes", [declarations_1.DeclarationInfo, String])
], ImportUserDecision);
exports.ImportUserDecision = ImportUserDecision;
var ImportUserDecision_1;
