"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputedImpl = void 0;
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
