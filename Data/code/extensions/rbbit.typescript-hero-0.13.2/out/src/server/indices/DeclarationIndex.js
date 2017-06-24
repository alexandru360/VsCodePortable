"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PathHelpers_1 = require("../../common/helpers/PathHelpers");
const ts_parsing_1 = require("../../common/ts-parsing");
const declarations_1 = require("../../common/ts-parsing/declarations");
const exports_1 = require("../../common/ts-parsing/exports");
const AssignedExport_1 = require("../../common/ts-parsing/exports/AssignedExport");
const resources_1 = require("../../common/ts-parsing/resources");
const type_guards_1 = require("../../common/type-guards");
const IoCSymbols_1 = require("../IoCSymbols");
const inversify_1 = require("inversify");
const path_1 = require("path");
const vscode_languageserver_1 = require("vscode-languageserver");
function getNodeLibraryName(path) {
    const dirs = path.split(/\/|\\/);
    const nodeIndex = dirs.indexOf('node_modules');
    return dirs.slice(nodeIndex + 1).join('/')
        .replace(/([.]d)?([.]tsx?)?/g, '')
        .replace(new RegExp(`/(index|${dirs[nodeIndex + 1]}|${dirs[dirs.length - 2]})$`), '');
}
let DeclarationIndex = class DeclarationIndex {
    constructor(loggerFactory, parser) {
        this.parser = parser;
        this.parsedResources = Object.create(null);
        this.logger = loggerFactory('DeclarationIndex');
        this.logger.info('Instantiated.');
    }
    get indexReady() {
        return this._index !== undefined;
    }
    get index() {
        return this._index;
    }
    get declarationInfos() {
        return Object
            .keys(this.index)
            .sort()
            .reduce((all, key) => all.concat(this.index[key]), []);
    }
    reset() {
        this.parsedResources = Object.create(null);
        this._index = undefined;
        this.logger.info('Reset called, deleted index.');
    }
    buildIndex(filePathes, rootPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this.logger.info('Starting index refresh.');
            if (this.building) {
                this.logger.warning('Indexing already running, abort.');
            }
            try {
                this.building = true;
                this.logger.info(`Received ${filePathes.length} filepathes.`);
                const parsed = yield this.parser.parseFiles(filePathes, rootPath);
                this.parsedResources = yield this.parseResources(rootPath, parsed);
                this._index = yield this.createIndex(this.parsedResources);
                this.logger.info('Finished indexing.');
            }
            catch (e) {
                throw e;
            }
            finally {
                this.building = false;
            }
        });
    }
    reindexForChanges(changes, rootPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const rebuildResources = [];
            const removeResources = [];
            const rebuildFiles = [];
            for (const change of changes) {
                const filePath = PathHelpers_1.normalizePathUri(change.uri);
                const resource = '/' + path_1.relative(rootPath, filePath).replace(/[.]tsx?/g, '');
                if (change.type === vscode_languageserver_1.FileChangeType.Deleted) {
                    if (removeResources.indexOf(resource) < 0) {
                        removeResources.push(resource);
                    }
                }
                else {
                    if (rebuildResources.indexOf(resource) < 0) {
                        rebuildResources.push(resource);
                    }
                    if (rebuildFiles.indexOf(filePath) < 0) {
                        rebuildFiles.push(filePath);
                    }
                }
                for (const file of this.getExportedResources(resource, rootPath)) {
                    if (rebuildFiles.indexOf(file) < 0) {
                        rebuildFiles.push(file);
                    }
                }
            }
            this.logger.info('Files have changed, going to rebuild', {
                update: rebuildResources,
                delete: removeResources,
                reindex: rebuildFiles,
            });
            const resources = yield this.parseResources(rootPath, yield this.parser.parseFiles(rebuildFiles, rootPath));
            for (const del of removeResources) {
                delete this.parsedResources[del];
            }
            for (const key of Object.keys(resources)) {
                this.parsedResources[key] = resources[key];
            }
            this._index = yield this.createIndex(this.parsedResources);
        });
    }
    getExportedResources(resourceToCheck, rootPath) {
        const resources = [];
        Object
            .keys(this.parsedResources)
            .filter(o => o.startsWith('/'))
            .forEach((key) => {
            const resource = this.parsedResources[key];
            if (this.doesExportResource(resource, resourceToCheck, rootPath)) {
                resources.push(resource.filePath);
            }
        });
        return resources;
    }
    doesExportResource(resource, resourcePath, rootPath) {
        let exportsResource = false;
        for (const ex of resource.exports) {
            if (exportsResource) {
                break;
            }
            if (ex instanceof exports_1.AllExport || ex instanceof exports_1.NamedExport) {
                const exported = '/' + path_1.relative(rootPath, path_1.normalize(path_1.join(resource.parsedPath.dir, ex.from)));
                exportsResource = exported === resourcePath;
            }
        }
        return exportsResource;
    }
    parseResources(rootPath, files = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const parsedResources = Object.create(null);
            for (const file of files) {
                if (file.filePath.indexOf('typings') > -1 || file.filePath.indexOf('node_modules/@types') > -1) {
                    for (const resource of file.resources) {
                        parsedResources[resource.identifier] = resource;
                    }
                }
                else if (file.filePath.indexOf('node_modules') > -1) {
                    const libname = getNodeLibraryName(file.filePath);
                    parsedResources[libname] = file;
                }
                else {
                    parsedResources[file.identifier] = file;
                }
            }
            for (const key of Object.keys(parsedResources).sort((k1, k2) => k2.length - k1.length)) {
                const resource = parsedResources[key];
                resource.declarations = resource.declarations.filter(o => type_guards_1.isExportableDeclaration(o) && o.isExported);
                this.processResourceExports(rootPath, parsedResources, resource);
            }
            return parsedResources;
        });
    }
    createIndex(resources) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const index = Object.create(null);
            for (const key of Object.keys(resources)) {
                const resource = resources[key];
                if (resource instanceof resources_1.Namespace || resource instanceof resources_1.Module) {
                    if (!index[resource.name]) {
                        index[resource.name] = [];
                    }
                    index[resource.name].push(new declarations_1.DeclarationInfo(new declarations_1.ModuleDeclaration(resource.getNamespaceAlias(), resource.start, resource.end), resource.name));
                }
                for (const declaration of resource.declarations) {
                    if (!index[declaration.name]) {
                        index[declaration.name] = [];
                    }
                    const from = key.replace(/[/]?index$/, '') || '/';
                    if (!index[declaration.name].some(o => o.declaration.constructor === declaration.constructor && o.from === from)) {
                        index[declaration.name].push(new declarations_1.DeclarationInfo(declaration, from));
                    }
                }
            }
            return index;
        });
    }
    processResourceExports(rootPath, parsedResources, resource, processedResources = []) {
        if (processedResources.indexOf(resource) >= 0 || resource.exports.length === 0) {
            return;
        }
        processedResources.push(resource);
        for (const ex of resource.exports) {
            if (resource instanceof resources_1.File && (ex instanceof exports_1.NamedExport || ex instanceof exports_1.AllExport)) {
                if (!ex.from) {
                    return;
                }
                let sourceLib = path_1.resolve(resource.parsedPath.dir, ex.from);
                if (sourceLib.indexOf('node_modules') > -1) {
                    sourceLib = getNodeLibraryName(sourceLib);
                }
                else {
                    sourceLib = '/' + path_1.relative(rootPath, sourceLib).replace(/([.]d)?[.]tsx?/g, '');
                }
                if (!parsedResources[sourceLib]) {
                    return;
                }
                const exportedLib = parsedResources[sourceLib];
                this.processResourceExports(rootPath, parsedResources, exportedLib, processedResources);
                if (ex instanceof exports_1.AllExport) {
                    this.processAllFromExport(resource, exportedLib);
                }
                else {
                    this.processNamedFromExport(ex, resource, exportedLib);
                }
            }
            else {
                if (ex instanceof AssignedExport_1.AssignedExport) {
                    for (const lib of ex.exported.filter(o => !type_guards_1.isExportableDeclaration(o))) {
                        this.processResourceExports(rootPath, parsedResources, lib, processedResources);
                    }
                    this.processAssignedExport(ex, resource);
                }
                else if (ex instanceof exports_1.NamedExport && ex.from && parsedResources[ex.from]) {
                    this.processResourceExports(rootPath, parsedResources, parsedResources[ex.from], processedResources);
                    this.processNamedFromExport(ex, resource, parsedResources[ex.from]);
                }
            }
        }
    }
    processAllFromExport(exportingLib, exportedLib) {
        exportingLib.declarations.push(...exportedLib.declarations);
        exportedLib.declarations = [];
    }
    processNamedFromExport(tsExport, exportingLib, exportedLib) {
        exportedLib.declarations
            .forEach((o) => {
            const ex = tsExport.specifiers.find(s => s.specifier === o.name);
            if (!ex) {
                return;
            }
            exportedLib.declarations.splice(exportedLib.declarations.indexOf(o), 1);
            if (ex.alias) {
                o.name = ex.alias;
            }
            exportingLib.declarations.push(o);
        });
    }
    processAssignedExport(tsExport, exportingLib) {
        tsExport.exported.forEach((exported) => {
            if (type_guards_1.isExportableDeclaration(exported)) {
                exportingLib.declarations.push(exported);
            }
            else {
                exportingLib.declarations.push(...exported.declarations.filter(o => type_guards_1.isExportableDeclaration(o) && o.isExported));
                exported.declarations = [];
            }
        });
    }
};
DeclarationIndex = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__param(0, inversify_1.inject(IoCSymbols_1.iocSymbols.loggerFactory)),
    tslib_1.__metadata("design:paramtypes", [Function, ts_parsing_1.TypescriptParser])
], DeclarationIndex);
exports.DeclarationIndex = DeclarationIndex;
