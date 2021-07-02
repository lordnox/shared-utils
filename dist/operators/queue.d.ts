import { Deferred } from '../promise/deferred';
export declare type AvailabilityFn = (active: number, level: number) => boolean;
export declare class Queue<Type, Response> {
    #private;
    constructor(handle: (data: Type) => Response | PromiseLike<Response>, { level, name, availabilityFn, }?: {
        level?: number;
        name?: string;
        availabilityFn?: AvailabilityFn;
    });
    private available;
    deque(): void;
    enque(data: Type): Deferred<Response>;
    pop(): Promise<void>;
    getStatus(): number;
}
export default Queue;
//# sourceMappingURL=queue.d.ts.map