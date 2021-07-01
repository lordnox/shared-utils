import { ObservableLike, Observable } from 'observable-fns';
export interface Operator<In, Out> {
    next: (input: In, next: (value: Out) => void, error: (error: Error) => void) => void;
}
export declare const createOperator: <In, Out>(operator: Operator<In, Out>) => (observable: ObservableLike<In>) => Observable<Out>;
//# sourceMappingURL=operator.d.ts.map