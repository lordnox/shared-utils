import { LogInput } from './log';
export declare const DEFAULT_CACHE_TTL: number;
export interface CacheEntry<Type> {
    created: number;
    data: Type;
}
export interface CacheStore<Type> {
    put: (key: string, data: Type) => void;
    get: (key: string) => CacheEntry<Type> | undefined;
    del: (key: string) => void;
    keys: () => string[];
}
export declare const createMemoryCacheStore: <Type>(now?: () => number) => CacheStore<Type>;
export declare class Cache<Type> {
    #private;
    constructor({ store, ttl, now, log: logInput, }?: {
        store?: CacheStore<Type>;
        ttl?: number;
        now?: () => number;
        log?: LogInput;
    });
    get keys(): string[];
    get(key: string): Type | undefined;
    put(key: string, data: Type): void;
}
export default Cache;
//# sourceMappingURL=cache.d.ts.map