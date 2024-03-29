"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowClone = void 0;
var isPrimitive_1 = require("./isPrimitive");
var shallowClone = function (input) {
    if (!input) {
        return input;
    }
    if ((0, isPrimitive_1.isPrimitive)(input)) {
        return input;
    }
    if (input instanceof Date) {
        return new Date(input);
    }
    if (input instanceof RegExp) {
        return new RegExp(input);
    }
    if (input instanceof Set) {
        return new Set(input);
    }
    if (input instanceof Map) {
        return new Map(input);
    }
    var ownKeys = Object.getOwnPropertyNames(input);
    var copied = Object.create(Object.getPrototypeOf(input), Object.getOwnPropertyDescriptors(input));
    ownKeys.forEach(function (k) {
        copied[k] = input[k];
    });
    return copied;
};
exports.shallowClone = shallowClone;
