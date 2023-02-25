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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectivityImpl = void 0;
var rxjs_1 = require("rxjs");
var reactive_1 = require("./reactive");
var ConnectivityImpl = /** @class */ (function (_super) {
    __extends(ConnectivityImpl, _super);
    function ConnectivityImpl(initiator, config) {
        if (config === void 0) { config = { schedule: "sync", fireOnCreate: false }; }
        return _super.call(this, initiator, config) || this;
    }
    ConnectivityImpl.prototype.observe = function (key, observer, comparator) {
        var subscription = this.source()
            .pipe((0, rxjs_1.map)(function (val) { return val[key]; }), (0, rxjs_1.distinctUntilChanged)(comparator))
            .subscribe(observer);
        return function () { return subscription.unsubscribe(); };
    };
    ConnectivityImpl.prototype.observeMultiple = function (keys, observer, comparator) {
        var subscription = this.source()
            .pipe((0, rxjs_1.map)(function (val) {
            return keys.reduce(function (acc, next) {
                acc[next] = val[next];
                return acc;
            }, {});
        }), (0, rxjs_1.distinctUntilChanged)(comparator))
            .subscribe(observer);
        return function () { return subscription.unsubscribe(); };
    };
    ConnectivityImpl.prototype.observeAll = function (observer, comparator) {
        var subscription = this.source()
            .pipe((0, rxjs_1.map)(function (val) { return (__assign({}, val)); }), (0, rxjs_1.distinctUntilChanged)(comparator))
            .subscribe(observer);
        return function () { return subscription.unsubscribe(); };
    };
    return ConnectivityImpl;
}(reactive_1.ReactiveImpl));
exports.ConnectivityImpl = ConnectivityImpl;
