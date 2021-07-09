import { Observable } from 'observable-fns';
export declare enum TaskStatus {
    active = 0,
    finished = 1
}
export interface Tracker<Type> {
    getActiveTasks: () => Task<Type>[];
    getFinishedTasks: () => Task<Type>[];
}
export declare class Task<Type> {
    #private;
    data: Type;
    status: TaskStatus;
    constructor(data: Type, tracker: ActivityTracker<Type>);
    update(data: Partial<Type>): void;
    set(data: Type): void;
    done(data?: Partial<Type>): void;
}
export declare type TaskActions<Type> = {
    action: 'added' | 'finished' | 'updated';
    task: Task<Type>;
};
export declare class ActivityTracker<Type> implements Tracker<Type> {
    #private;
    constructor({ cleanup, }?: {
        cleanup?: (tasks: Task<Type>[]) => Task<Type>[];
    });
    get observer(): Observable<TaskActions<Type>>;
    add(data: Type): Task<Type>;
    check(task: Task<Type>): void;
    getActiveTasks(): Task<Type>[];
    getFinishedTasks(): Task<Type>[];
}
export default ActivityTracker;
//# sourceMappingURL=activity-tracker.d.ts.map