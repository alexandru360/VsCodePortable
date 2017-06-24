"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ts_generation_1 = require("../common/ts-generation");
const inversify_1 = require("inversify");
const vscode_1 = require("vscode");
const sectionKey = 'typescriptHero';
let VscodeExtensionConfig = class VscodeExtensionConfig {
    constructor() {
        this.resolverConfig = new VscodeResolverConfig();
    }
    get verbosity() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('verbosity');
    }
    get resolver() {
        return this.resolverConfig;
    }
};
VscodeExtensionConfig = tslib_1.__decorate([
    inversify_1.injectable()
], VscodeExtensionConfig);
exports.VscodeExtensionConfig = VscodeExtensionConfig;
class VscodeResolverConfig {
    get insertSpaceBeforeAndAfterImportBraces() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.insertSpaceBeforeAndAfterImportBraces');
    }
    get insertSemicolons() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.insertSemicolons');
    }
    get stringQuoteStyle() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.stringQuoteStyle');
    }
    get ignorePatterns() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.ignorePatterns');
    }
    get multiLineWrapThreshold() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.multiLineWrapThreshold');
    }
    get newImportLocation() {
        const configString = vscode_1.workspace.getConfiguration(sectionKey).get('resolver.newImportLocation');
        return ts_generation_1.ImportLocation[configString];
    }
    get disableImportSorting() {
        return vscode_1.workspace.getConfiguration(sectionKey).get('resolver.disableImportsSorting');
    }
    get tabSize() {
        return vscode_1.workspace.getConfiguration().get('editor.tabSize');
    }
    get generationOptions() {
        return {
            eol: this.insertSemicolons ? ';' : '',
            multiLineWrapThreshold: this.multiLineWrapThreshold,
            spaceBraces: this.insertSpaceBeforeAndAfterImportBraces,
            stringQuoteStyle: this.stringQuoteStyle,
            tabSize: this.tabSize,
        };
    }
}
