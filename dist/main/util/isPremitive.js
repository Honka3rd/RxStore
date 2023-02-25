"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPremitive = void 0;
var isObject_1 = require("./isObject");
var isPremitive = function (val) {
    return !(0, isObject_1.isObject)(val);
};
exports.isPremitive = isPremitive;
