import { Observable, SubscriptionObserver } from 'observable-fns';
import ActivityTracker from '../operators/activity-tracker';
import { Task } from '../operators/task';
export interface ObservableTracker<Type> {
    observer: SubscriptionObserver<Type>;
    updatedAt: Date;
    data?: Type | Error;
    finished: boolean;
}
export declare const withObserver: <Type>(fn: (observer: SubscriptionObserver<Type>) => void) => (nextOrObserver: SubscriptionObserver<Type> | ((value: Type) => void), onError?: ((error: any) => void) | undefined, onComplete?: (() => void) | undefined) => void;
export declare const trackObservable: <Type>(observable: Observable<Type>, activityTrackerOptions?: {
    cleanup?: ((tasks: Task<ObservableTracker<Type>>[]) => Task<ObservableTracker<Type>>[]) | undefined;
}) => {
    observable: Observable<Type>;
    tracker: ActivityTracker<ObservableTracker<Type>>;
};
//# sourceMappingURL=track-observable.d.ts.map