import { Observable } from 'observable-fns';
import { Task, TaskActions } from './task';
export interface Tracker<Type> {
    observable: Observable<TrackerActions<Type>>;
}
export declare type TrackerActions<Type> = {
    action: TaskActions;
    task: Task<Type>;
};
//# sourceMappingURL=tracker.d.ts.map