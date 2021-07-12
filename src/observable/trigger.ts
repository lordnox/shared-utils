import { Observable, SubscriptionObserver } from 'observable-fns'
import { removeElementInPlace } from '../array/remove-element'

export const createObservableTrigger = <Type>() => {
  let complete = false
  const listeners: SubscriptionObserver<Type>[] = []
  const observable = new Observable<Type>((observer) => {
    listeners.push(observer)

    return () => removeElementInPlace(listeners, observer)
  })

  const trigger = (data?: Type | Error) => {
    if (complete) return
    if (data === undefined) {
      complete = true
      listeners.forEach((listener) => listener.complete())
      return
    }
    return data instanceof Error
      ? listeners.forEach((listener) => listener.error(data))
      : listeners.forEach((listener) => listener.next(data))
  }
  return { observable, trigger }
}
