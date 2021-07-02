import { AsyncFunction } from './type'
import { Cache } from '../operators/cache'
import { defaultLogger, LogFn } from '../operators/log'

export const limitCalls = (
  fn: AsyncFunction,
  {
    cache = new Cache<Parameters<typeof fn>>(),
    log: logInput = '❓ ',
    hashFn = JSON.stringify,
  }: {
    cache?: Cache<Parameters<typeof fn>>
    log?: LogFn | string
    hashFn?: (args: Parameters<typeof fn>) => string
  } = {}
): typeof fn => {
  const log = defaultLogger('limit-calls')(logInput)
  log(`Created limit-calls`)
  return async (...args: any[]) => {
    const hash = hashFn(args)
    const cached = cache.get(hash)
    if (cached) {
      log(`Using cached result`)
      return cached
    }
    log(`Updating cache`)
    const newData = await fn(...args)
    cache.put(hash, newData)
    return newData
  }
}
