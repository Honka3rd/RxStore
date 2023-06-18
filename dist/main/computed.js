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
exports.ComputedAsyncImpl = exports.ComputedImpl = void 0;
var rxjs_1 = require("rxjs");
var rx_store_types_1 = require("rx-store-types");
var bound_1 = require("./decorators/bound");
var ComputedImpl = exports.ComputedImpl = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _get_decorators;
    var _observe_decorators;
    return _a = /** @class */ (function () {
            function ComputedImpl(computation, subscribable, comparator) {
                this.subscribable = (__runInitializers(this, _instanceExtraInitializers), subscribable);
                this.comparator = comparator;
                this.computation = computation;
                this.computed = this.computation(subscribable.getDefaultAll());
            }
            ComputedImpl.prototype.get = function () {
                return this.computed;
            };
            ComputedImpl.prototype.observe = function (observer) {
                var _this = this;
                return this.subscribable.observeAll(function (states) {
                    var value = _this.computation(states);
                    _this.computed = value;
                    observer(value);
                }, this.comparator);
            };
            return ComputedImpl;
        }()),
        (function () {
            _get_decorators = [bound_1.bound];
            _observe_decorators = [bound_1.bound];
            __esDecorate(_a, null, _get_decorators, { kind: "method", name: "get", static: false, private: false, access: { has: function (obj) { return "get" in obj; }, get: function (obj) { return obj.get; } } }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _observe_decorators, { kind: "method", name: "observe", static: false, private: false, access: { has: function (obj) { return "observe" in obj; }, get: function (obj) { return obj.observe; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
var ComputedAsyncImpl = exports.ComputedAsyncImpl = function () {
    var _a;
    var _instanceExtraInitializers_1 = [];
    var _get_decorators;
    var _observe_decorators;
    return _a = /** @class */ (function () {
            function ComputedAsyncImpl(computation, subscribable, lazy, comparator, onStart, onError, onSuccess, onComplete) {
                this.subscribable = (__runInitializers(this, _instanceExtraInitializers_1), subscribable);
                this.lazy = lazy;
                this.comparator = comparator;
                this.onStart = onStart;
                this.onError = onError;
                this.onSuccess = onSuccess;
                this.onComplete = onComplete;
                this.state = rx_store_types_1.AsyncStates.PENDING;
                this.computation = computation;
            }
            ComputedAsyncImpl.prototype.get = function () {
                return {
                    state: this.state,
                    value: this.computed,
                };
            };
            ComputedAsyncImpl.prototype.observe = function (observer) {
                var _this = this;
                var connect = this.lazy ? rxjs_1.exhaustMap : rxjs_1.switchMap;
                var subscription = this.subscribable
                    .source()
                    .pipe((0, rxjs_1.tap)(function (val) {
                    var _a;
                    _this.state = rx_store_types_1.AsyncStates.PENDING;
                    (_a = _this.onStart) === null || _a === void 0 ? void 0 : _a.call(_this, val);
                }), (0, rxjs_1.distinctUntilChanged)(this.comparator), connect(function (states) {
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
                    }), (0, rxjs_1.tap)(function (deferred) {
                        var _a, _b;
                        if (deferred.success) {
                            _this.state = rx_store_types_1.AsyncStates.FULFILLED;
                            (_a = _this.onSuccess) === null || _a === void 0 ? void 0 : _a.call(_this, deferred.result);
                            return;
                        }
                        (_b = _this.onError) === null || _b === void 0 ? void 0 : _b.call(_this, deferred.cause);
                        _this.state = rx_store_types_1.AsyncStates.ERROR;
                    }));
                }))
                    .subscribe({
                    next: observer,
                    complete: this.onComplete
                });
                return function () { return subscription.unsubscribe(); };
            };
            return ComputedAsyncImpl;
        }()),
        (function () {
            _get_decorators = [bound_1.bound];
            _observe_decorators = [bound_1.bound];
            __esDecorate(_a, null, _get_decorators, { kind: "method", name: "get", static: false, private: false, access: { has: function (obj) { return "get" in obj; }, get: function (obj) { return obj.get; } } }, null, _instanceExtraInitializers_1);
            __esDecorate(_a, null, _observe_decorators, { kind: "method", name: "observe", static: false, private: false, access: { has: function (obj) { return "observe" in obj; }, get: function (obj) { return obj.observe; } } }, null, _instanceExtraInitializers_1);
        })(),
        _a;
}();
