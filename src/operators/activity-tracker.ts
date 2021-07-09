import { Observable } from 'observable-fns'
import { removeElementInPlace } from '../array/remove-element'
import { createObservableTrigger } from '../observable/trigger'

export enum TaskStatus {
  active,
  finished,
}

export interface Tracker<Type> {
  getActiveTasks: () => Task<Type>[]
  getFinishedTasks: () => Task<Type>[]
}

export class Task<Type> {
  #tracker: ActivityTracker<Type>
  data: Type
  status: TaskStatus = TaskStatus.active

  constructor(data: Type, tracker: ActivityTracker<Type>) {
    this.data = data
    this.#tracker = tracker
  }

  update(data: Partial<Type>) {
    this.data = { ...this.data, ...data }
    this.#tracker.check(this)
  }

  set(data: Type) {
    this.data = data
    this.#tracker.check(this)
  }

  done(data?: Partial<Type>) {
    if (data) this.update(data)
    this.status = TaskStatus.finished
    this.#tracker.check(this)
  }
}

export type TaskActions<Type> = {
  action: 'added' | 'finished' | 'updated'
  task: Task<Type>
}

export class ActivityTracker<Type> implements Tracker<Type> {
  #activeTasks: Task<Type>[] = []
  #finishedTasks: Task<Type>[] = []
  #cleanup: (tasks: Task<Type>[]) => Task<Type>[]
  #observable: Observable<TaskActions<Type>>
  #trigger: (data: TaskActions<Type>) => void

  constructor({
    cleanup = (tasks) => tasks,
  }: {
    cleanup?: (tasks: Task<Type>[]) => Task<Type>[]
  } = {}) {
    this.#cleanup = cleanup
    const { observable, trigger } = createObservableTrigger<TaskActions<Type>>()
    this.#observable = observable
    this.#trigger = trigger
  }

  get observer() {
    return this.#observable
  }

  add(data: Type) {
    const task = new Task<Type>(data, this)
    this.#activeTasks.push(task)
    this.#trigger({ action: 'added', task })
    return task
  }

  check(task: Task<Type>) {
    if (task.status === TaskStatus.finished) {
      if (this.#finishedTasks.find((t) => task === t)) return
      removeElementInPlace(this.#activeTasks, task)
      this.#finishedTasks.push(task)
      this.#finishedTasks = this.#cleanup(this.#finishedTasks)
      this.#trigger({ action: 'finished', task })
    } else this.#trigger({ action: 'updated', task })
  }

  getActiveTasks() {
    return this.#activeTasks
  }

  getFinishedTasks() {
    return this.#finishedTasks
  }
}

export default ActivityTracker
