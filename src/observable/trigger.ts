import { Observable, SubscriptionObserver } from 'observable-fns'
import { removeElementInPlace } from '../array/remove-element'

export const createObservableTrigger = <Type>() => {
  const listeners: SubscriptionObserver<Type>[] = []
  const observable = new Observable<Type>((observer) => {
    listeners.push(observer)

    return () => removeElementInPlace(listeners, observer)
  })

  const trigger = (data: Type) =>
    listeners.forEach((listener) => listener.next(data))

  return { observable, trigger }
}
