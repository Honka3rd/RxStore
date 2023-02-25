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
var isPremitive_1 = require("./main/util/isPremitive");
var shallowClone_1 = require("./main/util/shallowClone");
var RxNStoreImpl = /** @class */ (function (_super) {
    __extends(RxNStoreImpl, _super);
    function RxNStoreImpl(connector, cloneFunction, cloneFunctionMap, comparator, comparatorMap) {
        var _this = _super.call(this, connector, comparator, comparatorMap) || this;
        _this.cloneFunction = cloneFunction;
        _this.cloneFunctionMap = cloneFunctionMap;
        _this.getClonedState = _this.getClonedState.bind(_this);
        _this.getImmutableState = _this.getImmutableState.bind(_this);
        _this.getStates = _this.getStates.bind(_this);
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
        return (0, shallowClone_1.shallowClone)(this.getState(key));
    };
    RxNStoreImpl.prototype.getStateAll = function () {
        return this.connector.getAll();
    };
    RxNStoreImpl.prototype.getStates = function (keys) {
        return this.connector.getMultiple(keys);
    };
    RxNStoreImpl.prototype.getImmutableState = function (key) {
        var origin = this.getState(key);
        if ((0, isPremitive_1.isPremitive)(origin)) {
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
    var _b = _a === void 0 ? {} : _a, cloneFunction = _b.cloneFunction, cloneFunctionMap = _b.cloneFunctionMap, comparator = _b.comparator, comparatorMap = _b.comparatorMap, config = _b.config;
    return new RxNStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config), cloneFunction, cloneFunctionMap, comparator, comparatorMap);
}
exports.NRS = NRS;
var RxImStoreImpl = /** @class */ (function (_super) {
    __extends(RxImStoreImpl, _super);
    function RxImStoreImpl(connector, config) {
        var _this = _super.call(this, connector, function (prev, next) {
            if ((0, immutable_1.isImmutable)(prev) && (0, immutable_1.isImmutable)(next)) {
                return (0, immutable_1.is)(prev, next);
            }
            return prev === next;
        }) || this;
        var invalid = Object.values(connector.getDefaultAll()).find(function (val) { return val === undefined || (!(0, immutable_1.isImmutable)(val) && !(0, isPremitive_1.isPremitive)(val)); });
        if (invalid) {
            throw Error("".concat(String(invalid), " is not an immutable Object"));
        }
        _this.getStateAll = _this.getStateAll.bind(_this);
        _this.getStates = _this.getStates.bind(_this);
        return _this;
    }
    RxImStoreImpl.prototype.getStateAll = function () {
        return (0, immutable_1.Map)(this.connector.getAll());
    };
    RxImStoreImpl.prototype.getStates = function (keys) {
        return (0, immutable_1.Map)(this.connector.getMultiple(keys));
    };
    return RxImStoreImpl;
}(rs_1.RxStoreImpl));
function IRS(initiator, config) {
    return new RxImStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config));
}
exports.IRS = IRS;
