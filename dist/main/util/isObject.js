"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = void 0;
var isObject = function (value) {
    var type = typeof value;
    return value != null && (type === "object" || type === "function");
};
exports.isObject = isObject;
