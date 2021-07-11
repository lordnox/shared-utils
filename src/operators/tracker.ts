import { Observable } from 'observable-fns'
import { Task, TaskActions } from './task'

export interface Tracker<Type> {
  observable: Observable<TrackerActions<Type>>
}

export type TrackerActions<Type> = {
  action: TaskActions
  task: Task<Type>
}
