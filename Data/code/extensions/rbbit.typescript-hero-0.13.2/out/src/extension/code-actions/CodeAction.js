"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ClassManager_1 = require("../managers/ClassManager");
const ImportManager_1 = require("../managers/ImportManager");
class AddImportCodeAction {
    constructor(document, importToAdd) {
        this.document = document;
        this.importToAdd = importToAdd;
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const controller = yield ImportManager_1.ImportManager.create(this.document);
            return controller.addDeclarationImport(this.importToAdd).commit();
        });
    }
}
exports.AddImportCodeAction = AddImportCodeAction;
class AddMissingImportsCodeAction {
    constructor(document, resolveIndex) {
        this.document = document;
        this.resolveIndex = resolveIndex;
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const controller = yield ImportManager_1.ImportManager.create(this.document);
            return controller.addMissingImports(this.resolveIndex).commit();
        });
    }
}
exports.AddMissingImportsCodeAction = AddMissingImportsCodeAction;
class NoopCodeAction {
    execute() {
        return Promise.resolve(true);
    }
}
exports.NoopCodeAction = NoopCodeAction;
class ImplementPolymorphElements {
    constructor(document, managedClass, polymorphObject) {
        this.document = document;
        this.managedClass = managedClass;
        this.polymorphObject = polymorphObject;
    }
    execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const controller = yield ClassManager_1.ClassManager.create(this.document, this.managedClass);
            for (const property of this.polymorphObject.properties.filter(o => !controller.hasProperty(o.name))) {
                if (!property.visibility) {
                    property.visibility = 2;
                }
                controller.addProperty(property);
            }
            for (const method of this.polymorphObject.methods.filter(o => !controller.hasMethod(o.name) && o.isAbstract)) {
                if (!method.visibility) {
                    method.visibility = 2;
                }
                controller.addMethod(method);
            }
            return controller.commit();
        });
    }
}
exports.ImplementPolymorphElements = ImplementPolymorphElements;
