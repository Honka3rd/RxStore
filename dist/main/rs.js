"use strict";
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
exports.RxStoreImpl = void 0;
var computed_1 = require("./computed");
var dispatcher_1 = require("./dispatcher");
var objectShallowCompareFactory_1 = require("./util/objectShallowCompareFactory");
var shallowCompare_1 = require("./util/shallowCompare");
var bound_1 = require("./decorators/bound");
var RxStoreImpl = exports.RxStoreImpl = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _observe_decorators;
    var _observeMultiple_decorators;
    var _observeAll_decorators;
    var _getState_decorators;
    var _getDefault_decorators;
    var _getComparatorMap_decorators;
    var _setState_decorators;
    var _reset_decorators;
    var _resetMultiple_decorators;
    var _resetAll_decorators;
    var _getDataSource_decorators;
    var _createDispatch_decorators;
    var _createAsyncDispatch_decorators;
    var _withComputation_decorators;
    var _withAsyncComputation_decorators;
    return _a = /** @class */ (function () {
            function RxStoreImpl(connector, comparator, comparatorMap) {
                this.connector = (__runInitializers(this, _instanceExtraInitializers), connector);
                this.comparatorMap = comparatorMap;
                this.comparator = shallowCompare_1.shallowCompare;
                if (comparator) {
                    this.comparator = comparator;
                }
                this.objectCompare = (0, objectShallowCompareFactory_1.objectShallowCompareF)(this.comparator, this.comparatorMap);
            }
            RxStoreImpl.prototype.observe = function (key, observer, comparator) {
                var _a;
                var presetComparator = ((_a = this.comparatorMap) === null || _a === void 0 ? void 0 : _a[key])
                    ? this.comparatorMap[key]
                    : this.comparator;
                var compareFn = comparator ? comparator : presetComparator;
                return this.connector.observe(key, observer, compareFn);
            };
            RxStoreImpl.prototype.observeMultiple = function (keys, observer, comparator) {
                var compareFn = comparator
                    ? (0, objectShallowCompareFactory_1.objectShallowCompareF)(comparator)
                    : (0, objectShallowCompareFactory_1.objectShallowCompareF)(this.comparator, this.comparatorMap);
                return this.connector.observeMultiple(keys, observer, compareFn);
            };
            RxStoreImpl.prototype.observeAll = function (observer, comparator) {
                var compareFn = comparator
                    ? (0, objectShallowCompareFactory_1.objectShallowCompareF)(comparator)
                    : (0, objectShallowCompareFactory_1.objectShallowCompareF)(this.comparator, this.comparatorMap);
                return this.connector.observeAll(observer, compareFn);
            };
            RxStoreImpl.prototype.getState = function (key) {
                return this.connector.get(key);
            };
            RxStoreImpl.prototype.getDefault = function (key) {
                return this.connector.getDefault(key);
            };
            RxStoreImpl.prototype.getComparatorMap = function () {
                return this.comparatorMap;
            };
            RxStoreImpl.prototype.setState = function (updated) {
                if (typeof updated === "function") {
                    var all = this.connector.getAll();
                    var nextVal = updated(all);
                    if (all === nextVal) {
                        return this;
                    }
                    if (!this.objectCompare(nextVal, this.connector.getMultiple(Object.keys(nextVal)))) {
                        this.connector.set(nextVal);
                    }
                    return this;
                }
                if (!this.objectCompare(updated, this.connector.getMultiple(Object.keys(updated)))) {
                    this.connector.set(updated);
                }
                return this;
            };
            RxStoreImpl.prototype.reset = function (key) {
                this.connector.reset(key);
                return this;
            };
            RxStoreImpl.prototype.resetMultiple = function (keys) {
                this.connector.resetMultiple(keys);
                return this;
            };
            RxStoreImpl.prototype.resetAll = function () {
                this.connector.resetAll();
                return this;
            };
            RxStoreImpl.prototype.getDataSource = function () {
                return this.connector.source();
            };
            RxStoreImpl.prototype.createDispatch = function (params) {
                return new dispatcher_1.DispatcherImpl(params.reducer, this, params.key)
                    .dispatch;
            };
            RxStoreImpl.prototype.createAsyncDispatch = function (params) {
                return new dispatcher_1.AsyncDispatcherImpl(params.reducer, this, params.key)
                    .dispatch;
            };
            RxStoreImpl.prototype.withComputation = function (params) {
                return new computed_1.ComputedImpl(params.computation, this.connector, params.comparator ? params.comparator : this.comparator);
            };
            RxStoreImpl.prototype.withAsyncComputation = function (params) {
                return new computed_1.ComputedAsyncImpl(params.computation, this.connector, Boolean(params.lazy), params.comparator ? params.comparator : this.comparator, params.onStart, params.onError, params.onSuccess, params.onComplete);
            };
            return RxStoreImpl;
        }()),
        (function () {
            _observe_decorators = [bound_1.bound];
            _observeMultiple_decorators = [bound_1.bound];
            _observeAll_decorators = [bound_1.bound];
            _getState_decorators = [bound_1.bound];
            _getDefault_decorators = [bound_1.bound];
            _getComparatorMap_decorators = [bound_1.bound];
            _setState_decorators = [bound_1.bound];
            _reset_decorators = [bound_1.bound];
            _resetMultiple_decorators = [bound_1.bound];
            _resetAll_decorators = [bound_1.bound];
            _getDataSource_decorators = [bound_1.bound];
            _createDispatch_decorators = [bound_1.bound];
            _createAsyncDispatch_decorators = [bound_1.bound];
            _withComputation_decorators = [bound_1.bound];
            _withAsyncComputation_decorators = [bound_1.bound];
            __esDecorate(_a, null, _observe_decorators, { kind: "method", name: "observe", static: false, private: false, access: { has: function (obj) { return "observe" in obj; }, get: function (obj) { return obj.observe; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _observeMultiple_decorators, { kind: "method", name: "observeMultiple", static: false, private: false, access: { has: function (obj) { return "observeMultiple" in obj; }, get: function (obj) { return obj.observeMultiple; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _observeAll_decorators, { kind: "method", name: "observeAll", static: false, private: false, access: { has: function (obj) { return "observeAll" in obj; }, get: function (obj) { return obj.observeAll; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getState_decorators, { kind: "method", name: "getState", static: false, private: false, access: { has: function (obj) { return "getState" in obj; }, get: function (obj) { return obj.getState; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDefault_decorators, { kind: "method", name: "getDefault", static: false, private: false, access: { has: function (obj) { return "getDefault" in obj; }, get: function (obj) { return obj.getDefault; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getComparatorMap_decorators, { kind: "method", name: "getComparatorMap", static: false, private: false, access: { has: function (obj) { return "getComparatorMap" in obj; }, get: function (obj) { return obj.getComparatorMap; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _setState_decorators, { kind: "method", name: "setState", static: false, private: false, access: { has: function (obj) { return "setState" in obj; }, get: function (obj) { return obj.setState; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _reset_decorators, { kind: "method", name: "reset", static: false, private: false, access: { has: function (obj) { return "reset" in obj; }, get: function (obj) { return obj.reset; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _resetMultiple_decorators, { kind: "method", name: "resetMultiple", static: false, private: false, access: { has: function (obj) { return "resetMultiple" in obj; }, get: function (obj) { return obj.resetMultiple; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _resetAll_decorators, { kind: "method", name: "resetAll", static: false, private: false, access: { has: function (obj) { return "resetAll" in obj; }, get: function (obj) { return obj.resetAll; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDataSource_decorators, { kind: "method", name: "getDataSource", static: false, private: false, access: { has: function (obj) { return "getDataSource" in obj; }, get: function (obj) { return obj.getDataSource; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createDispatch_decorators, { kind: "method", name: "createDispatch", static: false, private: false, access: { has: function (obj) { return "createDispatch" in obj; }, get: function (obj) { return obj.createDispatch; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createAsyncDispatch_decorators, { kind: "method", name: "createAsyncDispatch", static: false, private: false, access: { has: function (obj) { return "createAsyncDispatch" in obj; }, get: function (obj) { return obj.createAsyncDispatch; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _withComputation_decorators, { kind: "method", name: "withComputation", static: false, private: false, access: { has: function (obj) { return "withComputation" in obj; }, get: function (obj) { return obj.withComputation; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _withAsyncComputation_decorators, { kind: "method", name: "withAsyncComputation", static: false, private: false, access: { has: function (obj) { return "withAsyncComputation" in obj; }, get: function (obj) { return obj.withAsyncComputation; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
