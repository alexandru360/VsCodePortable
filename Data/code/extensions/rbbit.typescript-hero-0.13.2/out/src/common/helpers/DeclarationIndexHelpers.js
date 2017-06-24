"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const declarations_1 = require("../ts-parsing/declarations");
const imports_1 = require("../ts-parsing/imports");
const path_1 = require("path");
function getDeclarationsFilteredByImports(declarationInfos, documentPath, rootPath, imports) {
    let declarations = declarationInfos;
    for (const tsImport of imports) {
        const importedLib = getAbsolutLibraryName(tsImport.libraryName, documentPath, rootPath);
        if (tsImport instanceof imports_1.NamedImport) {
            declarations = declarations
                .filter(o => o.from !== importedLib || !tsImport.specifiers
                .some(s => s.specifier === o.declaration.name));
        }
        else if (tsImport instanceof imports_1.NamespaceImport || tsImport instanceof imports_1.ExternalModuleImport) {
            declarations = declarations.filter(o => o.from !== tsImport.libraryName);
        }
        else if (tsImport instanceof imports_1.DefaultImport) {
            declarations = declarations
                .filter(o => (!(o.declaration instanceof declarations_1.DefaultDeclaration) || importedLib !== o.from));
        }
    }
    return declarations;
}
exports.getDeclarationsFilteredByImports = getDeclarationsFilteredByImports;
function getAbsolutLibraryName(library, actualFilePath, rootPath) {
    if (!library.startsWith('.')) {
        return library;
    }
    return '/' + path_1.relative(rootPath, path_1.normalize(path_1.join(path_1.parse(actualFilePath).dir, library))).replace(/[/]$/g, '');
}
exports.getAbsolutLibraryName = getAbsolutLibraryName;
function getRelativeLibraryName(library, actualFilePath, rootPath) {
    if (!library.startsWith('/')) {
        return library;
    }
    const actualDir = path_1.parse('/' + path_1.relative(rootPath, actualFilePath)).dir;
    let relativePath = path_1.relative(actualDir, library);
    if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
    }
    else if (relativePath === '..') {
        relativePath += '/';
    }
    return relativePath.replace(/\\/g, '/');
}
exports.getRelativeLibraryName = getRelativeLibraryName;
