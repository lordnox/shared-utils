export declare const noop: () => void;
/**
 * Status a task can be in
 *
 * void => active
 * active => finished
 **/
export declare enum TaskStatus {
    active = 0,
    finished = 1
}
/**
 * Actions that can be done with a task
 **/
export declare enum TaskActions {
    update = 0,
    created = 1,
    finished = 2
}
/**
 * Type that represents a simple notification
 **/
export declare type TaskNotification<Task> = (action: TaskActions, task: Task) => void;
export declare class Task<Type> {
    #private;
    data: Type;
    status: TaskStatus;
    constructor(data: Type, notify?: TaskNotification<Task<Type>>);
    update(data: Partial<Type>): void;
    set(data: Type): void;
    done(data?: Partial<Type>): void;
}
//# sourceMappingURL=task.d.ts.map