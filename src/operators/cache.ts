import { defaultLogger, LogFn, LogInput } from './log'

export const DEFAULT_CACHE_TTL = 15 * 60 * 1000

export interface CacheEntry<Type> {
  created: number
  data: Type
}
export interface CacheStore<Type> {
  put: (key: string, data: Type) => void
  get: (key: string) => CacheEntry<Type> | undefined
  del: (key: string) => void
  keys: () => string[]
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
    del: (key) => delete cache[key],
    keys: () => Object.keys(cache),
  }
  return store
}

export class Cache<Type> {
  #store: CacheStore<Type>
  #ttl: number | undefined
  #now: () => number
  #log: LogFn

  constructor({
    store = createMemoryCacheStore<Type>(),
    ttl,
    now = Date.now,
    log: logInput = '🔖 ',
  }: {
    store?: CacheStore<Type>
    ttl?: number
    now?: () => number
    log?: LogInput
  } = {}) {
    this.#store = store
    this.#ttl = ttl
    this.#now = now
    this.#log = defaultLogger('cache')(logInput)
  }

  get keys() {
    return this.#store.keys()
  }

  get(key: string) {
    const cacheEntry = this.#store.get(key)
    if (!cacheEntry) {
      this.#log(`Could not find ${key}`)
      return
    }
    if (
      this.#ttl !== undefined &&
      cacheEntry.created + this.#ttl > this.#now()
    ) {
      this.#log(`Expired ${key}`)
      this.#store.del(key)
      return
    }
    return cacheEntry.data
  }

  put(key: string, data: Type) {
    this.#log(`Putting ${key}`)
    this.#store.put(key, data)
  }
}

export default Cache
