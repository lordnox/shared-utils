import { Observable, SubscriptionObserver, unsubscribe } from 'observable-fns'
import ActivityTracker from '../operators/activity-tracker'
import { Task } from '../operators/task'

export interface ObservableTracker<Type> {
  observer: SubscriptionObserver<Type>
  updatedAt: Date
  data?: Type | Error
  finished: boolean
}

export const withObserver =
  <Type>(fn: (observer: SubscriptionObserver<Type>) => void) =>
  (
    nextOrObserver: SubscriptionObserver<Type> | ((value: Type) => void),
    onError?: (error: any) => void,
    onComplete?: () => void
  ) =>
    fn(
      typeof nextOrObserver !== 'object' || nextOrObserver === null
        ? ({
            next: nextOrObserver,
            error: onError,
            complete: onComplete,
          } as SubscriptionObserver<Type>)
        : nextOrObserver
    )

export const trackObservable = <Type>(
  observable: Observable<Type>,
  activityTrackerOptions: {
    cleanup?: (
      tasks: Task<ObservableTracker<Type>>[]
    ) => Task<ObservableTracker<Type>>[]
  } = {}
) => {
  const tracker = new ActivityTracker<ObservableTracker<Type>>(
    activityTrackerOptions
  )
  const trackedObservable = new Observable<Type>(
    withObserver((observer) => {
      const task = tracker.add({
        observer,
        finished: false,
        updatedAt: new Date(),
      })
      const subscription = observable.subscribe({
        next: (data) => {
          task.update({ data, updatedAt: new Date() })
          observer.next?.(data)
        },
        error: (error) => {
          console.log('error!', error)
          task.update({ data: error, updatedAt: new Date() })
          observer.error?.(error)
        },
        complete: () => {
          task.update({ finished: true, updatedAt: new Date() })
          observer.complete?.()
        },
      })

      return () => {
        unsubscribe(subscription)
        task.done()
      }
    })
  )
  return {
    observable: trackedObservable,
    tracker,
  }
}
