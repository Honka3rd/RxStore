"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxStoreImpl = void 0;
var computed_1 = require("./computed");
var dispatcher_1 = require("./dispatcher");
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
var objectShallowCompare = objectShallowCompareF();
var shallowCompare = function (o1, o2) {
    if (typeof o1 === "object" &&
        typeof o2 === "object" &&
        o1 !== null &&
        o2 !== null) {
        return objectShallowCompare(o1, o2);
    }
    return o1 === o2;
};
var RxStoreImpl = /** @class */ (function () {
    function RxStoreImpl(connector, comparator, comparatorMap) {
        this.connector = connector;
        this.comparatorMap = comparatorMap;
        this.comparator = shallowCompare;
        if (comparator) {
            this.comparator = comparator;
        }
        this.objectCompare = objectShallowCompareF(this.comparator, this.comparatorMap);
        this.setState = this.setState.bind(this);
        this.getState = this.getState.bind(this);
        this.getStateAll = this.getStateAll.bind(this);
        this.getStates = this.getStates.bind(this);
        this.reset = this.reset.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.observeAll = this.observeAll.bind(this);
        this.observeMultiple = this.observeMultiple.bind(this);
        this.observe = this.observe.bind(this);
        this.getDataSource = this.getDataSource.bind(this);
        this.createDispatch = this.createDispatch.bind(this);
    }
    RxStoreImpl.prototype.observe = function (key, observer, comparator) {
        var _a;
        var presetComparetor = ((_a = this.comparatorMap) === null || _a === void 0 ? void 0 : _a[key])
            ? this.comparatorMap[key]
            : this.comparator;
        var compareFn = comparator ? comparator : presetComparetor;
        return this.connector.observe(key, observer, compareFn);
    };
    RxStoreImpl.prototype.observeMultiple = function (keys, observer, comparator) {
        var compareFn = comparator
            ? objectShallowCompareF(comparator)
            : objectShallowCompareF(this.comparator, this.comparatorMap);
        return this.connector.observeMultiple(keys, observer, compareFn);
    };
    RxStoreImpl.prototype.observeAll = function (observer, comparator) {
        var compareFn = comparator
            ? objectShallowCompareF(comparator)
            : objectShallowCompareF(this.comparator, this.comparatorMap);
        return this.connector.observeAll(observer, compareFn);
    };
    RxStoreImpl.prototype.getState = function (key) {
        return this.connector.get(key);
    };
    RxStoreImpl.prototype.getStates = function (keys) {
        return this.connector.getMultiple(keys);
    };
    RxStoreImpl.prototype.getStateAll = function () {
        return this.connector.getAll();
    };
    RxStoreImpl.prototype.setState = function (updated) {
        if (typeof updated === "function") {
            var all = this.getStateAll();
            var nextVal = updated(all);
            if (all === nextVal) {
                return this;
            }
            if (!this.objectCompare(nextVal, this.getStates(Object.keys(nextVal)))) {
                this.connector.set(nextVal);
            }
            return this;
        }
        if (!this.objectCompare(updated, this.getStates(Object.keys(updated)))) {
            this.connector.set(updated);
        }
        return this;
    };
    RxStoreImpl.prototype.reset = function (key) {
        this.connector.reset(key);
        return this;
    };
    RxStoreImpl.prototype.resetAll = function (keys) {
        if (!keys) {
            this.connector.set(this.connector.getDefaultAll());
            return this;
        }
        this.connector.set(this.connector.getDefaults(keys));
        return this;
    };
    RxStoreImpl.prototype.getDataSource = function () {
        return this.connector.source();
    };
    RxStoreImpl.prototype.createDispatch = function (params) {
        return new dispatcher_1.DispatcherImpl(params.reducer, this, params.key)
            .dispatch;
    };
    RxStoreImpl.prototype.createComputed = function (params) {
        return new computed_1.ComputedImpl(params.computation, this, params.keys, this.comparator);
    };
    return RxStoreImpl;
}());
exports.RxStoreImpl = RxStoreImpl;
