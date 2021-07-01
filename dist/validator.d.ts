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
export declare function all<A>(a: Validator<A>): Validator<A>;
export declare function all<A, B>(a: Validator<A>, b: Validator<B>): Validator<A & B>;
export declare const isNumberOrNull: Validator<number | null>;
export declare const isStringOrNull: Validator<string | null>;
//# sourceMappingURL=validator.d.ts.map