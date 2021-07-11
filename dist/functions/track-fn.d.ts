import ActivityTracker from '../operators/activity-tracker';
import { UnpackPromise } from '../promise/unpack-type';
export declare const isPromiseLike: <Type = any>(val: any) => val is PromiseLike<Type>;
export interface TrackFnType<Fn extends (...args: any[]) => any> {
    args: Parameters<Fn>;
    result?: UnpackPromise<ReturnType<Fn>>;
}
export declare const trackFn: <Fn extends (...args: any[]) => any>(fn: Fn) => [Fn, ActivityTracker<TrackFnType<Fn>>];
//# sourceMappingURL=track-fn.d.ts.map