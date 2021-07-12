import { Observable, SubscriptionObserver } from 'observable-fns';
import ActivityTracker from '../operators/activity-tracker';
export interface ObservableTracker<Type> {
    observer: SubscriptionObserver<Type>;
    updatedAt: Date;
    data?: Type | Error;
    finished: boolean;
}
export declare const withObserver: <Type>(fn: (observer: SubscriptionObserver<Type>) => void) => (nextOrObserver: SubscriptionObserver<Type> | ((value: Type) => void), onError?: ((error: any) => void) | undefined, onComplete?: (() => void) | undefined) => void;
export declare const trackObservable: <Type>(observable: Observable<Type>) => {
    observable: Observable<Type>;
    tracker: ActivityTracker<ObservableTracker<Type>>;
};
//# sourceMappingURL=track-observable.d.ts.map