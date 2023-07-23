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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncDispatcherImpl = exports.DispatcherImpl = void 0;
var rxjs_1 = require("rxjs");
var bound_1 = require("./decorators/bound");
var DispatcherImpl = exports.DispatcherImpl = function () {
    var _a;
    var _instanceExtraInitializers = [];
    var _dispatch_decorators;
    return _a = /** @class */ (function () {
            function DispatcherImpl(reducer, store, key) {
                this.reducer = (__runInitializers(this, _instanceExtraInitializers), reducer);
                this.store = store;
                this.key = key;
            }
            DispatcherImpl.prototype.dispatch = function (action) {
                var _a;
                var mutation = (_a = {},
                    _a[this.key] = this.reducer(this.store.getState(this.key), {
                        type: action.type,
                        payload: action.payload !== undefined
                            ? action.payload
                            : this.store.getDefault(this.key),
                    }),
                    _a);
                this.store.setState(mutation);
            };
            return DispatcherImpl;
        }()),
        (function () {
            _dispatch_decorators = [bound_1.bound];
            __esDecorate(_a, null, _dispatch_decorators, { kind: "method", name: "dispatch", static: false, private: false, access: { has: function (obj) { return "dispatch" in obj; }, get: function (obj) { return obj.dispatch; } } }, null, _instanceExtraInitializers);
        })(),
        _a;
}();
var AsyncDispatcherImpl = exports.AsyncDispatcherImpl = function () {
    var _a;
    var _instanceExtraInitializers_1 = [];
    var _dispatch_decorators;
    return _a = /** @class */ (function () {
            function AsyncDispatcherImpl(reducer, store, key) {
                this.reducer = (__runInitializers(this, _instanceExtraInitializers_1), reducer);
                this.store = store;
                this.key = key;
            }
            AsyncDispatcherImpl.prototype.dispatch = function (action, config) {
                if (config === void 0) { config = {}; }
                return __awaiter(this, void 0, void 0, function () {
                    var start, fail, fallback, always, success, asyncResult, async$, result, mutation, error_1;
                    var _a, _b;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                start = config.start, fail = config.fail, fallback = config.fallback, always = config.always, success = config.success;
                                asyncResult = this.reducer(this.store.getState(this.key), action);
                                start === null || start === void 0 ? void 0 : start();
                                _c.label = 1;
                            case 1:
                                _c.trys.push([1, 3, 4, 5]);
                                async$ = asyncResult instanceof rxjs_1.Observable
                                    ? (0, rxjs_1.lastValueFrom)(asyncResult)
                                    : asyncResult;
                                return [4 /*yield*/, async$];
                            case 2:
                                result = _c.sent();
                                success === null || success === void 0 ? void 0 : success(result);
                                mutation = (_a = {},
                                    _a[this.key] = result,
                                    _a);
                                this.store.setState(mutation);
                                return [3 /*break*/, 5];
                            case 3:
                                error_1 = _c.sent();
                                fail === null || fail === void 0 ? void 0 : fail(error_1);
                                if (!fallback) {
                                    return [2 /*return*/];
                                }
                                this.store.setState((_b = {},
                                    _b[this.key] = fallback(),
                                    _b));
                                return [3 /*break*/, 5];
                            case 4:
                                always === null || always === void 0 ? void 0 : always();
                                return [7 /*endfinally*/];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            };
            return AsyncDispatcherImpl;
        }()),
        (function () {
            _dispatch_decorators = [bound_1.bound];
            __esDecorate(_a, null, _dispatch_decorators, { kind: "method", name: "dispatch", static: false, private: false, access: { has: function (obj) { return "dispatch" in obj; }, get: function (obj) { return obj.dispatch; } } }, null, _instanceExtraInitializers_1);
        })(),
        _a;
}();
