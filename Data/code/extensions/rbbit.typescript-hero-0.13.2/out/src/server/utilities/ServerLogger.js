"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const vscode_languageserver_1 = require("vscode-languageserver");
function getLogLevel(verbosity) {
    switch (verbosity) {
        case 'Nothing':
            return 0;
        case 'Errors':
            return 1;
        case 'All':
            return 3;
        default:
            return 2;
    }
}
class ServerLogger {
    constructor(connection, prefix) {
        this.connection = connection;
        this.prefix = prefix;
        this.messageBuffer = [];
        connection.onDidChangeConfiguration((config) => {
            this.configuration = config;
            this.trySendBuffer();
        });
    }
    error(message, data) {
        this.log(1, vscode_languageserver_1.MessageType.Error, message, data);
    }
    warning(message, data) {
        this.log(2, vscode_languageserver_1.MessageType.Warning, message, data);
    }
    info(message, data) {
        this.log(3, vscode_languageserver_1.MessageType.Info, message, data);
    }
    log(level, type, payload, data) {
        let message = payload;
        if (this.configuration && getLogLevel(this.configuration.verbosity) >= level) {
            message = `${this.prefix ? this.prefix + ' - ' : ''}${message}`;
            if (data) {
                message += `\n\tData:\t${util.inspect(data, {})}`;
            }
            this.connection.sendNotification('window/logMessage', { type, message });
        }
        else if (!this.configuration && this.messageBuffer) {
            this.messageBuffer.push({ level, type, message, data });
        }
    }
    trySendBuffer() {
        if (this.configuration && this.messageBuffer) {
            for (const { level, type, message, data } of [...this.messageBuffer]) {
                this.log(level, type, message, data);
            }
            delete this.messageBuffer;
        }
    }
}
exports.ServerLogger = ServerLogger;
