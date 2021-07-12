import { Observable } from 'observable-fns'
import { isUnkown } from '../operators/validator'
import { trackObservable } from './track-observable'
import { createObservableTrigger } from './trigger'

describe('::trackObservable', () => {
  let baseObservable: Observable<unknown>
  let trigger: (data?: unknown) => void

  beforeEach(() => {
    const triggerd = createObservableTrigger<unknown>()
    baseObservable = triggerd.observable
    trigger = triggerd.trigger
  })
  it('should work like a normal observable', (done) => {
    const { observable } = trackObservable(baseObservable)
    expect(observable instanceof Observable).toBeTruthy()
    const subscription = observable.subscribe((data) => {
      expect(data).toBe(5)
      subscription.unsubscribe()
      done()
    })
    trigger(5)
  })
  it('should keep track of all subscribers', () => {
    const { observable, tracker } = trackObservable(baseObservable)
    expect(tracker.activeTasks).toHaveLength(0)
    const subscriptionA = observable.subscribe(() => null)
    expect(tracker.activeTasks).toHaveLength(1)
    const subscriptionB = observable.subscribe(() => null)
    expect(tracker.activeTasks).toHaveLength(2)
    const subscriptionC = observable.subscribe(() => null)
    expect(tracker.activeTasks).toHaveLength(3)
    subscriptionC.unsubscribe()
    expect(tracker.activeTasks).toHaveLength(2)
    subscriptionA.unsubscribe()
    expect(tracker.activeTasks).toHaveLength(1)
    subscriptionB.unsubscribe()
    expect(tracker.activeTasks).toHaveLength(0)
  })

  it('should keep track of the data and errors running through the observer', (done) => {
    const { observable, tracker } = trackObservable(baseObservable)
    const subscription = observable.subscribe(() => null)
    expect(tracker.activeTasks).toHaveLength(1)
    expect(tracker.activeTasks[0].data.data).toBeUndefined()
    trigger(1)
    expect(tracker.activeTasks[0].data.data).toEqual(1)
    trigger(2)
    expect(tracker.activeTasks[0].data.data).toEqual(2)
    expect(tracker.activeTasks[0].data.finished).toBeFalsy()
    trigger()
    expect(tracker.finishedTasks[0].data.finished).toBeTruthy()
    subscription.unsubscribe()
    done()
  })
})
