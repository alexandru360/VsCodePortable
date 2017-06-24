"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Namespace_1 = require("./Namespace");
const ts_json_serializer_1 = require("ts-json-serializer");
function typeFactory(json) {
    const obj = new Module(json.name, json.start, json.end);
    obj.imports = json.imports;
    obj.exports = json.exports;
    obj.declarations = json.declarations;
    obj.resources = json.resources;
    obj.usages = json.usages;
    return obj;
}
let Module = Module_1 = class Module {
    constructor(name, start, end) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.imports = [];
        this.exports = [];
        this.declarations = [];
        this.resources = [];
        this.usages = [];
    }
    get identifier() {
        return this.name;
    }
    get nonLocalUsages() {
        return this.usages.filter(usage => !this.declarations.some(o => o.name === usage) &&
            !this.resources.some(o => (o instanceof Module_1 || o instanceof Namespace_1.Namespace) && o.name === usage));
    }
    getNamespaceAlias() {
        return this.name.split(/[-_]/).reduce((all, cur, idx) => {
            if (idx === 0) {
                return all + cur.toLowerCase();
            }
            else {
                return all + cur.charAt(0).toUpperCase() + cur.substring(1).toLowerCase();
            }
        }, '');
    }
};
Module = Module_1 = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: typeFactory }),
    tslib_1.__metadata("design:paramtypes", [String, Number, Number])
], Module);
exports.Module = Module;
var Module_1;
