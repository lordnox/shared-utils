'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Collects arguments and calls a function with them until an overflow is reached.
 *
 * ```
 * const print = collect(console.log, { overflow: 3 })
 * print(1) // ['1']
 * print(2) // ['1', '2']
 * print(3) // ['1', '2', '3']
 * print(4) // ['2', '3', '4']
 * ```
 **/
var collect = function (fn, _a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.order, order = _c === void 0 ? 'unshift' : _c, _d = _b.overflow, overflow = _d === void 0 ? 100 : _d;
    var args = [];
    var addArgUnshift = function (arg) {
        args.unshift(arg);
        args = args.slice(0, overflow);
    };
    var addArgPush = function (arg) {
        args.push(arg);
        args = args.slice(Math.max(0, args.length - overflow));
    };
    var addArg = order === 'unshift' ? addArgUnshift : addArgPush;
    return function (arg) {
        addArg(arg);
        fn(args);
    };
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

var removeElement = function (arr, item, compare) {
    if (compare === void 0) { compare = function (element, item) { return element === item; }; }
    var index = arr.findIndex(function (element) { return compare(element, item); });
    if (index === -1)
        return arr;
    return __spreadArray(__spreadArray([], arr.slice(0, index)), arr.slice(index + 1));
};
var removeElementInPlace = function (arr, item, compare) {
    if (compare === void 0) { compare = function (element, item) { return element === item; }; }
    var index = arr.findIndex(function (element) { return compare(element, item); });
    if (index === -1)
        return;
    arr.splice(index, 1);
};

const hasSymbols = () => typeof Symbol === "function";
const hasSymbol = (name) => hasSymbols() && Boolean(Symbol[name]);
const getSymbol = (name) => hasSymbol(name) ? Symbol[name] : "@@" + name;
if (!hasSymbol("asyncIterator")) {
    Symbol.asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");
}

/**
 * Based on <https://raw.githubusercontent.com/zenparsing/zen-observable/master/src/Observable.js>
 * At commit: f63849a8c60af5d514efc8e9d6138d8273c49ad6
 */
const SymbolIterator = getSymbol("iterator");
const SymbolObservable = getSymbol("observable");
const SymbolSpecies = getSymbol("species");
// === Abstract Operations ===
function getMethod(obj, key) {
    const value = obj[key];
    if (value == null) {
        return undefined;
    }
    if (typeof value !== "function") {
        throw new TypeError(value + " is not a function");
    }
    return value;
}
function getSpecies(obj) {
    let ctor = obj.constructor;
    if (ctor !== undefined) {
        ctor = ctor[SymbolSpecies];
        if (ctor === null) {
            ctor = undefined;
        }
    }
    return ctor !== undefined ? ctor : Observable;
}
function isObservable(x) {
    return x instanceof Observable; // SPEC: Brand check
}
function hostReportError(error) {
    if (hostReportError.log) {
        hostReportError.log(error);
    }
    else {
        setTimeout(() => { throw error; }, 0);
    }
}
function enqueue(fn) {
    Promise.resolve().then(() => {
        try {
            fn();
        }
        catch (e) {
            hostReportError(e);
        }
    });
}
function cleanupSubscription(subscription) {
    const cleanup = subscription._cleanup;
    if (cleanup === undefined) {
        return;
    }
    subscription._cleanup = undefined;
    if (!cleanup) {
        return;
    }
    try {
        if (typeof cleanup === "function") {
            cleanup();
        }
        else {
            const unsubscribe = getMethod(cleanup, "unsubscribe");
            if (unsubscribe) {
                unsubscribe.call(cleanup);
            }
        }
    }
    catch (e) {
        hostReportError(e);
    }
}
function closeSubscription(subscription) {
    subscription._observer = undefined;
    subscription._queue = undefined;
    subscription._state = "closed";
}
function flushSubscription(subscription) {
    const queue = subscription._queue;
    if (!queue) {
        return;
    }
    subscription._queue = undefined;
    subscription._state = "ready";
    for (const item of queue) {
        notifySubscription(subscription, item.type, item.value);
        if (subscription._state === "closed") {
            break;
        }
    }
}
function notifySubscription(subscription, type, value) {
    subscription._state = "running";
    const observer = subscription._observer;
    try {
        const m = observer ? getMethod(observer, type) : undefined;
        switch (type) {
            case "next":
                if (m)
                    m.call(observer, value);
                break;
            case "error":
                closeSubscription(subscription);
                if (m)
                    m.call(observer, value);
                else
                    throw value;
                break;
            case "complete":
                closeSubscription(subscription);
                if (m)
                    m.call(observer);
                break;
        }
    }
    catch (e) {
        hostReportError(e);
    }
    if (subscription._state === "closed") {
        cleanupSubscription(subscription);
    }
    else if (subscription._state === "running") {
        subscription._state = "ready";
    }
}
function onNotify(subscription, type, value) {
    if (subscription._state === "closed") {
        return;
    }
    if (subscription._state === "buffering") {
        subscription._queue = subscription._queue || [];
        subscription._queue.push({ type, value });
        return;
    }
    if (subscription._state !== "ready") {
        subscription._state = "buffering";
        subscription._queue = [{ type, value }];
        enqueue(() => flushSubscription(subscription));
        return;
    }
    notifySubscription(subscription, type, value);
}
class Subscription {
    constructor(observer, subscriber) {
        // ASSERT: observer is an object
        // ASSERT: subscriber is callable
        this._cleanup = undefined;
        this._observer = observer;
        this._queue = undefined;
        this._state = "initializing";
        const subscriptionObserver = new SubscriptionObserver(this);
        try {
            this._cleanup = subscriber.call(undefined, subscriptionObserver);
        }
        catch (e) {
            subscriptionObserver.error(e);
        }
        if (this._state === "initializing") {
            this._state = "ready";
        }
    }
    get closed() {
        return this._state === "closed";
    }
    unsubscribe() {
        if (this._state !== "closed") {
            closeSubscription(this);
            cleanupSubscription(this);
        }
    }
}
class SubscriptionObserver {
    constructor(subscription) { this._subscription = subscription; }
    get closed() { return this._subscription._state === "closed"; }
    next(value) { onNotify(this._subscription, "next", value); }
    error(value) { onNotify(this._subscription, "error", value); }
    complete() { onNotify(this._subscription, "complete"); }
}
/**
 * The basic Observable class. This primitive is used to wrap asynchronous
 * data streams in a common standardized data type that is interoperable
 * between libraries and can be composed to represent more complex processes.
 */
class Observable {
    constructor(subscriber) {
        if (!(this instanceof Observable)) {
            throw new TypeError("Observable cannot be called as a function");
        }
        if (typeof subscriber !== "function") {
            throw new TypeError("Observable initializer must be a function");
        }
        this._subscriber = subscriber;
    }
    subscribe(nextOrObserver, onError, onComplete) {
        if (typeof nextOrObserver !== "object" || nextOrObserver === null) {
            nextOrObserver = {
                next: nextOrObserver,
                error: onError,
                complete: onComplete
            };
        }
        return new Subscription(nextOrObserver, this._subscriber);
    }
    pipe(first, ...mappers) {
        // tslint:disable-next-line no-this-assignment
        let intermediate = this;
        for (const mapper of [first, ...mappers]) {
            intermediate = mapper(intermediate);
        }
        return intermediate;
    }
    tap(nextOrObserver, onError, onComplete) {
        const tapObserver = typeof nextOrObserver !== "object" || nextOrObserver === null
            ? {
                next: nextOrObserver,
                error: onError,
                complete: onComplete
            }
            : nextOrObserver;
        return new Observable(observer => {
            return this.subscribe({
                next(value) {
                    tapObserver.next && tapObserver.next(value);
                    observer.next(value);
                },
                error(error) {
                    tapObserver.error && tapObserver.error(error);
                    observer.error(error);
                },
                complete() {
                    tapObserver.complete && tapObserver.complete();
                    observer.complete();
                },
                start(subscription) {
                    tapObserver.start && tapObserver.start(subscription);
                }
            });
        });
    }
    forEach(fn) {
        return new Promise((resolve, reject) => {
            if (typeof fn !== "function") {
                reject(new TypeError(fn + " is not a function"));
                return;
            }
            function done() {
                subscription.unsubscribe();
                resolve(undefined);
            }
            const subscription = this.subscribe({
                next(value) {
                    try {
                        fn(value, done);
                    }
                    catch (e) {
                        reject(e);
                        subscription.unsubscribe();
                    }
                },
                error(error) {
                    reject(error);
                },
                complete() {
                    resolve(undefined);
                }
            });
        });
    }
    map(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => this.subscribe({
            next(value) {
                let propagatedValue = value;
                try {
                    propagatedValue = fn(value);
                }
                catch (e) {
                    return observer.error(e);
                }
                observer.next(propagatedValue);
            },
            error(e) { observer.error(e); },
            complete() { observer.complete(); },
        }));
    }
    filter(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => this.subscribe({
            next(value) {
                try {
                    if (!fn(value))
                        return;
                }
                catch (e) {
                    return observer.error(e);
                }
                observer.next(value);
            },
            error(e) { observer.error(e); },
            complete() { observer.complete(); },
        }));
    }
    reduce(fn, seed) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        const hasSeed = arguments.length > 1;
        let hasValue = false;
        let acc = seed;
        return new C(observer => this.subscribe({
            next(value) {
                const first = !hasValue;
                hasValue = true;
                if (!first || hasSeed) {
                    try {
                        acc = fn(acc, value);
                    }
                    catch (e) {
                        return observer.error(e);
                    }
                }
                else {
                    acc = value;
                }
            },
            error(e) { observer.error(e); },
            complete() {
                if (!hasValue && !hasSeed) {
                    return observer.error(new TypeError("Cannot reduce an empty sequence"));
                }
                observer.next(acc);
                observer.complete();
            },
        }));
    }
    concat(...sources) {
        const C = getSpecies(this);
        return new C(observer => {
            let subscription;
            let index = 0;
            function startNext(next) {
                subscription = next.subscribe({
                    next(v) { observer.next(v); },
                    error(e) { observer.error(e); },
                    complete() {
                        if (index === sources.length) {
                            subscription = undefined;
                            observer.complete();
                        }
                        else {
                            startNext(C.from(sources[index++]));
                        }
                    },
                });
            }
            startNext(this);
            return () => {
                if (subscription) {
                    subscription.unsubscribe();
                    subscription = undefined;
                }
            };
        });
    }
    flatMap(fn) {
        if (typeof fn !== "function") {
            throw new TypeError(fn + " is not a function");
        }
        const C = getSpecies(this);
        return new C(observer => {
            const subscriptions = [];
            const outer = this.subscribe({
                next(value) {
                    let normalizedValue;
                    if (fn) {
                        try {
                            normalizedValue = fn(value);
                        }
                        catch (e) {
                            return observer.error(e);
                        }
                    }
                    else {
                        normalizedValue = value;
                    }
                    const inner = C.from(normalizedValue).subscribe({
                        next(innerValue) { observer.next(innerValue); },
                        error(e) { observer.error(e); },
                        complete() {
                            const i = subscriptions.indexOf(inner);
                            if (i >= 0)
                                subscriptions.splice(i, 1);
                            completeIfDone();
                        },
                    });
                    subscriptions.push(inner);
                },
                error(e) { observer.error(e); },
                complete() { completeIfDone(); },
            });
            function completeIfDone() {
                if (outer.closed && subscriptions.length === 0) {
                    observer.complete();
                }
            }
            return () => {
                subscriptions.forEach(s => s.unsubscribe());
                outer.unsubscribe();
            };
        });
    }
    [(SymbolObservable)]() { return this; }
    static from(x) {
        const C = (typeof this === "function" ? this : Observable);
        if (x == null) {
            throw new TypeError(x + " is not an object");
        }
        const observableMethod = getMethod(x, SymbolObservable);
        if (observableMethod) {
            const observable = observableMethod.call(x);
            if (Object(observable) !== observable) {
                throw new TypeError(observable + " is not an object");
            }
            if (isObservable(observable) && observable.constructor === C) {
                return observable;
            }
            return new C(observer => observable.subscribe(observer));
        }
        if (hasSymbol("iterator")) {
            const iteratorMethod = getMethod(x, SymbolIterator);
            if (iteratorMethod) {
                return new C(observer => {
                    enqueue(() => {
                        if (observer.closed)
                            return;
                        for (const item of iteratorMethod.call(x)) {
                            observer.next(item);
                            if (observer.closed)
                                return;
                        }
                        observer.complete();
                    });
                });
            }
        }
        if (Array.isArray(x)) {
            return new C(observer => {
                enqueue(() => {
                    if (observer.closed)
                        return;
                    for (const item of x) {
                        observer.next(item);
                        if (observer.closed)
                            return;
                    }
                    observer.complete();
                });
            });
        }
        throw new TypeError(x + " is not observable");
    }
    static of(...items) {
        const C = (typeof this === "function" ? this : Observable);
        return new C(observer => {
            enqueue(() => {
                if (observer.closed)
                    return;
                for (const item of items) {
                    observer.next(item);
                    if (observer.closed)
                        return;
                }
                observer.complete();
            });
        });
    }
    static get [SymbolSpecies]() { return this; }
}
if (hasSymbols()) {
    Object.defineProperty(Observable, Symbol("extensions"), {
        value: {
            symbol: SymbolObservable,
            hostReportError,
        },
        configurable: true,
    });
}

