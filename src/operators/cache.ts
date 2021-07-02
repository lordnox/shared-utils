export const DEFAULT_CACHE_TTL = 15 * 60 * 1000

export interface CacheEntry<Type> {
  created: number
  data: Type
}
export interface CacheStore<Type> {
  put: (key: string, data: Type) => void
  get: (key: string) => CacheEntry<Type> | undefined
}

export const createMemoryCacheStore = <Type>(now = Date.now) => {
  const cache: Record<string, CacheEntry<Type>> = {}
  const store: CacheStore<Type> = {
    put: (key, data) =>
      (cache[key] = {
        created: now(),
        data,
      }),
    get: (key) => cache[key],
  }
  return store
}

export class Cache<Type> {
  #store: CacheStore<Type>
  #ttl: number
  #now: () => number

  constructor({
    store = createMemoryCacheStore<Type>(),
    ttl = DEFAULT_CACHE_TTL,
    now = Date.now,
  }: {
    store?: CacheStore<Type>
    ttl?: number
    now?: () => number
  } = {}) {
    this.#store = store
    this.#ttl = ttl
    this.#now = now
  }

  get(key: string) {
    const cacheEntry = this.#store.get(key)
    if (!cacheEntry) return
    if (cacheEntry.created + this.#ttl > this.#now()) return
    return cacheEntry.data
  }

  put(key: string, data: Type) {
    this.#store.put(key, data)
  }
}

export default Cache
