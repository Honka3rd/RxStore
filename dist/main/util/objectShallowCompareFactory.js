"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectShallowCompareF = void 0;
var objectShallowCompareF = function (comparator, comparatorMap) {
    if (comparator === void 0) { comparator = function (o1, o2) { return o1 === o2; }; }
    return function (o1, o2) {
        if (Object.getPrototypeOf(o1) !== Object.getPrototypeOf(o2)) {
            return false;
        }
        var ownKeysO1 = Object.getOwnPropertyNames(o1);
        var ownKeysO2 = Object.getOwnPropertyNames(o2);
        if (ownKeysO1.length !== ownKeysO2.length) {
            return false;
        }
        if (comparatorMap) {
            for (var _i = 0, ownKeysO1_1 = ownKeysO1; _i < ownKeysO1_1.length; _i++) {
                var key = ownKeysO1_1[_i];
                var compareFn = (comparatorMap === null || comparatorMap === void 0 ? void 0 : comparatorMap[key])
                    ? comparatorMap[key]
                    : comparator;
                if (!compareFn(o1[key], o2[key])) {
                    return false;
                }
            }
        }
        else {
            for (var _a = 0, ownKeysO1_2 = ownKeysO1; _a < ownKeysO1_2.length; _a++) {
                var key = ownKeysO1_2[_a];
                if (!comparator(o1[key], o2[key])) {
                    return false;
                }
            }
        }
        return true;
    };
};
exports.objectShallowCompareF = objectShallowCompareF;
