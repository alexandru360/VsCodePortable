"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getVisibilityText(visibility) {
    switch (visibility) {
        case 0:
            return 'private';
        case 2:
            return 'public';
        case 1:
            return 'protected';
        default:
            return '';
    }
}
exports.getVisibilityText = getVisibilityText;
