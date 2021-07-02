import { AnyFunction } from './type'
import { Cache } from '../operators/cache'
import { defaultLogger, LogFn } from '../operators/log'

export const filterCalls =
  (
    fn: AnyFunction,
    {
      cache = new Cache<Parameters<typeof fn>>(),
      log: logInput = '☕️ ',
      filter = () => false,
      hashFn = JSON.stringify,
      map = (args) => args,
    }: {
      map?: (args: Parameters<typeof fn>) => Parameters<typeof fn>
      filter?: (args: Parameters<typeof fn>) => boolean
      cache?: Cache<Parameters<typeof fn>>
      log?: LogFn | string
      hashFn?: (args: Parameters<typeof fn>) => string
    } = {}
  ): typeof fn =>
  (...args: any[]) => {
    const log = defaultLogger('filter-fetcher')(logInput)
    const mappedArgs = map(args)
    // TODO this is problematic for equality reason
    if (filter(mappedArgs)) {
      log(`filtered ${location}`)
      return null
    }
    return fn(...mappedArgs)
  }
