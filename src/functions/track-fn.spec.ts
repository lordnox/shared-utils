import { Task, TaskActions } from '../operators/task'
import { trackFn, TrackFnType } from './track-fn'

describe('::trackFn', () => {
  it('should be a function', () => {
    expect(typeof trackFn).toBe('function')
  })

  it('should return a function that returns the same data as the input function', async () => {
    const fn1 = (n: number) => n * 2
    const fn2 = async (n: number) => n * 2
    const fn3 = (n: number) => 'Data is ' + n
    const [trackedFn1] = trackFn(fn1)
    const [trackedFn2] = trackFn(fn2)
    const [trackedFn3] = trackFn(fn3)
    expect(fn1(5)).toEqual(trackedFn1(5))
    expect(await fn2(5)).toEqual(await trackedFn2(5))
    expect(fn3(5)).toEqual(trackedFn3(5))
  })

  it('should track correctly for sync functions', () => {
    const [fn, tracker] = trackFn((n: number) => n * 2)
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(0)
    const result = fn(1)
    expect(result).toEqual(2)
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(1)
  })
  it('should track correctly for async functions', async () => {
    const [fn, tracker] = trackFn(async (n: number) => n * 2)
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(0)
    const result = fn(7)
    expect(tracker.activeTasks).toHaveLength(1)
    expect(tracker.finishedTasks).toHaveLength(0)
    expect(await result).toEqual(14)
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(1)
  })
  it('should be observable', async () => {
    const [fn, tracker] = trackFn(async (n: number) => n * 2)
    type Type = TrackFnType<typeof fn>
    type Handler = (action: TaskActions, task: Task<Type>) => void
    const events: Handler[] = [
      (action, task) => {
        expect(action).toEqual(TaskActions.created)
        expect(task.data.args).toEqual([99])
      },
      (action, task) => {
        expect(action).toEqual(TaskActions.update)
        expect(task.data.result).toEqual(198)
      },
      (action, task) => {
        expect(action).toEqual(TaskActions.finished)
        expect(task.data.args).toEqual([99])
        expect(task.data.result).toEqual(198)
      },
    ]
    const subscription = tracker.observable.subscribe(({ action, task }) => {
      const assert = events.shift()
      expect(assert).not.toBeUndefined()
      assert!(action, task)
    })
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(0)
    const result = fn(99)
    expect(tracker.activeTasks).toHaveLength(1)
    expect(tracker.finishedTasks).toHaveLength(0)
    expect(await result).toEqual(198)
    expect(tracker.activeTasks).toHaveLength(0)
    expect(tracker.finishedTasks).toHaveLength(1)
    subscription.unsubscribe()
    expect(events).toHaveLength(0)
  })
})
