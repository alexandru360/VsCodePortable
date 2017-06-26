"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpRequest_1 = require("./models/httpRequest");
const requestParserUtil_1 = require("./requestParserUtil");
var yargs = require('yargs');
class CurlRequestParser {
    parseHttpRequest(requestRawText, requestAbsoluteFilePath, parseFileContentAsStream) {
        let requestText = CurlRequestParser.mergeMultipleSpacesIntoSingle(CurlRequestParser.mergeIntoSingleLine(requestRawText.trim()));
        let yargObject = yargs(requestText);
        let parsedArguments = yargObject.argv;
        // parse url
        let url = parsedArguments._[1];
        if (!url) {
            url = parsedArguments.L || parsedArguments.location || parsedArguments.compressed || parsedArguments.url;
        }
        // parse header
        let headers = {};
        let parsedHeaders = parsedArguments.H || parsedArguments.header;
        if (parsedHeaders) {
            if (!Array.isArray(parsedHeaders)) {
                parsedHeaders = [parsedHeaders];
            }
            headers = requestParserUtil_1.RequestParserUtil.parseRequestHeaders(parsedHeaders);
        }
        let user = parsedArguments.u || parsedArguments.user;
        if (user) {
            headers['Authorization'] = `Basic ${new Buffer(user).toString('base64')}`;
        }
        // parse body
        let body = parsedArguments.d || parsedArguments.data || parsedArguments['data-binary'];
        // parse method
        let method = (parsedArguments.X || parsedArguments.request);
        if (!method) {
            method = body ? "POST" : "GET";
        }
        return new httpRequest_1.HttpRequest(method, url, headers, body, body);
    }
    static mergeIntoSingleLine(text) {
        return text.replace(/\\\r|\\\n/g, '');
    }
    static mergeMultipleSpacesIntoSingle(text) {
        return text.replace(/\s{2,}/g, ' ');
    }
}
exports.CurlRequestParser = CurlRequestParser;
//# sourceMappingURL=curlRequestParser.js.map