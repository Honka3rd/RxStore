"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputedAsyncImpl = exports.ComputedImpl = void 0;
var rxjs_1 = require("rxjs");
var interfaces_1 = require("./interfaces");
var ComputedImpl = /** @class */ (function () {
    function ComputedImpl(computation, subscribable, keys, comparator) {
        this.subscribable = subscribable;
        this.keys = keys;
        this.comparator = comparator;
        this.computation = computation;
        this.computed = this.computation(subscribable.getDefaultAll());
        this.get = this.get.bind(this);
        this.observe = this.observe.bind(this);
    }
    ComputedImpl.prototype.get = function () {
        return this.computed;
    };
    ComputedImpl.prototype.observe = function (observer) {
        var _this = this;
        return this.subscribable.observeMultiple(this.keys, function (states) {
            var value = _this.computation(states);
            _this.computed = value;
            observer(value);
        }, this.comparator);
    };
    return ComputedImpl;
}());
exports.ComputedImpl = ComputedImpl;
var ComputedAsyncImpl = /** @class */ (function () {
    function ComputedAsyncImpl(computation, subscribable, keys) {
        this.subscribable = subscribable;
        this.keys = keys;
        this.state = interfaces_1.AsyncStates.PENDING;
        this.computation = computation;
        this.get = this.get.bind(this);
        this.observe = this.observe.bind(this);
    }
    ComputedAsyncImpl.prototype.get = function () {
        return {
            state: this.state,
            value: this.computed,
        };
    };
    ComputedAsyncImpl.prototype.observe = function (observer) {
        var _this = this;
        var subscription = this.subscribable
            .source()
            .pipe((0, rxjs_1.tap)(function () {
            _this.state = interfaces_1.AsyncStates.PENDING;
        }), (0, rxjs_1.switchMap)(function (states) {
            var asyncReturn = _this.computation(states);
            var async$ = asyncReturn instanceof Promise ? (0, rxjs_1.from)(asyncReturn) : asyncReturn;
            return async$.pipe((0, rxjs_1.map)(function (result) {
                return {
                    success: true,
                    result: result,
                };
            }), (0, rxjs_1.catchError)(function (err) {
                return (0, rxjs_1.of)({
                    success: false,
                    cause: err,
                });
            }), (0, rxjs_1.tap)(function (_a) {
                var success = _a.success;
                if (success) {
                    _this.state = interfaces_1.AsyncStates.FULLFILLED;
                    return;
                }
                _this.state = interfaces_1.AsyncStates.ERROR;
            }));
        }))
            .subscribe(observer);
        return function () { return subscription.unsubscribe(); };
    };
    return ComputedAsyncImpl;
}());
exports.ComputedAsyncImpl = ComputedAsyncImpl;
