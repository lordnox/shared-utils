export type LogInput = LogFn | string
export type LogType = 'log' | 'info' | 'debug' | 'warn' | 'error'
export type LogFn = (message?: any, ...optionalParams: any[]) => void
export const logTypes: Record<string, [active: boolean, type: LogType]> = {
  'use-observable': [false, 'debug'],
  'debounced-observable': [false, 'debug'],
  queue: [false, 'debug'],
  'limit-calls': [false, 'debug'],
  'filter-calls': [false, 'debug'],
}

export interface LoggerOptions {
  now: () => number
}

export type Logger = Pick<Console, LogType>
export let logger: Logger = console

export const setLogger = (newLogger: Logger) => {
  logger = newLogger
}

export const setLogType = (
  type: string,
  active = logTypes[type]?.[0] ?? false,
  level = logTypes[type]?.[1] ?? 'log'
) => (logTypes[type] = [active, level])

export const getLogType = (type: string) => logTypes[type]

export const defaultLogger =
  (type: string, loggerOptions?: Partial<LoggerOptions>) =>
  (logInput: LogInput) =>
    typeof logInput === 'string'
      ? createLogger(type, loggerOptions)(logInput)
      : logInput

const prefixed = (val: string | number, prefix: string, len: number) =>
  (prefix + val).slice(-len)

const prefix2 = (val: string | number) => prefixed(val, '00', 2)
const calcDelta = (last: number, now: number) =>
  now - last > 0 ? ` +${now - last}ms` : ''

const getTimestamp = (now: number, last?: number) => {
  const date = new Date(now)
  const delta = last ? calcDelta(last, now) : ''
  const timestamp = `[${prefix2(date.getHours())}:${prefix2(
    date.getMinutes()
  )}:${prefix2(date.getSeconds())}${delta}]`
  return timestamp
}

export const createLogger = (
  type: string,
  { now: getNow = Date.now }: Partial<LoggerOptions> = {}
) => {
  let last: number
  return (prefix = ''): LogFn => {
    return (message, ...optionalParams) => {
      const logType = logTypes[type] ?? [true, 'log']
      const logFn = logType[0] ? logger[logType[1]] : undefined
      if (!logFn) return
      const now = getNow()
      const timestap = getTimestamp(now, last)
      last = now
      return logFn(`${timestap} ${prefix} ${message}`, ...optionalParams)
    }
  }
}

export default createLogger
