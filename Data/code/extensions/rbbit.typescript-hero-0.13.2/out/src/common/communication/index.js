"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inversify_1 = require("inversify");
const ts_json_serializer_1 = require("ts-json-serializer");
var Notification;
(function (Notification) {
    Notification[Notification["CreateIndexForFiles"] = 0] = "CreateIndexForFiles";
    Notification[Notification["IndexCreationRunning"] = 1] = "IndexCreationRunning";
    Notification[Notification["IndexCreationSuccessful"] = 2] = "IndexCreationSuccessful";
    Notification[Notification["IndexCreationFailed"] = 3] = "IndexCreationFailed";
})(Notification = exports.Notification || (exports.Notification = {}));
var Request;
(function (Request) {
    Request[Request["PartialIndexResult"] = 0] = "PartialIndexResult";
})(Request = exports.Request || (exports.Request = {}));
let Connection = class Connection {
    constructor(connection) {
        this.connection = connection;
        this.handler = {};
        this.serializer = new ts_json_serializer_1.TsSerializer();
    }
    sendNotification(notification, ...args) {
        const method = typeof notification === 'string' ? notification : Notification[notification];
        this.connection.sendNotification(method, args);
    }
    sendSerializedNotification(notification, ...args) {
        const method = typeof notification === 'string' ? notification : Notification[notification];
        const json = this.serializer.serialize(args);
        this.connection.sendNotification(method, json);
    }
    sendRequest(request, params) {
        const method = typeof request === 'string' ? request : Request[request];
        return this.connection.sendRequest(method, params);
    }
    sendSerializedRequest(request, params) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const method = typeof request === 'string' ? request : Request[request];
            const json = yield this.connection.sendRequest(method, params);
            return this.serializer.deserialize(json);
        });
    }
    onNotification(notification, handler) {
        const method = typeof notification === 'string' ? notification : Notification[notification];
        if (!this.handler[method]) {
            this.handler[method] = [];
            this.connection.onNotification(method, params => this.handler[method].forEach(o => o(params)));
        }
        this.handler[method].push(handler);
    }
    onSerializedNotification(notification, handler) {
        this.onNotification(notification, (...params) => {
            if (params) {
                handler(...(params.map(p => this.serializer.deserialize(p))));
                return;
            }
            handler();
        });
    }
    onRequest(request, handler) {
        const method = typeof request === 'string' ? request : Request[request];
        this.connection.onRequest(method, handler);
    }
    onSerializedRequest(request, handler) {
        const method = typeof request === 'string' ? request : Request[request];
        this.connection.onRequest(method, (params) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            const result = handler(params);
            if (result instanceof Promise) {
                const promiseResult = yield result;
                return this.serializer.serialize(promiseResult);
            }
            return this.serializer.serialize(result);
        }));
    }
};
Connection = tslib_1.__decorate([
    inversify_1.injectable(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Connection);
exports.Connection = Connection;
