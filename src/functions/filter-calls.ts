import { defaultLogger, LogFn } from '../operators/log'

interface FilterCallsOptions<Arg> {
  map?: (arg: Arg) => Arg
  filter?: (arg: Arg) => boolean
  log?: LogFn | string
}

// export function filterCalls<Arg, Result>(fn: (arg: Arg) => Result, options?: FilterCallsOptions<Arg>): (arg: Arg) => Result
export function filterCalls<Fn extends (arg: any, ...args: any[]) => any>(
  fn: Fn,
  options?: FilterCallsOptions<Parameters<typeof fn>[0]>
): typeof fn
export function filterCalls(
  fn: any,
  {
    log: logInput = '☕️ ',
    filter = () => false,
    map = (arg) => arg,
  }: FilterCallsOptions<Parameters<typeof fn>[0]> = {}
) {
  return (...argsIn: any[]) => {
    const [arg, ...extraArgs] = argsIn
    const log = defaultLogger('filter-fetcher')(logInput)
    const mappedArg = map(arg)
    // TODO this is problematic for equality reason
    if (filter(mappedArg)) {
      log(`filtered ${location}`)
      return undefined
    }
    return fn(mappedArg, ...extraArgs)
  }
}
