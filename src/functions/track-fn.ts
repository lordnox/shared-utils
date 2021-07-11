import ActivityTracker from '../operators/activity-tracker'
import { UnpackPromise } from '../promise/unpack-type'

export const isPromiseLike = <Type = any>(
  val: any
): val is PromiseLike<Type> => {
  return val instanceof Promise
}

export interface TrackFnType<Fn extends (...args: any[]) => any> {
  args: Parameters<Fn>
  result?: UnpackPromise<ReturnType<Fn>>
}

export const trackFn = <Fn extends (...args: any[]) => any>(fn: Fn) => {
  const tracker = new ActivityTracker<TrackFnType<Fn>>()
  const trackedFn = (...args: Parameters<Fn>) => {
    const task = tracker.add({ args })
    const result = fn(...args)
    if (isPromiseLike(result)) {
      return result.then((result) => {
        task.done({ result })
        return result
      })
    }
    task.done({ result })
    return result
  }
  return [trackedFn, tracker] as [typeof fn, typeof tracker]
}
