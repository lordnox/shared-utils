import { Observable } from 'observable-fns';
import { Task } from './task';
import { Tracker, TrackerActions } from './tracker';
export declare class ActivityTracker<Type> implements Tracker<Type> {
    #private;
    constructor({ cleanup, }?: {
        cleanup?: (tasks: Task<Type>[]) => Task<Type>[];
    });
    get observable(): Observable<TrackerActions<Type>>;
    add(data: Type): Task<Type>;
    get activeTasks(): Task<Type>[];
    get finishedTasks(): Task<Type>[];
    get tasks(): Task<Type>[];
}
export default ActivityTracker;
//# sourceMappingURL=activity-tracker.d.ts.map