export type LogInput = LogFn | string
export type LogType = 'log' | 'info' | 'debug' | 'warn' | 'error'
export type LogFn = (message?: any, ...optionalParams: any[]) => void
export const types: Record<string, [active: boolean, type: LogType]> = {
  'use-observable': [false, 'debug'],
  'debounced-observable': [false, 'debug'],
}

export const defaultLogger = (type: string) => (logInput: LogInput) =>
  typeof logInput === 'string' ? createLogger(type)(logInput) : logInput

export const createLogger =
  (type: string) =>
  (prefix = ''): LogFn => {
    const logType = types[type] ?? [true, 'log']
    const logFn = logType[0] ? console[logType[1]] : () => {}
    return (message, ...optionalParams) =>
      logFn(`${prefix} ${message}`, ...optionalParams)
  }

export default createLogger
