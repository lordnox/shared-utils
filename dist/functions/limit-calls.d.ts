import { AsyncFunction } from './type';
import { Cache } from '../operators/cache';
import { LogFn } from '../operators/log';
export declare const limitCalls: (fn: AsyncFunction, { cache, log: logInput, hashFn, }?: {
    cache?: Cache<any[]> | undefined;
    log?: string | LogFn | undefined;
    hashFn?: ((args: any[]) => string) | undefined;
}) => AsyncFunction;
//# sourceMappingURL=limit-calls.d.ts.map