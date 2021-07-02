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

  constructor(store: CacheStore<Type> = createMemoryCacheStore<Type>()) {
    this.#store = store
  }

  get(key: string) {
    return this.#store.get(key)
  }

  put(key: string, data: Type) {
    this.#store.put(key, data)
  }
}

export default Cache
