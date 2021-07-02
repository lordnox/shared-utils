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
const collect = (fn, { order = 'unshift', overflow = 100 } = {}) => {
    let args = [];
    const addArgUnshift = (arg) => {
        args.unshift(arg);
        args = args.slice(0, overflow);
    };
    const addArgPush = (arg) => {
        args.push(arg);
        args = args.slice(Math.max(0, args.length - overflow));
    };
    const addArg = order === 'unshift' ? addArgUnshift : addArgPush;
    return (arg) => {
        addArg(arg);
        fn(args);
    };
};

const removeElement = (arr, item, compare = (element, item) => element === item) => {
    const index = arr.findIndex((element) => compare(element, item));
    if (index === -1)
        return arr;
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
};
const removeElementInPlace = (arr, item, compare = (element, item) => element === item) => {
    const index = arr.findIndex((element) => compare(element, item));
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

class AsyncSerialScheduler {
    _baseObserver;
    _pendingPromises;
    constructor(observer) {
        this._baseObserver = observer;
        this._pendingPromises = new Set();
    }
    complete() {
        Promise.all(this._pendingPromises)
            .then(() => this._baseObserver.complete())
            .catch((error) => this._baseObserver.error(error));
    }
    error(error) {
        this._baseObserver.error(error);
    }
    schedule(task) {
        const prevPromisesCompletion = Promise.all(this._pendingPromises);
        const values = [];
        const next = (value) => values.push(value);
        const promise = Promise.resolve()
            .then(async () => {
            await prevPromisesCompletion;
            await task(next);
            this._pendingPromises.delete(promise);
            for (const value of values) {
                this._baseObserver.next(value);
            }
        })
            .catch((error) => {
            this._pendingPromises.delete(promise);
            this._baseObserver.error(error);
        });
        this._pendingPromises.add(promise);
    }
}
const mapScheduler = (observable, observer, fn) => {
    const scheduler = new AsyncSerialScheduler(observer);
    const subscription = observable.subscribe({
        complete() {
            scheduler.complete();
        },
        error(error) {
            scheduler.error(error);
        },
        next(input) {
            scheduler.schedule(async (next) => fn(input, next, scheduler.error));
        },
    });
    return () => unsubscribe(subscription);
};

const createOperator = (operator) => (observable) => new Observable((observer) => mapScheduler(observable, observer, operator.next));

const delay = async (period, { timeout = setTimeout } = {}) => {
    let timeoutId;
    const promise = new Promise((resolve) => {
        timeoutId = timeout(resolve, period);
    });
    promise.finally(() => {
        clearTimeout(timeoutId);
    });
    return promise;
};

const delayResult = (fn, period = 0) => async (...args) => {
    const start = Date.now();
    const result = await fn(...args);
    const waitFor = period - (Date.now() - start);
    if (waitFor > 0)
        await delay(waitFor);
    return result;
};

/** Creates a Promise with the `reject` and `resolve` functions
 * placed as methods on the promise object itself. It allows you to do:
 *
 *     const p = deferred<number>();
 *     // ...
 *     p.resolve(42);
 */
function deferred() {
    let methods;
    const promise = new Promise((resolve, reject) => {
        methods = { resolve, reject };
    });
    return Object.assign(promise, methods);
}

const createMemoryCacheStore = (now = Date.now) => {
    const cache = {};
    const store = {
        put: (key, data) => (cache[key] = {
            created: now(),
            data,
        }),
        get: (key) => cache[key],
    };
    return store;
};
class Cache {
    #store;
    constructor(store = createMemoryCacheStore()) {
        this.#store = store;
    }
    get(key) {
        return this.#store.get(key);
    }
    put(key, data) {
        this.#store.put(key, data);
    }
}

const types = {
    'use-observable': [false, 'debug'],
    'debounced-observable': [false, 'debug'],
};
const defaultLogger = (type) => (logInput) => typeof logInput === 'string' ? createLogger(type)(logInput) : logInput;
const createLogger = (type) => (prefix = '') => {
    const logType = types[type] ?? [true, 'log'];
    const logFn = logType[0] ? console[logType[1]] : () => { };
    return (message, ...optionalParams) => logFn(`${prefix} ${message}`, ...optionalParams);
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

const validateOrThrow = (validator, message) => (val, { stop = false } = {}) => {
    const result = validator(val);
    if (stop && !result)
        throw new Error(`${message} instead of ${typeof val}`);
    return result;
};
const isNumber = validateOrThrow((val) => typeof val === 'number', `val should be a number`);
const isString = validateOrThrow((val) => typeof val === 'string', `val should be a string`);
const isUnkown = validateOrThrow((val) => true, `val should be unknown`);
const isNull = validateOrThrow((val) => val === null, `val should be null`);
const isObject = validateOrThrow((val) => typeof val === 'object' && val !== null, 'val should be an object');
const isError = validateOrThrow((val) => val instanceof Error, 'val should be an error');
const isDate = validateOrThrow((val) => isDate$1(val), 'val should be a date object');
const _hasKey = (key, validator, obj, opts) => obj.hasOwnProperty(key) && validator(obj[key], opts);
const _hasKeyStopped = (key, validator, obj, opts) => {
    try {
        const result = _hasKey(key, validator, obj, opts);
        if (!result)
            throw new Error(`expected to have property ${key}`);
        return result;
    }
    catch (e) {
        throw new Error(`${key} - ${e.message}`);
    }
};
const hasKey = (key, validator) => (obj, opts = {}) => opts.stop
    ? _hasKeyStopped(key, validator, obj, opts)
    : _hasKey(key, validator, obj, opts);
const isArray = (validator) => (val, opts = {}) => Array.isArray(val) &&
    val.reduce((memo, val) => memo && validator(val, opts), true);
const and = (valA, valB) => (val, opts = {}) => valA(val, opts) && valB(val, opts);
const _or = (valA, valB, val, opts) => valA(val, opts) || valB(val, opts);
const _orStopped = (valA, valB, val, opts) => {
    let errorA;
    let errorB;
    let resA = false;
    let resB = false;
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
    const res = resA || resB;
    if (!res) {
        throw new Error(`${errorA} || ${errorB}`);
    }
    return res;
};
const or = (valA, valB) => (val, opts = {}) => opts.stop ? _orStopped(valA, valB, val, opts) : _or(valA, valB, val, opts);
function all(...validators) {
    return (val, opts = {}) => validators.reduce((memo, validator) => memo && validator(val, opts), true);
}
const isNumberOrNull = or(isNumber, isNull);
const isStringOrNull = or(isString, isNull);

exports.AsyncSerialScheduler = AsyncSerialScheduler;
exports.Cache = Cache;
exports.all = all;
exports.and = and;
exports.collect = collect;
exports.createLogger = createLogger;
exports.createMemoryCacheStore = createMemoryCacheStore;
exports.createOperator = createOperator;
exports.defaultLogger = defaultLogger;
exports.deferred = deferred;
exports.delay = delay;
exports.delayResult = delayResult;
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
