"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
function normalizePathUri(uri) {
    const decoded = decodeURIComponent(uri);
    if (os_1.platform() === 'win32') {
        return decoded.replace('file:///', '');
    }
    return decoded.replace('file://', '');
}
exports.normalizePathUri = normalizePathUri;
