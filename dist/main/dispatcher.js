"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatcherImpl = void 0;
var DispatcherImpl = /** @class */ (function () {
    function DispatcherImpl(reducer, store, key) {
        this.reducer = reducer;
        this.store = store;
        this.key = key;
        this.dispatch = this.dispatch.bind(this);
    }
    DispatcherImpl.prototype.dispatch = function (action) {
        var _a;
        var nextVal = this.reducer(this.store.getState(this.key), action);
        this.store.setState(Object.create((_a = {}, _a[this.key] = nextVal, _a)));
    };
    return DispatcherImpl;
}());
exports.DispatcherImpl = DispatcherImpl;
