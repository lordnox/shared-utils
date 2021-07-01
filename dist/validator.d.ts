export interface ValidationOptions {
    stop?: boolean;
}
export declare type Validator<T> = (val: any, opts?: ValidationOptions) => val is T;
export declare const validateOrThrow: <T>(validator: Validator<T>, message: string) => (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is T;
export declare const isNumber: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is number;
export declare const isString: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is string;
export declare const isUnkown: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is unknown;
export declare const isNull: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is null;
export declare const isObject: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is {};
export declare const isError: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is Error;
export declare const isDate: (val: any, { stop }?: {
    stop?: boolean | undefined;
}) => val is Date;
export declare const hasKey: <Key extends string, Datatype>(key: Key, validator: Validator<Datatype>) => Validator<Record<Key, Datatype>>;
export declare const isArray: <Datatype>(validator: Validator<Datatype>) => (val: any, opts?: {}) => val is Datatype[];
export declare const and: <A, B>(valA: Validator<A>, valB: Validator<B>) => Validator<A & B>;
export declare const or: <A, B>(valA: Validator<A>, valB: Validator<B>) => Validator<A | B>;
declare type V<T> = Validator<T>;
export declare function all<A>(...args: [V<A>]): Validator<A>;
export declare function all<A, B>(...args: [V<A>, V<B>]): Validator<A & B>;
export declare function all<A, B, C>(...args: [V<A>, V<B>, V<C>]): Validator<A & B & C>;
export declare function all<A, B, C, D>(...args: [V<A>, V<B>, V<C>, V<D>]): Validator<A & B & C & D>;
export declare function all<A, B, C, D, E>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>]): Validator<A & B & C & D & E>;
export declare function all<A, B, C, D, E, F>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>]): Validator<A & B & C & D & E & F>;
export declare function all<A, B, C, D, E, F, G>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>, V<G>]): Validator<A & B & C & D & E & F & G>;
export declare function all<A, B, C, D, E, F, G, H>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>, V<G>, V<H>]): Validator<A & B & C & D & E & F & G & H>;
export declare function all<A, B, C, D, E, F, G, H, I>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>, V<G>, V<H>, V<I>]): Validator<A & B & C & D & E & F & G & H & I>;
export declare function all<A, B, C, D, E, F, G, H, I, J>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>, V<G>, V<H>, V<I>, V<J>]): Validator<A & B & C & D & E & F & G & H & I & J>;
export declare function all<A, B, C, D, E, F, G, H, I, J, K>(...args: [V<A>, V<B>, V<C>, V<D>, V<E>, V<F>, V<G>, V<H>, V<I>, V<J>, V<K>]): Validator<A & B & C & D & E & F & G & H & I & J & K>;
export declare function all<A, B, C, D, E, F, G, H, I, J, K, L>(...args: [
    V<A>,
    V<B>,
    V<C>,
    V<D>,
    V<E>,
    V<F>,
    V<G>,
    V<H>,
    V<I>,
    V<J>,
    V<K>,
    V<L>
]): Validator<A & B & C & D & E & F & G & H & I & J & K & L>;
export declare function all<R>(...args: Validator<any>[]): Validator<R>;
export declare const isNumberOrNull: Validator<number | null>;
export declare const isStringOrNull: Validator<string | null>;
export {};
//# sourceMappingURL=validator.d.ts.map