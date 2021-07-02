export interface Deferred<T> extends Promise<T> {
    resolve(value?: T | PromiseLike<T>): void;
    reject(reason?: any): void;
}
/** Creates a Promise with the `reject` and `resolve` functions
 * placed as methods on the promise object itself. It allows you to do:
 *
 *     const p = deferred<number>();
 *     // ...
 *     p.resolve(42);
 */
export declare function deferred<T>(): Deferred<T>;
//# sourceMappingURL=deferred.d.ts.map