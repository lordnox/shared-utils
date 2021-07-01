import { ObservableLike, Observable } from 'observable-fns'
import { mapScheduler } from '../scheduler/async-scheduler'

export interface Operator<In, Out> {
  next: (
    input: In,
    next: (value: Out) => void,
    error: (error: Error) => void
  ) => void
}

export const createOperator =
  <In, Out>(operator: Operator<In, Out>) =>
  (observable: ObservableLike<In>) =>
    new Observable<Out>((observer) =>
      mapScheduler(observable, observer, operator.next)
    )
