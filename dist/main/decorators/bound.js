"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bound = void 0;
function bound(target, context) {
    var methodName = context.name;
    if (context.private) {
        throw new Error("'bound' cannot decorate private properties like ".concat(methodName, "."));
    }
    context.addInitializer(function () {
        var self = this;
        var toBeBound = Reflect.get(self, methodName);
        Reflect.set(self, methodName, toBeBound.bind(self));
    });
}
exports.bound = bound;
