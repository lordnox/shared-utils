export declare type LogInput = LogFn | string;
export declare type LogType = 'log' | 'info' | 'debug' | 'warn' | 'error';
export declare type LogFn = (message?: any, ...optionalParams: any[]) => void;
export declare const types: Record<string, [active: boolean, type: LogType]>;
export declare const defaultLogger: (type: string) => (logInput: LogInput) => LogFn;
export declare const createLogger: (type: string) => (prefix?: string) => LogFn;
export default createLogger;
//# sourceMappingURL=log.d.ts.map