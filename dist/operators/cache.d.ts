export interface CacheEntry<Type> {
    created: number;
    data: Type;
}
export interface CacheStore<Type> {
    put: (key: string, data: Type) => void;
    get: (key: string) => CacheEntry<Type> | undefined;
}
export declare const createMemoryCacheStore: <Type>(now?: () => number) => CacheStore<Type>;
export declare class Cache<Type> {
    #private;
    constructor(store?: CacheStore<Type>);
    get(key: string): CacheEntry<Type> | undefined;
    put(key: string, data: Type): void;
}
export default Cache;
//# sourceMappingURL=cache.d.ts.map