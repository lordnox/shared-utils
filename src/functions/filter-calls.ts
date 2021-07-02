import { Cache } from '../operators/cache'
import { defaultLogger, LogFn } from '../operators/log'

export const filterCalls =
  <Args extends any[], Result>(
    fn: (...args: Args) => Result,
    {
      cache = new Cache<Args>(),
      log: logInput = '☕️ ',
      filter = () => false,
      hashFn = JSON.stringify,
      map = (args) => args,
    }: {
      map?: (args: Args) => Args
      filter?: (args: Args) => boolean
      cache?: Cache<Args>
      log?: LogFn | string
      hashFn?: (args: Args) => string
    } = {}
  ) =>
  (...args: Args): Result | undefined => {
    const log = defaultLogger('filter-fetcher')(logInput)
    const mappedArgs = map(args)
    // TODO this is problematic for equality reason
    if (filter(mappedArgs)) {
      log(`filtered ${location}`)
      return undefined
    }
    return fn(...mappedArgs)
  }
