"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncDispatcherImpl = exports.DispatcherImpl = void 0;
var rxjs_1 = require("rxjs");
var DispatcherImpl = /** @class */ (function () {
    function DispatcherImpl(reducer, store, key) {
        this.reducer = reducer;
        this.store = store;
        this.key = key;
        this.dispatch = this.dispatch.bind(this);
    }
    DispatcherImpl.prototype.dispatch = function (action) {
        var _a;
        var mutation = (_a = {},
            _a[this.key] = this.reducer(this.store.getState(this.key), action),
            _a);
        this.store.setState(mutation);
    };
    return DispatcherImpl;
}());
exports.DispatcherImpl = DispatcherImpl;
var AsyncDispatcherImpl = /** @class */ (function () {
    function AsyncDispatcherImpl(reducer, store, key) {
        this.reducer = reducer;
        this.store = store;
        this.key = key;
        this.dispatch = this.dispatch.bind(this);
    }
    AsyncDispatcherImpl.prototype.dispatch = function (action, config) {
        if (config === void 0) { config = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var start, fail, errorFallback, always, success, asyncResult, async$, result, mutation, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        start = config.start, fail = config.fail, errorFallback = config.errorFallback, always = config.always, success = config.success;
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
                        if (!errorFallback) {
                            return [2 /*return*/];
                        }
                        this.store.setState((_b = {},
                            _b[this.key] = errorFallback(),
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
}());
exports.AsyncDispatcherImpl = AsyncDispatcherImpl;
