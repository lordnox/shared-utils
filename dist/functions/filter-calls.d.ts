import { Cache } from '../operators/cache';
import { LogFn } from '../operators/log';
export declare const filterCalls: <Args extends any[], Result>(fn: (...args: Args) => Result, { cache, log: logInput, filter, hashFn, map, }?: {
    map?: ((args: Args) => Args) | undefined;
    filter?: ((args: Args) => boolean) | undefined;
    cache?: Cache<Args> | undefined;
    log?: string | LogFn | undefined;
    hashFn?: ((args: Args) => string) | undefined;
}) => (...args: Args) => Result | undefined;
//# sourceMappingURL=filter-calls.d.ts.map