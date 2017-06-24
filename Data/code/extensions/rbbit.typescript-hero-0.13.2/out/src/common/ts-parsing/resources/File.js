"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PathHelpers_1 = require("../../helpers/PathHelpers");
const Module_1 = require("./Module");
const Namespace_1 = require("./Namespace");
const path_1 = require("path");
const ts_json_serializer_1 = require("ts-json-serializer");
function typeFactory(json) {
    const obj = new File(json.filePath, json.rootPath, json.start, json.end);
    obj.imports = json.imports;
    obj.exports = json.exports;
    obj.declarations = json.declarations;
    obj.resources = json.resources;
    obj.usages = json.usages;
    return obj;
}
let File = class File {
    constructor(filePath, rootPath, start, end) {
        this.filePath = filePath;
        this.start = start;
        this.end = end;
        this.imports = [];
        this.exports = [];
        this.declarations = [];
        this.resources = [];
        this.usages = [];
        this.rootPath = PathHelpers_1.normalizePathUri(rootPath);
    }
    get identifier() {
        return '/' + path_1.relative(this.rootPath, this.filePath).replace(/([.]d)?[.]tsx?/g, '');
    }
    get nonLocalUsages() {
        return this.usages.filter(usage => !this.declarations.some(o => o.name === usage) &&
            !this.resources.some(o => (o instanceof Module_1.Module || o instanceof Namespace_1.Namespace) && o.name === usage));
    }
    get parsedPath() {
        return path_1.parse(this.filePath);
    }
    get isWorkspaceFile() {
        return ['node_modules', 'typings'].every(o => this.filePath.indexOf(o) === -1);
    }
};
File = tslib_1.__decorate([
    ts_json_serializer_1.Serializable({ factory: typeFactory }),
    tslib_1.__metadata("design:paramtypes", [String, String, Number, Number])
], File);
exports.File = File;
