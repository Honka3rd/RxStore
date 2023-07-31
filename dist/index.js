"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shallowCompare = exports.shallowClone = exports.isPrimitive = exports.isObject = exports.bound = exports.IRS = exports.NRS = void 0;
var connectivity_1 = require("./main/connectivity");
var bound_1 = require("./main/decorators/bound");
Object.defineProperty(exports, "bound", { enumerable: true, get: function () { return bound_1.bound; } });
var immutable_1 = require("./main/immutable");
var normal_1 = require("./main/normal");
var isObject_1 = require("./main/util/isObject");
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return isObject_1.isObject; } });
var isPrimitive_1 = require("./main/util/isPrimitive");
Object.defineProperty(exports, "isPrimitive", { enumerable: true, get: function () { return isPrimitive_1.isPrimitive; } });
var shallowClone_1 = require("./main/util/shallowClone");
Object.defineProperty(exports, "shallowClone", { enumerable: true, get: function () { return shallowClone_1.shallowClone; } });
var shallowCompare_1 = require("./main/util/shallowCompare");
Object.defineProperty(exports, "shallowCompare", { enumerable: true, get: function () { return shallowCompare_1.shallowCompare; } });
function NRS(initiator, _a) {
    var _b = _a === void 0 ? {} : _a, cloneFunction = _b.cloneFunction, cloneFunctionMap = _b.cloneFunctionMap, comparator = _b.comparator, comparatorMap = _b.comparatorMap, config = _b.config;
    var nStore = new normal_1.RxNStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config), cloneFunction, cloneFunctionMap, comparator, comparatorMap);
    Object.keys(initiator).forEach(function (key) { return initiator[key](nStore); });
    return nStore;
}
exports.NRS = NRS;
function IRS(initiator, config) {
    var iStore = new immutable_1.RxImStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config));
    Object.keys(initiator).forEach(function (key) { return initiator[key](iStore); });
    return iStore;
}
exports.IRS = IRS;
