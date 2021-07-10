export const noop = () => {}

/**
 * Status a task can be in
 *
 * void => active
 * active => finished
 **/
export enum TaskStatus {
  active,
  finished,
}

/**
 * Actions that can be done with a task
 **/
export enum TaskActions {
  update,
  created,
  finished,
}

/**
 * Type that represents a simple notification
 **/
export type TaskNotification<Task> = (action: TaskActions, task: Task) => void

export class Task<Type> {
  #notify: TaskNotification<Task<Type>>
  data: Type
  status: TaskStatus = TaskStatus.active

  constructor(data: Type, notify: TaskNotification<Task<Type>> = noop) {
    this.data = data
    this.#notify = notify
    this.#notify(TaskActions.created, this)
  }

  update(data: Partial<Type>) {
    this.data = { ...this.data, ...data }
    this.#notify(TaskActions.update, this)
  }

  set(data: Type) {
    this.data = data
    this.#notify(TaskActions.update, this)
  }

  done(data?: Partial<Type>) {
    if (data) this.update(data)
    this.status = TaskStatus.finished
    this.#notify(TaskActions.finished, this)
  }
}
