import { AnyFunction } from './type';
import { Cache } from '../operators/cache';
import { LogFn } from '../operators/log';
export declare const filterCalls: (fn: AnyFunction, { cache, log: logInput, filter, hashFn, map, }?: {
    map?: ((args: any[]) => any[]) | undefined;
    filter?: ((args: any[]) => boolean) | undefined;
    cache?: Cache<any[]> | undefined;
    log?: string | LogFn | undefined;
    hashFn?: ((args: any[]) => string) | undefined;
}) => AnyFunction;
//# sourceMappingURL=filter-calls.d.ts.map