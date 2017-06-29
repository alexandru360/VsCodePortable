"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable max-line-length */
const models_1 = require("../models");
exports.extensions = {
    default: {
        folder: { icon: 'folder', format: models_1.FileFormat.svg },
    },
    supported: [
        { icon: 'aurelia', extensions: ['aurelia_project'], format: models_1.FileFormat.svg },
        { icon: 'aws', extensions: ['aws', '.aws'], format: models_1.FileFormat.svg },
        { icon: 'binary', extensions: ['bin', '.bin'], format: models_1.FileFormat.svg },
        { icon: 'bower', extensions: ['bower_components'], format: models_1.FileFormat.svg },
        { icon: 'composer', extensions: ['composer', '.composer'], format: models_1.FileFormat.svg },
        { icon: 'client', extensions: ['client'], format: models_1.FileFormat.svg },
        { icon: 'config', extensions: ['config', '.config', 'ini', '.ini', 'initializers', '.initializers'], format: models_1.FileFormat.svg },
        { icon: 'css', extensions: ['css', '_css'], format: models_1.FileFormat.svg },
        { icon: 'dist', extensions: ['dist', 'out', 'export', 'build', 'release'], format: models_1.FileFormat.svg },
        { icon: 'docker', extensions: ['docker', '.docker'], format: models_1.FileFormat.svg },
        { icon: 'docs', extensions: ['docs'], format: models_1.FileFormat.svg },
        { icon: 'elasticbeanstalk', extensions: ['.elasticbeanstalk', '.ebextensions'], format: models_1.FileFormat.svg },
        { icon: 'flow', extensions: ['flow'], format: models_1.FileFormat.svg },
        { icon: 'fonts', extensions: ['fonts', 'font', 'fnt'], light: true, format: models_1.FileFormat.svg },
        { icon: 'git', extensions: ['.github', '.git', 'submodules', '.submodules'], format: models_1.FileFormat.svg },
        { icon: 'gcp', extensions: ['gcp', '.gcp'], format: models_1.FileFormat.svg },
        { icon: 'haxelib', extensions: ['haxelib'], format: models_1.FileFormat.svg },
        { icon: 'js', extensions: ['js'], format: models_1.FileFormat.svg },
        { icon: 'idea', extensions: ['.idea'], format: models_1.FileFormat.svg },
        { icon: 'images', extensions: ['images', 'image', 'img', 'icons', 'icon', 'ico'], format: models_1.FileFormat.svg },
        { icon: 'include', extensions: ['include', 'includes', 'incl'], format: models_1.FileFormat.svg },
        { icon: 'less', extensions: ['less', '_less'], format: models_1.FileFormat.svg },
        { icon: 'library', extensions: ['lib', '.lib'], format: models_1.FileFormat.svg },
        { icon: 'locale', extensions: ['locale', 'locales', 'i18n', 'g11n'], format: models_1.FileFormat.svg },
        { icon: 'log', extensions: ['log', 'logs'], format: models_1.FileFormat.svg },
        { icon: 'node', extensions: ['node_modules'], light: true, format: models_1.FileFormat.svg },
        { icon: 'nuget', extensions: ['.nuget'], format: models_1.FileFormat.svg },
        { icon: 'package', extensions: ['package', 'packages', '.package', '.packages'], format: models_1.FileFormat.svg },
        { icon: 'paket', extensions: ['.paket'], format: models_1.FileFormat.svg },
        { icon: 'php', extensions: ['php'], format: models_1.FileFormat.svg },
        { icon: 'plugin', extensions: ['plugin', '.plugin', 'plugins', '.plugins'], format: models_1.FileFormat.svg },
        { icon: 'private', extensions: ['private', '.private'], format: models_1.FileFormat.svg },
        { icon: 'public', extensions: ['public', '.public'], format: models_1.FileFormat.svg },
        { icon: 'meteor', extensions: ['.meteor'], light: true, format: models_1.FileFormat.svg },
        { icon: 'sass', extensions: ['sass', 'scss', '_sass', '_scss'], light: true, format: models_1.FileFormat.svg },
        { icon: 'script', extensions: ['script', 'scripts'], format: models_1.FileFormat.svg },
        { icon: 'src', extensions: ['src', 'source', 'sources'], format: models_1.FileFormat.svg },
        { icon: 'server', extensions: ['server'], format: models_1.FileFormat.svg },
        { icon: 'style', extensions: ['style', 'styles'], format: models_1.FileFormat.svg },
        {
            icon: 'test', extensions: [
                'tests',
                '.tests',
                'test',
                '.test',
                '__tests__',
                '__test__',
                'spec',
                '.spec',
                'specs',
                '.specs'
            ],
            format: models_1.FileFormat.svg,
        },
        { icon: 'tools', extensions: ['tools', '.tools'], format: models_1.FileFormat.svg },
        { icon: 'typescript', extensions: ['typescript', 'ts'], format: models_1.FileFormat.svg },
        { icon: 'typings', extensions: ['typings'], format: models_1.FileFormat.svg },
        { icon: 'typings2', extensions: ['typings'], format: models_1.FileFormat.svg, disabled: true },
        { icon: 'vagrant', extensions: ['vagrant', '.vagrant'], format: models_1.FileFormat.svg },
        { icon: 'view', extensions: ['html', 'view', 'views'], format: models_1.FileFormat.svg },
        { icon: 'vs', extensions: ['.vs'], format: models_1.FileFormat.svg },
        { icon: 'vscode', extensions: ['.vscode'], format: models_1.FileFormat.svg },
        { icon: 'vscode_test', extensions: ['.vscode-test'], format: models_1.FileFormat.svg },
        { icon: 'webpack', extensions: ['webpack'], format: models_1.FileFormat.svg },
    ],
};
//# sourceMappingURL=supportedFolders.js.map