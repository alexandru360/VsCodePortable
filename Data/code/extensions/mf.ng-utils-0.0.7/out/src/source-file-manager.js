"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
const Path = require("path");
const v = require("villa");
const helpers_1 = require("./helpers");
class SourceFileManager {
    constructor(rootDirs) {
        this.rootDirs = rootDirs;
    }
    contain(filename) {
        return this.rootDirs.some(rootDir => filename.startsWith(rootDir));
    }
    destroy() {
    }
    static rename(target, newName) {
        return __awaiter(this, void 0, void 0, function* () {
            let stats = yield helpers_1.safeStats(target);
            let dirname = stats && stats.isDirectory() ? target : Path.dirname(target);
            let dirBasename = Path.basename(dirname);
            let name = Path.basename(target).replace(/\..*$/, '');
            let sameNameFiles;
            if (name === newName) {
                return;
            }
            sameNameFiles = yield SourceFileManager.resolveSameNameFiles(target);
            if (!stats || stats.isFile()) {
                sameNameFiles.push({
                    filename: Path.basename(target),
                    absolutePath: target,
                    kind: name,
                });
            }
            let renameItems = sameNameFiles.map(file => {
                return [
                    file.absolutePath,
                    Path.join(dirname, file.filename.replace(/^[^\.]+/, newName)),
                ];
            });
            // let dependencies = renameItems.slice();
            if (dirBasename === name) {
                renameItems.push([
                    dirname,
                    Path.join(Path.dirname(dirname), newName),
                ]);
            }
            yield v.each(renameItems, rename);
            // await v.map(sameNameFiles, file => {
            //   return fixDependenciesPath(file.absolutePath, dependencies);
            // });
        });
    }
    static resolveSameNameFiles(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = [];
            if (!filename) {
                return results;
            }
            let stats = yield helpers_1.safeStats(filename);
            let dirname = stats && stats.isDirectory() ? filename : Path.dirname(filename);
            let basename = Path.basename(filename);
            let basenameWithoutExt = Path.basename(basename, Path.extname(basename));
            let ns = basenameWithoutExt;
            let names = [];
            while (true) {
                if (ns.indexOf('.') === -1) {
                    names.push(ns);
                    break;
                }
                names.push(ns);
                ns = ns.slice(0, ns.lastIndexOf('.'));
            }
            let files = yield v.call(FS.readdir, dirname);
            files = yield v.filter(files, (file) => __awaiter(this, void 0, void 0, function* () {
                let stats = yield helpers_1.safeStats(Path.join(dirname, file));
                return stats ? stats.isFile() : false;
            }));
            files.sort((a, b) => {
                return b.startsWith(basenameWithoutExt) ? 1 : -1;
            });
            for (let file of files) {
                if (file === basename) {
                    continue;
                }
                if (names.some(name => file.startsWith(name))) {
                    results.push(getFile(file, dirname));
                }
            }
            return results;
        });
    }
}
exports.default = SourceFileManager;
function getFile(filename, context) {
    let name = Path.basename(filename, Path.extname(filename));
    return {
        filename,
        absolutePath: Path.resolve(context, filename),
        kind: name.indexOf('.') > -1 ? name.slice(name.lastIndexOf('.')).replace(/^\./, '') : name,
    };
}
function rename(paths) {
    let sourcePath = paths[0];
    let destPath = paths[1];
    return v.call(FS.rename, sourcePath, destPath).then(v.bear);
}
// async function fixDependenciesPath(target: string, dependencies: string[][]) {
//   let context = Path.dirname(target);
//   let content = await v.call<string>(FS.readFile, target, 'utf8');
//   for (let dependency of dependencies) {
//     let oldPath = `./${Path.relative(context, dependency[0]).replace(/\\/g, '/')}`;
//     let newPath = `./${Path.relative(context, dependency[1]).replace(/\\/g, '/')}`;
//     let position: number;
//     let nextProcessContent = content;
//     let processedContent = '';
//     // tslint:disable-next-line:no-console
//     console.log('process', oldPath, newPath);
//     // tslint:disable-next-line:no-conditional-assignment
//     while (position = nextProcessContent.indexOf(oldPath)) {
//       if (position === -1) {
//         break;
//       }
//       processedContent = nextProcessContent.slice(0, position) + newPath;
//       nextProcessContent = nextProcessContent.slice(position + oldPath.length);
//     }
//     content = processedContent + nextProcessContent;
//   }
//   // tslint:disable-next-line:no-console
//   console.log('-----------');
//   // tslint:disable-next-line:no-console
//   console.log(content);
// }
//# sourceMappingURL=source-file-manager.js.map