/**
 * Unsubscribe from a subscription returned by something that looks like an observable,
 * but is not necessarily our observable implementation.
 */
function unsubscribe(subscription) {
    if (typeof subscription === "function") {
        subscription();
    }
    else if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
    }
}

var AsyncSerialScheduler = /** @class */ (function () {
    function AsyncSerialScheduler(observer) {
        this._baseObserver = observer;
        this._pendingPromises = new Set();
    }
    AsyncSerialScheduler.prototype.complete = function () {
        var _this = this;
        Promise.all(this._pendingPromises)
            .then(function () { return _this._baseObserver.complete(); })
            .catch(function (error) { return _this._baseObserver.error(error); });
    };
    AsyncSerialScheduler.prototype.error = function (error) {
        this._baseObserver.error(error);
    };
    AsyncSerialScheduler.prototype.schedule = function (task) {
        var _this = this;
        var prevPromisesCompletion = Promise.all(this._pendingPromises);
        var values = [];
        var next = function (value) { return values.push(value); };
        var promise = Promise.resolve()
            .then(function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, values_1, value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, prevPromisesCompletion];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, task(next)];
                    case 2:
                        _a.sent();
                        this._pendingPromises.delete(promise);
                        for (_i = 0, values_1 = values; _i < values_1.length; _i++) {
                            value = values_1[_i];
                            this._baseObserver.next(value);
                        }
                        return [2 /*return*/];
                }
            });
        }); })
            .catch(function (error) {
            _this._pendingPromises.delete(promise);
            _this._baseObserver.error(error);
        });
        this._pendingPromises.add(promise);
    };
    return AsyncSerialScheduler;
}());
var mapScheduler = function (observable, observer, fn) {
    var scheduler = new AsyncSerialScheduler(observer);
    var subscription = observable.subscribe({
        complete: function () {
            scheduler.complete();
        },
        error: function (error) {
            scheduler.error(error);
        },
        next: function (input) {
            var _this = this;
            scheduler.schedule(function (next) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, fn(input, next, scheduler.error)];
            }); }); });
        },
    });
    return function () { return unsubscribe(subscription); };
};

