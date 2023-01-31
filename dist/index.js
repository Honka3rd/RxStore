"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.IRS = exports.NRS = void 0;
var immutable_1 = require("immutable");
var connectivity_1 = require("./main/connectivity");
var rs_1 = require("./main/rs");
var shallowClone = function (input) {
    if (!input) {
        return input;
    }
    if (typeof input !== "object") {
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
var isPremitive = function (val) {
    return !((typeof val === "object" && val !== null) ||
        typeof val === "function");
};
var RxNStoreImpl = /** @class */ (function (_super) {
    __extends(RxNStoreImpl, _super);
    function RxNStoreImpl(connector, cloneFunction, cloneFunctionMap, comparator, comparatorMap) {
        var _this = _super.call(this, connector, comparator, comparatorMap) || this;
        _this.cloneFunction = cloneFunction;
        _this.cloneFunctionMap = cloneFunctionMap;
        _this.getClonedState = _this.getClonedState.bind(_this);
        _this.getImmutableState = _this.getImmutableState.bind(_this);
        return _this;
    }
    RxNStoreImpl.prototype.getClonedState = function (key) {
        var _a = this, cloneFunction = _a.cloneFunction, cloneFunctionMap = _a.cloneFunctionMap;
        var cloneFn = cloneFunctionMap === null || cloneFunctionMap === void 0 ? void 0 : cloneFunctionMap[key];
        if (cloneFn) {
            return cloneFn(this.getState(key));
        }
        if (cloneFunction) {
            return cloneFunction(this.getState(key));
        }
        return shallowClone(this.getState(key));
    };
    RxNStoreImpl.prototype.getImmutableState = function (key) {
        var origin = this.getState(key);
        if (isPremitive(origin)) {
            return {
                success: true,
                immutable: origin,
            };
        }
        var immutified = (0, immutable_1.fromJS)(origin);
        if ((0, immutable_1.isImmutable)(immutified)) {
            return {
                success: true,
                immutable: immutified,
            };
        }
        return {
            success: false,
            immutable: origin,
        };
    };
    return RxNStoreImpl;
}(rs_1.RxStoreImpl));
function NRS(initiator, _a) {
    var _b = _a === void 0 ? {} : _a, cloneFunction = _b.cloneFunction, cloneFunctionMap = _b.cloneFunctionMap, comparator = _b.comparator, comparatorMap = _b.comparatorMap;
    return new RxNStoreImpl(new connectivity_1.ConnectivityImpl(initiator), cloneFunction, cloneFunctionMap, comparator, comparatorMap);
}
exports.NRS = NRS;
var RxImStoreImpl = /** @class */ (function (_super) {
    __extends(RxImStoreImpl, _super);
    function RxImStoreImpl(connector) {
        var _this = _super.call(this, connector, function (prev, next) {
            if ((0, immutable_1.isImmutable)(prev) && (0, immutable_1.isImmutable)(next)) {
                return (0, immutable_1.is)(prev, next);
            }
            return prev === next;
        }) || this;
        var invalid = Object.values(connector.getDefaultAll()).find(function (val) { return val === undefined || (!(0, immutable_1.isImmutable)(val) && !isPremitive(val)); });
        if (invalid) {
            throw Error("".concat(String(invalid), " is not an immutable Object"));
        }
        return _this;
    }
    return RxImStoreImpl;
}(rs_1.RxStoreImpl));
function IRS(initiator) {
    return new RxImStoreImpl(new connectivity_1.ConnectivityImpl(initiator));
}
exports.IRS = IRS;
