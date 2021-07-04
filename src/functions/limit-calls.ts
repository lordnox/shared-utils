import { Cache } from '../operators/cache'
import { defaultLogger, LogFn } from '../operators/log'

export const limitCalls = <Args extends any[], Result>(
  fn: (...args: Args) => Promise<Result>,
  {
    cache = new Cache<Result>(),
    log: logInput = '❓ ',
    hashFn = JSON.stringify,
  }: {
    cache?: Cache<Result>
    log?: LogFn | string
    hashFn?: (args: Args) => string
  } = {}
) => {
  const log = defaultLogger('limit-calls')(logInput)
  log(`Created limit-calls`)
  return async (...args: Args) => {
    const hash = hashFn(args)
    const cached = cache.get(hash)
    if (cached) {
      log(`Using cached result: ` + hash)
      return cached
    }
    log(`Updating cache: ` + hash)
    const newData = await fn(...args)
    cache.put(hash, newData)
    return newData
  }
}
