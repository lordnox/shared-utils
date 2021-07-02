import { Cache } from '../operators/cache';
import { LogFn } from '../operators/log';
export declare const limitCalls: <Args extends any[], Result>(fn: (...args: Args) => Promise<Result>, { cache, log: logInput, hashFn, }?: {
    cache?: Cache<Result> | undefined;
    log?: string | LogFn | undefined;
    hashFn?: ((args: Args) => string) | undefined;
}) => (...args: Args) => Promise<Result>;
//# sourceMappingURL=limit-calls.d.ts.map