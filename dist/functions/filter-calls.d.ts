import { LogFn } from '../operators/log';
interface FilterCallsOptions<Arg> {
    map?: (arg: Arg) => Arg;
    filter?: (arg: Arg) => boolean;
    log?: LogFn | string;
}
export declare function filterCalls<Fn extends (arg: any, ...args: any[]) => any>(fn: Fn, options?: FilterCallsOptions<Parameters<typeof fn>[0]>): typeof fn;
export {};
//# sourceMappingURL=filter-calls.d.ts.map