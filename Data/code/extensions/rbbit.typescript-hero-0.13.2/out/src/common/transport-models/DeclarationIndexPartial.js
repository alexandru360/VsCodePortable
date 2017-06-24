"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_json_serializer_1 = require("ts-json-serializer");
let DeclarationIndexPartial = DeclarationIndexPartial_1 = class DeclarationIndexPartial {
    constructor(index, infos) {
        this.index = index;
        this.infos = infos;
    }
};
DeclarationIndexPartial = DeclarationIndexPartial_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: json => new DeclarationIndexPartial_1(json.index, json.infos) }),
    tslib_1.__metadata("design:paramtypes", [String, Array])
], DeclarationIndexPartial);
exports.DeclarationIndexPartial = DeclarationIndexPartial;
var DeclarationIndexPartial_1;
