export declare type LogInput = LogFn | string;
export declare type LogType = 'log' | 'info' | 'debug' | 'warn' | 'error';
export declare type LogFn = (message?: any, ...optionalParams: any[]) => void;
export declare const logTypes: Record<string, [active: boolean, type: LogType]>;
export interface LoggerOptions {
    now: () => number;
}
export declare type Logger = Pick<Console, LogType>;
export declare let logger: Logger;
export declare const setLogger: (newLogger: Logger) => void;
export declare const setLogType: (type: string, active?: boolean, level?: LogType) => [boolean, LogType];
export declare const getLogType: (type: string) => [active: boolean, type: LogType];
export declare const defaultLogger: (type: string, loggerOptions?: Partial<LoggerOptions> | undefined) => (logInput: LogInput) => LogFn;
export declare const createLogger: (type: string, { now: getNow }?: Partial<LoggerOptions>) => (prefix?: string) => LogFn;
export default createLogger;
//# sourceMappingURL=log.d.ts.map