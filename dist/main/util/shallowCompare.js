"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowCompare = void 0;
var objectShallowCompareFactory_1 = require("./objectShallowCompareFactory");
var objectShallowCompare = (0, objectShallowCompareFactory_1.objectShallowCompareF)();
var shallowCompare = function (o1, o2) {
    if (typeof o1 === "object" &&
        typeof o2 === "object" &&
        o1 !== null &&
        o2 !== null) {
        return objectShallowCompare(o1, o2);
    }
    return o1 === o2;
};
exports.shallowCompare = shallowCompare;
