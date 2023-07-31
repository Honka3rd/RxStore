"use strict";
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
exports.ReactiveImpl = void 0;
var rxjs_1 = require("rxjs");
var AsyncBeheviorSubjectWithValue_1 = require("./util/AsyncBeheviorSubjectWithValue");
var AsyncSubjectWithValue_1 = require("./util/AsyncSubjectWithValue");
var SubjectWithValue_1 = require("./util/SubjectWithValue");
var ReactiveImpl = /** @class */ (function () {
    function ReactiveImpl(initiator, config) {
        var _this = this;
        this.initiator = initiator;
        this.getDefaultAll = function () {
            return _this.getAllKeys().reduce(function (acc, next) {
                acc[next] = _this.getDefault(next);
                return acc;
            }, {});
        };
        this.dataSource = this.init(config);
    }
    ReactiveImpl.prototype.init = function (_a) {
        var _this = this;
        var fireOnCreate = _a.fireOnCreate, schedule = _a.schedule;
        var keys = Object.keys(this.initiator);
        var initData = keys.reduce(function (acc, next) {
            acc[next] = _this.initiator[next]();
            return acc;
        }, {});
        if (schedule === "async") {
            return fireOnCreate
                ? new AsyncBeheviorSubjectWithValue_1.AsyncBeheviorSubjectWithValue(initData)
                : new AsyncSubjectWithValue_1.AsyncSubjectWithValue(initData);
        }
        return fireOnCreate
            ? new rxjs_1.BehaviorSubject(initData)
            : new SubjectWithValue_1.SubjectWithValue(initData);
    };
    ReactiveImpl.prototype.get = function (key) {
        return this.dataSource.value[key];
    };
    ReactiveImpl.prototype.set = function (updated) {
        var data = this.dataSource.value;
        var keys = Object.keys(updated);
        keys.forEach(function (k) {
            data[k] = updated[k];
        });
        this.dataSource.next(data);
    };
    ReactiveImpl.prototype.reset = function (key) {
        var data = this.dataSource.value;
        data[key] = this.initiator[key]();
        this.dataSource.next(data);
    };
    ReactiveImpl.prototype.resetMultiple = function (keys) {
        var _this = this;
        var data = this.dataSource.value;
        var converted = keys;
        converted.forEach(function (key) {
            data[key] = _this.initiator[key]();
        });
        this.dataSource.next(data);
    };
    ReactiveImpl.prototype.resetAll = function () {
        var _this = this;
        var data = this.dataSource.value;
        this.getAllKeys().forEach(function (key) {
            data[key] = _this.initiator[key]();
        });
        this.dataSource.next(data);
    };
    ReactiveImpl.prototype.source = function () {
        return this.dataSource.asObservable();
    };
    ReactiveImpl.prototype.getDefault = function (key) {
        return this.initiator[key]();
    };
    ReactiveImpl.prototype.getDefaults = function (keys) {
        var _this = this;
        var converted = keys;
        return converted.reduce(function (acc, next) {
            acc[next] = _this.getDefault(next);
            return acc;
        }, {});
    };
    ReactiveImpl.prototype.getMultiple = function (keys) {
        var _this = this;
        var converted = keys;
        return converted.reduce(function (acc, next) {
            acc[next] = _this.get(next);
            return acc;
        }, {});
    };
    ReactiveImpl.prototype.getAll = function () {
        return __assign({}, this.dataSource.value);
    };
    ReactiveImpl.prototype.getAllKeys = function () {
        return Object.keys(this.initiator);
    };
    return ReactiveImpl;
}());
exports.ReactiveImpl = ReactiveImpl;
