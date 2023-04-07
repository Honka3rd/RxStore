"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxStoreImpl = void 0;
var computed_1 = require("./computed");
var dispatcher_1 = require("./dispatcher");
var objectShallowCompareFactory_1 = require("./util/objectShallowCompareFactory");
var shallowCompare_1 = require("./util/shallowCompare");
var rxjs_1 = require("rxjs");
var RxStoreImpl = /** @class */ (function () {
    function RxStoreImpl(connector, comparator, comparatorMap) {
        this.connector = connector;
        this.comparatorMap = comparatorMap;
        this.comparator = shallowCompare_1.shallowCompare;
        if (comparator) {
            this.comparator = comparator;
        }
        this.objectCompare = (0, objectShallowCompareFactory_1.objectShallowCompareF)(this.comparator, this.comparatorMap);
        if (comparatorMap) {
            Object.freeze(comparatorMap);
        }
        this.comparator = this.comparator.bind(this);
        this.setState = this.setState.bind(this);
        this.getState = this.getState.bind(this);
        this.reset = this.reset.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.resetMultiple = this.resetMultiple.bind(this);
        this.observeAll = this.observeAll.bind(this);
        this.observeMultiple = this.observeMultiple.bind(this);
        this.observe = this.observe.bind(this);
        this.getDataSource = this.getDataSource.bind(this);
        this.createDispatch = this.createDispatch.bind(this);
        this.createAsyncDispatch = this.createAsyncDispatch.bind(this);
        this.withComputation = this.withComputation.bind(this);
        this.withAsyncComputation = this.withAsyncComputation.bind(this);
        this.getDefault = this.getDefault.bind(this);
        this.children = this.children.bind(this);
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
        return new computed_1.ComputedImpl(params.computation, this.connector, params.keys, this.comparator);
    };
    RxStoreImpl.prototype.withAsyncComputation = function (params) {
        return new computed_1.ComputedAsyncImpl(params.computation, this.connector, params.keys);
    };
    RxStoreImpl.prototype.children = function (selectors) {
        var _this = this;
        var utilities = {
            setParentState: function (key, value) {
                var _a;
                if (_this.connector.getAllKeys().includes(key)) {
                    _this.setState((_a = {}, _a[key] = value, _a));
                    return true;
                }
                return false;
            },
            observeParentStates: function (observer) {
                return _this.observeMultiple(selectors, observer);
            },
            observeParentState: function (key, observer) {
                if (!_this.connector.getAllKeys().includes(key)) {
                    return;
                }
                return _this.observe(key, observer);
            },
            getParentState: function (key) {
                if (!_this.connector.getAllKeys().includes(key)) {
                    return;
                }
                return _this.getState(key);
            },
            getParentDefault: function (key) {
                if (!_this.connector.getAllKeys().includes(key)) {
                    return;
                }
                return _this.getDefault(key);
            },
            comparator: this.comparator,
            parentComparatorMap: this.comparatorMap
                ? selectors.reduce(function (acc, next) {
                    var _a;
                    acc[next] = (_a = _this.comparatorMap) === null || _a === void 0 ? void 0 : _a[next];
                    return acc;
                }, {})
                : {},
        };
        return [
            utilities,
            this.getDataSource().pipe((0, rxjs_1.map)(function (states) {
                return selectors.reduce(function (acc, next) {
                    acc[next] = states[next];
                    return acc;
                }, {});
            }), (0, rxjs_1.distinctUntilChanged)(this.objectCompare)),
        ];
    };
    return RxStoreImpl;
}());
exports.RxStoreImpl = RxStoreImpl;
