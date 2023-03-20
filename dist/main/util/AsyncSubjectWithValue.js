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
exports.AsyncSubjectWithValue = void 0;
var rxjs_1 = require("rxjs");
var AbstractSubjectWithValue_1 = require("./AbstractSubjectWithValue");
var AsyncSubjectWithValue = /** @class */ (function (_super) {
    __extends(AsyncSubjectWithValue, _super);
    function AsyncSubjectWithValue(value) {
        var _this = _super.call(this, value, new rxjs_1.Subject()) || this;
        _this.value = value;
        return _this;
    }
    AsyncSubjectWithValue.prototype.subscribe = function (observer) {
        return this.source.pipe((0, rxjs_1.debounceTime)(0)).subscribe(observer);
    };
    AsyncSubjectWithValue.prototype.asObservable = function () {
        return this.source.asObservable().pipe((0, rxjs_1.debounceTime)(0));
    };
    return AsyncSubjectWithValue;
}(AbstractSubjectWithValue_1.AbstractSubjectWithValue));
exports.AsyncSubjectWithValue = AsyncSubjectWithValue;
