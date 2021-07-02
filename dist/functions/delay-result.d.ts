import { UnpackPromise } from '../promise/unpack-type';
export declare const delayResult: <Fn extends (...args: any[]) => any>(fn: Fn, period?: number) => (...args: Parameters<Fn>) => Promise<UnpackPromise<ReturnType<Fn>>>;
//# sourceMappingURL=delay-result.d.ts.map