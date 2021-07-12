import { Observable } from 'observable-fns';
export declare const createObservableTrigger: <Type>() => {
    observable: Observable<Type>;
    trigger: (data?: Error | Type | undefined) => void;
};
//# sourceMappingURL=trigger.d.ts.map