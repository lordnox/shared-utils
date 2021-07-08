import { delay } from '../promise/delay';
import { UnpackPromise } from '../promise/unpack-type';
export declare type PromisedResult<Fn extends (...args: any[]) => any> = Promise<UnpackPromise<ReturnType<Fn>>>;
export interface DelayedResultOptions {
    period: number;
    delay: typeof delay;
    now: () => number;
}
export declare function delayResult<Fn extends (...args: any[]) => any>(fn: Fn, period?: number): (...args: Parameters<Fn>) => PromisedResult<Fn>;
export declare function delayResult<Fn extends (...args: any[]) => any>(fn: Fn, options: Partial<DelayedResultOptions>): (...args: Parameters<Fn>) => PromisedResult<Fn>;
//# sourceMappingURL=delay-result.d.ts.map