"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractSubjectWithValue = void 0;
var AbstractSubjectWithValue = /** @class */ (function () {
    function AbstractSubjectWithValue(value, subject) {
        this.value = value;
        this.source = subject;
    }
    AbstractSubjectWithValue.prototype.next = function (val) {
        this.value = val;
        this.source.next(this.value);
    };
    AbstractSubjectWithValue.prototype.subscribe = function (observer) {
        return this.source.subscribe(observer);
    };
    return AbstractSubjectWithValue;
}());
exports.AbstractSubjectWithValue = AbstractSubjectWithValue;
