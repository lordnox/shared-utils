import { Observable, ObservableLike, unsubscribe } from 'observable-fns'

interface SubscriptionObserver<T> {
  next(value: T): void
  error(error: any): void
  complete(): void
}

export class AsyncSerialScheduler<T> {
  private _baseObserver: SubscriptionObserver<T>
  private _pendingPromises: Set<Promise<any>>

  constructor(observer: SubscriptionObserver<T>) {
    this._baseObserver = observer
    this._pendingPromises = new Set()
  }

  complete() {
    Promise.all(this._pendingPromises)
      .then(() => this._baseObserver.complete())
      .catch((error) => this._baseObserver.error(error))
  }

  error(error: any) {
    this._baseObserver.error(error)
  }

  schedule(task: (next: (value: T) => void) => Promise<void>) {
    const prevPromisesCompletion = Promise.all(this._pendingPromises)
    const values: T[] = []

    const next = (value: T) => values.push(value)

    const promise = Promise.resolve()
      .then(async () => {
        await prevPromisesCompletion
        await task(next)
        this._pendingPromises.delete(promise)

        for (const value of values) {
          this._baseObserver.next(value)
        }
      })
      .catch((error) => {
        this._pendingPromises.delete(promise)
        this._baseObserver.error(error)
      })

    this._pendingPromises.add(promise)
  }
}

export const mapScheduler = <In, Out>(
  observable: ObservableLike<In>,
  observer: SubscriptionObserver<Out>,
  fn: (
    input: In,
    next: (value: Out) => void,
    error: (error: Error) => void
  ) => void
) => {
  const scheduler = new AsyncSerialScheduler(observer)

  const subscription = observable.subscribe({
    complete() {
      scheduler.complete()
    },
    error(error) {
      scheduler.error(error)
    },
    next(input) {
      scheduler.schedule(async (next) => fn(input, next, scheduler.error))
    },
  })
  return () => unsubscribe(subscription)
}
