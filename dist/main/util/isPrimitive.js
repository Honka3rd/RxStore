"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = void 0;
var isObject_1 = require("./isObject");
var isPrimitive = function (val) {
    return !(0, isObject_1.isObject)(val);
};
exports.isPrimitive = isPrimitive;
