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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.push(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.push(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isObject = exports.isPrimitive = exports.bound = exports.shallowCompare = exports.shallowClone = exports.IRS = exports.NRS = void 0;
var immutable_1 = require("immutable");
var connectivity_1 = require("./main/connectivity");
var rs_1 = require("./main/rs");
var isPrimitive_1 = require("./main/util/isPrimitive");
Object.defineProperty(exports, "isPrimitive", { enumerable: true, get: function () { return isPrimitive_1.isPrimitive; } });
var shallowClone_1 = require("./main/util/shallowClone");
Object.defineProperty(exports, "shallowClone", { enumerable: true, get: function () { return shallowClone_1.shallowClone; } });
var shallowCompare_1 = require("./main/util/shallowCompare");
Object.defineProperty(exports, "shallowCompare", { enumerable: true, get: function () { return shallowCompare_1.shallowCompare; } });
var bound_1 = require("./main/decorators/bound");
Object.defineProperty(exports, "bound", { enumerable: true, get: function () { return bound_1.bound; } });
var isObject_1 = require("./main/util/isObject");
Object.defineProperty(exports, "isObject", { enumerable: true, get: function () { return isObject_1.isObject; } });
var RxNStoreImpl = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _getClonedState_decorators;
    var _getStateAll_decorators;
    var _getStates_decorators;
    var _getImmutableState_decorators;
    var _getDefaults_decorators;
    var _getDefaultAll_decorators;
    var _getCloneFunctionMap_decorators;
    return _a = /** @class */ (function (_super) {
            __extends(RxNStoreImpl, _super);
            function RxNStoreImpl(connector, cloneFunction, cloneFunctionMap, comparator, comparatorMap) {
                var _this = _super.call(this, connector, comparator, comparatorMap) || this;
                _this.cloneFunction = (__runInitializers(_this, _instanceExtraInitializers), cloneFunction);
                _this.cloneFunctionMap = cloneFunctionMap;
                if (!cloneFunction) {
                    _this.cloneFunction = shallowClone_1.shallowClone;
                }
                return _this;
            }
            RxNStoreImpl.prototype.getClonedState = function (key) {
                var _a = this, cloneFunction = _a.cloneFunction, cloneFunctionMap = _a.cloneFunctionMap;
                var cloneFn = cloneFunctionMap === null || cloneFunctionMap === void 0 ? void 0 : cloneFunctionMap[key];
                if (cloneFn) {
                    return cloneFn(this.getState(key));
                }
                return cloneFunction(this.getState(key));
            };
            RxNStoreImpl.prototype.getStateAll = function () {
                return this.connector.getAll();
            };
            RxNStoreImpl.prototype.getStates = function (keys) {
                return this.connector.getMultiple(keys);
            };
            RxNStoreImpl.prototype.getImmutableState = function (key) {
                var origin = this.getState(key);
                if ((0, isPrimitive_1.isPrimitive)(origin)) {
                    return {
                        success: false,
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
            RxNStoreImpl.prototype.getDefaults = function (keys) {
                return this.connector.getDefaults(keys);
            };
            RxNStoreImpl.prototype.getDefaultAll = function () {
                return this.connector.getDefaultAll();
            };
            RxNStoreImpl.prototype.getCloneFunctionMap = function () {
                return __assign({}, this.cloneFunctionMap);
            };
            return RxNStoreImpl;
        }(rs_1.RxStoreImpl)),
        (function () {
            _getClonedState_decorators = [bound_1.bound];
            _getStateAll_decorators = [bound_1.bound];
            _getStates_decorators = [bound_1.bound];
            _getImmutableState_decorators = [bound_1.bound];
            _getDefaults_decorators = [bound_1.bound];
            _getDefaultAll_decorators = [bound_1.bound];
            _getCloneFunctionMap_decorators = [bound_1.bound];
            __esDecorate(_a, null, _getClonedState_decorators, { kind: "method", name: "getClonedState", static: false, private: false, access: { has: function (obj) { return "getClonedState" in obj; }, get: function (obj) { return obj.getClonedState; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getStateAll_decorators, { kind: "method", name: "getStateAll", static: false, private: false, access: { has: function (obj) { return "getStateAll" in obj; }, get: function (obj) { return obj.getStateAll; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getStates_decorators, { kind: "method", name: "getStates", static: false, private: false, access: { has: function (obj) { return "getStates" in obj; }, get: function (obj) { return obj.getStates; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getImmutableState_decorators, { kind: "method", name: "getImmutableState", static: false, private: false, access: { has: function (obj) { return "getImmutableState" in obj; }, get: function (obj) { return obj.getImmutableState; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDefaults_decorators, { kind: "method", name: "getDefaults", static: false, private: false, access: { has: function (obj) { return "getDefaults" in obj; }, get: function (obj) { return obj.getDefaults; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDefaultAll_decorators, { kind: "method", name: "getDefaultAll", static: false, private: false, access: { has: function (obj) { return "getDefaultAll" in obj; }, get: function (obj) { return obj.getDefaultAll; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getCloneFunctionMap_decorators, { kind: "method", name: "getCloneFunctionMap", static: false, private: false, access: { has: function (obj) { return "getCloneFunctionMap" in obj; }, get: function (obj) { return obj.getCloneFunctionMap; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
function NRS(initiator, _a) {
    var _b = _a === void 0 ? {} : _a, cloneFunction = _b.cloneFunction, cloneFunctionMap = _b.cloneFunctionMap, comparator = _b.comparator, comparatorMap = _b.comparatorMap, config = _b.config;
    return new RxNStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config), cloneFunction, cloneFunctionMap, comparator, comparatorMap);
}
exports.NRS = NRS;
var RxImStoreImpl = function () {
    var _a;
    var _instanceExtraInitializers_1 = [];
    var _getStateAll_decorators;
    var _getStates_decorators;
    var _getDefaults_decorators;
    var _getDefaultAll_decorators;
    return _a = /** @class */ (function (_super) {
            __extends(RxImStoreImpl, _super);
            function RxImStoreImpl(connector, config) {
                var _this = _super.call(this, connector, function (prev, next) {
                    if ((0, immutable_1.isImmutable)(prev) && (0, immutable_1.isImmutable)(next)) {
                        return (0, immutable_1.is)(prev, next);
                    }
                    return prev === next;
                }) || this;
                __runInitializers(_this, _instanceExtraInitializers_1);
                return _this;
            }
            RxImStoreImpl.prototype.getStateAll = function () {
                return (0, immutable_1.Map)(this.connector.getAll());
            };
            RxImStoreImpl.prototype.getStates = function (keys) {
                return (0, immutable_1.Map)(this.connector.getMultiple(keys));
            };
            RxImStoreImpl.prototype.getDefaults = function (keys) {
                return (0, immutable_1.Map)(this.connector.getDefaults(keys));
            };
            RxImStoreImpl.prototype.getDefaultAll = function () {
                return (0, immutable_1.Map)(this.connector.getDefaultAll());
            };
            return RxImStoreImpl;
        }(rs_1.RxStoreImpl)),
        (function () {
            _getStateAll_decorators = [bound_1.bound];
            _getStates_decorators = [bound_1.bound];
            _getDefaults_decorators = [bound_1.bound];
            _getDefaultAll_decorators = [bound_1.bound];
            __esDecorate(_a, null, _getStateAll_decorators, { kind: "method", name: "getStateAll", static: false, private: false, access: { has: function (obj) { return "getStateAll" in obj; }, get: function (obj) { return obj.getStateAll; } } }, null, _instanceExtraInitializers_1);
            __esDecorate(_a, null, _getStates_decorators, { kind: "method", name: "getStates", static: false, private: false, access: { has: function (obj) { return "getStates" in obj; }, get: function (obj) { return obj.getStates; } } }, null, _instanceExtraInitializers_1);
            __esDecorate(_a, null, _getDefaults_decorators, { kind: "method", name: "getDefaults", static: false, private: false, access: { has: function (obj) { return "getDefaults" in obj; }, get: function (obj) { return obj.getDefaults; } } }, null, _instanceExtraInitializers_1);
            __esDecorate(_a, null, _getDefaultAll_decorators, { kind: "method", name: "getDefaultAll", static: false, private: false, access: { has: function (obj) { return "getDefaultAll" in obj; }, get: function (obj) { return obj.getDefaultAll; } } }, null, _instanceExtraInitializers_1);
        })(),
        _a;
}();
function IRS(initiator, config) {
    return new RxImStoreImpl(new connectivity_1.ConnectivityImpl(initiator, config));
}
exports.IRS = IRS;
