interface CollectOptions {
    order?: 'unshift' | 'push';
    overflow?: number;
}
/**
 * Collects arguments and calls a function with them until an overflow is reached.
 *
 * ```
 * const print = collect(console.log, { overflow: 3 })
 * print(1) // ['1']
 * print(2) // ['1', '2']
 * print(3) // ['1', '2', '3']
 * print(4) // ['2', '3', '4']
 * ```
 **/
export declare const collect: <T>(fn: (args: T[]) => void, { order, overflow }?: CollectOptions) => (arg: T) => void;
export {};
//# sourceMappingURL=collect.d.ts.map