"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FS = require("fs");
const Path = require("path");
const v = require("villa");
function resolveSourceRootDirs(projectDir) {
    let rootDirs = [];
    let angularCLIConfig = getAngularCLIConfig(projectDir);
    if (angularCLIConfig && angularCLIConfig.apps) {
        for (let app of angularCLIConfig.apps) {
            if (app.root) {
                rootDirs.push(Path.resolve(projectDir, app.root));
            }
        }
    }
    if (!rootDirs.length) {
        if (existsSync(Path.join(projectDir, 'src'))) {
            rootDirs.push(Path.join(projectDir, 'src'));
        }
    }
    return rootDirs;
}
exports.resolveSourceRootDirs = resolveSourceRootDirs;
function getAngularCLIConfig(projectDir) {
    let angularCLIConfig;
    try {
        angularCLIConfig = JSON.parse(FS.readFileSync(Path.resolve(projectDir, '.angular-cli.json'), 'utf8'));
    }
    catch (e) { }
    return angularCLIConfig;
}
exports.getAngularCLIConfig = getAngularCLIConfig;
function safeStatsSync(target) {
    let stats;
    try {
        stats = FS.statSync(target);
    }
    catch (e) { }
    return stats;
}
exports.safeStatsSync = safeStatsSync;
function safeStats(target) {
    return v.call(FS.stat, target).catch(v.bear);
}
exports.safeStats = safeStats;
function existsSync(target) {
    return !!safeStatsSync(target);
}
exports.existsSync = existsSync;
//# sourceMappingURL=helpers.js.map