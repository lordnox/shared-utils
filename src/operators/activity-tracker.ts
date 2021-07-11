import { Observable } from 'observable-fns'
import { removeElementInPlace } from '../array/remove-element'
import { createObservableTrigger } from '../observable/trigger'
import { Task, TaskActions, TaskStatus } from './task'
import { Tracker, TrackerActions } from './tracker'

export class ActivityTracker<Type> implements Tracker<Type> {
  #tasks: Task<Type>[] = []
  #activeTasks: Task<Type>[] = []
  #finishedTasks: Task<Type>[] = []
  #cleanup: (tasks: Task<Type>[]) => Task<Type>[]
  #observable: Observable<TrackerActions<Type>>
  #trigger: (data: TrackerActions<Type>) => void

  constructor({
    cleanup = (tasks) => tasks,
  }: {
    cleanup?: (tasks: Task<Type>[]) => Task<Type>[]
  } = {}) {
    this.#cleanup = cleanup
    const { observable, trigger } =
      createObservableTrigger<TrackerActions<Type>>()
    this.#observable = observable
    this.#trigger = trigger
  }

  get observable() {
    return this.#observable
  }

  add(data: Type) {
    const task = new Task<Type>(data, this.#check.bind(this))
    this.#activeTasks.push(task)
    return task
  }

  #check(action: TaskActions, task: Task<Type>) {
    if (action === TaskActions.created) this.#tasks.push(task)
    if (task.status === TaskStatus.finished) {
      if (this.#finishedTasks.find((t) => task === t)) return
      removeElementInPlace(this.#activeTasks, task)
      this.#finishedTasks.push(task)
      this.#finishedTasks = this.#cleanup(this.#finishedTasks)
    }
    this.#trigger({ action, task })
  }

  get activeTasks() {
    return this.#activeTasks
  }

  get finishedTasks() {
    return this.#finishedTasks
  }

  get tasks() {
    return this.#tasks
  }
}

export default ActivityTracker
