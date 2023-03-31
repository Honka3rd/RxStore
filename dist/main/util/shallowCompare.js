"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowCompare = void 0;
var isObject_1 = require("./isObject");
var objectShallowCompareFactory_1 = require("./objectShallowCompareFactory");
var objectShallowCompare = (0, objectShallowCompareFactory_1.objectShallowCompareF)();
var shallowCompare = function (o1, o2) {
    if ((0, isObject_1.isObject)(o1) &&
        (0, isObject_1.isObject)(o2)) {
        return objectShallowCompare(o1, o2);
    }
    return o1 === o2;
};
exports.shallowCompare = shallowCompare;