var createOperator = function (operator) {
    return function (observable) {
        return new Observable(function (observer) {
            return mapScheduler(observable, observer, operator.next);
        });
    };
};

var types = {
    'use-observable': [false, 'debug'],
    'debounced-observable': [false, 'debug'],
};
var defaultLogger = function (type) { return function (logInput) {
    return typeof logInput === 'string' ? createLogger(type)(logInput) : logInput;
}; };
var createLogger = function (type) {
    return function (prefix) {
        var _a;
        if (prefix === void 0) { prefix = ''; }
        var logType = (_a = types[type]) !== null && _a !== void 0 ? _a : [true, 'log'];
        var logFn = logType[0] ? console[logType[1]] : function () { };
        return function (message) {
            var optionalParams = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                optionalParams[_i - 1] = arguments[_i];
            }
            return logFn.apply(void 0, __spreadArray([prefix + " " + message], optionalParams));
        };
    };
};

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * ### v2.0.0 breaking changes:
 *
 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
 *
 * @param {*} value - the value to check
 * @returns {boolean} true if the given value is a date
 * @throws {TypeError} 1 arguments required
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */

function isDate$1(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || typeof value === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

var validateOrThrow = function (validator, message) {
    return function (val, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.stop, stop = _c === void 0 ? false : _c;
        var result = validator(val);
        if (stop && !result)
            throw new Error(message + " instead of " + typeof val);
        return result;
    };
};
var isNumber = validateOrThrow(function (val) { return typeof val === 'number'; }, "val should be a number");
var isString = validateOrThrow(function (val) { return typeof val === 'string'; }, "val should be a string");
var isUnkown = validateOrThrow(function (val) { return true; }, "val should be unknown");
var isNull = validateOrThrow(function (val) { return val === null; }, "val should be null");
var isObject = validateOrThrow(function (val) { return typeof val === 'object' && val !== null; }, 'val should be an object');
var isError = validateOrThrow(function (val) { return val instanceof Error; }, 'val should be an error');
var isDate = validateOrThrow(function (val) { return isDate$1(val); }, 'val should be a date object');
var _hasKey = function (key, validator, obj, opts) { return obj.hasOwnProperty(key) && validator(obj[key], opts); };
var _hasKeyStopped = function (key, validator, obj, opts) {
    try {
        var result = _hasKey(key, validator, obj, opts);
        if (!result)
            throw new Error("expected to have property " + key);
        return result;
    }
    catch (e) {
        throw new Error(key + " - " + e.message);
    }
};
var hasKey = function (key, validator) {
    return function (obj, opts) {
        if (opts === void 0) { opts = {}; }
        return opts.stop
            ? _hasKeyStopped(key, validator, obj, opts)
            : _hasKey(key, validator, obj, opts);
    };
};
var isArray = function (validator) {
    return function (val, opts) {
        if (opts === void 0) { opts = {}; }
        return Array.isArray(val) &&
            val.reduce(function (memo, val) { return memo && validator(val, opts); }, true);
    };
};
var and = function (valA, valB) {
    return function (val, opts) {
        if (opts === void 0) { opts = {}; }
        return valA(val, opts) && valB(val, opts);
    };
};
var _or = function (valA, valB, val, opts) { return valA(val, opts) || valB(val, opts); };
var _orStopped = function (valA, valB, val, opts) {
    var errorA;
    var errorB;
    var resA = false;
    var resB = false;
    try {
        resA = valA(val, opts);
    }
    catch (e) {
        errorA = e;
    }
    try {
        resB = valB(val, opts);
    }
    catch (e) {
        errorB = e;
    }
    var res = resA || resB;
    if (!res) {
        throw new Error(errorA + " || " + errorB);
    }
    return res;
};
var or = function (valA, valB) {
    return function (val, opts) {
        if (opts === void 0) { opts = {}; }
        return opts.stop ? _orStopped(valA, valB, val, opts) : _or(valA, valB, val, opts);
    };
};
function all() {
    var validators = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        validators[_i] = arguments[_i];
    }
    return function (val, opts) {
        if (opts === void 0) { opts = {}; }
        return validators.reduce(function (memo, validator) { return memo && validator(val, opts); }, true);
    };
}
var isNumberOrNull = or(isNumber, isNull);
var isStringOrNull = or(isString, isNull);
var ttt = all(hasKey('s', isString), hasKey('S', isNumber), hasKey('x', isNumber));
var val = null;
if (ttt(val))
    val.s;

exports.AsyncSerialScheduler = AsyncSerialScheduler;
exports.all = all;
exports.and = and;
exports.collect = collect;
exports.createLogger = createLogger;
exports.createOperator = createOperator;
exports.defaultLogger = defaultLogger;
exports.hasKey = hasKey;
exports.isArray = isArray;
exports.isDate = isDate;
exports.isError = isError;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isNumberOrNull = isNumberOrNull;
exports.isObject = isObject;
exports.isString = isString;
exports.isStringOrNull = isStringOrNull;
exports.isUnkown = isUnkown;
exports.mapScheduler = mapScheduler;
exports.or = or;
exports.removeElement = removeElement;
exports.removeElementInPlace = removeElementInPlace;
exports.types = types;
exports.validateOrThrow = validateOrThrow;
//# sourceMappingURL=index.js.map
