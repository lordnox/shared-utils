import { removeElementInPlace } from '../array/remove-element'

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
  }

  set(data: Type) {
    this.data = data
  }

  done(data?: Partial<Type>) {
    if (data) this.update(data)
    this.status = TaskStatus.finished
    this.#tracker.check(this)
  }
}

export class ActivityTracker<Type> implements Tracker<Type> {
  #activeTasks: Task<Type>[] = []
  #finishedTasks: Task<Type>[] = []
  #cleanup: (tasks: Task<Type>[]) => Task<Type>[]

  constructor({
    cleanup = (tasks) => tasks,
  }: {
    cleanup?: (tasks: Task<Type>[]) => Task<Type>[]
  } = {}) {
    this.#cleanup = cleanup
  }

  add(data: Type) {
    const task = new Task<Type>(data, this)
    this.#activeTasks.push(task)
    return task
  }

  check(task: Task<Type>) {
    if (task.status === TaskStatus.finished) {
      if (this.#finishedTasks.find((t) => task === t)) return
      removeElementInPlace(this.#activeTasks, task)
      this.#finishedTasks.push(task)
      this.#finishedTasks = this.#cleanup(this.#finishedTasks)
    }
  }

  getActiveTasks() {
    return this.#activeTasks
  }

  getFinishedTasks() {
    return this.#finishedTasks
  }
}

export default ActivityTracker
