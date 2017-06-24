"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let DeclarationInfo = DeclarationInfo_1 = class DeclarationInfo {
    constructor(declaration, from) {
        this.declaration = declaration;
        this.from = from;
    }
};
DeclarationInfo = DeclarationInfo_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new DeclarationInfo_1(json.declaration, json.from) }),
    tslib_1.__metadata("design:paramtypes", [Object, String])
], DeclarationInfo);
exports.DeclarationInfo = DeclarationInfo;
var DeclarationInfo_1;
