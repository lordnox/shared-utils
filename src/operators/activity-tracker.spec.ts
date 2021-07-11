import ActivityTracker, { TrackerActions } from './activity-tracker'
import { Task, TaskActions, TaskStatus } from './task'

interface TestTask {
  id: number
}

describe('ActivityTracker', () => {
  it('should be able recieve a task and set it to done', () => {
    const myTask = { id: 1 }
    const activityTracker = new ActivityTracker<TestTask>()
    const task = activityTracker.add(myTask)
    expect(activityTracker.activeTasks).toHaveLength(1)
    expect(activityTracker.activeTasks[0].data).toBe(myTask)
    task.done()
    expect(activityTracker.activeTasks).toHaveLength(0)
    expect(activityTracker.finishedTasks).toHaveLength(1)
  })

  it('should cleanup old tasks', () => {
    const activityTracker = new ActivityTracker<TestTask>({
      cleanup: (tasks) => tasks.slice(tasks.length - 1, tasks.length),
    })
    activityTracker.add({ id: 1 }).done()
    activityTracker.add({ id: 2 }).done()
    activityTracker.add({ id: 3 }).done()
    activityTracker.add({ id: 4 }).done()
    expect(activityTracker.finishedTasks).toHaveLength(1)
    expect(activityTracker.finishedTasks[0].data).toEqual({ id: 4 })
  })

  it('should not care if I finish a task twice', () => {
    const myTask = { id: 1 }
    const activityTracker = new ActivityTracker<TestTask>()
    const task = activityTracker.add(myTask)
    task.done()
    task.done()
  })

  it('should be able to update the task', () => {
    const myTask = { id: 1 }
    const activityTracker = new ActivityTracker<TestTask & { data?: string }>()
    const task = activityTracker.add(myTask)
    expect(activityTracker.activeTasks[0].data).toEqual({ id: 1 })
    task.update({ data: 'update' })
    expect(activityTracker.activeTasks[0].data).toEqual({
      id: 1,
      data: 'update',
    })
    task.set({ id: 2, data: 'set' })
    expect(activityTracker.activeTasks[0].data).toEqual({
      id: 2,
      data: 'set',
    })
    task.done({ data: 'done' })
    expect(activityTracker.finishedTasks[0].data).toEqual({
      id: 2,
      data: 'done',
    })
  })
  it('should notify me of changes through an observable', (done) => {
    const myTask = { id: 1 }
    type Type = TestTask & { data?: string }
    type Handler = (action: TaskActions, task: Task<Type>) => void
    const activityTracker = new ActivityTracker<Type>()
    const events: Handler[] = [
      (action) => expect(action).toEqual(TaskActions.created),
      (action) => expect(action).toEqual(TaskActions.update),
      (action) => expect(action).toEqual(TaskActions.update),
      (action) => {
        expect(action).toEqual(TaskActions.finished)
        done()
      },
    ]
    const subscription = activityTracker.observable.subscribe(
      ({ action, task }) => {
        const assert = events.shift()
        expect(assert).not.toBeUndefined()
        assert!(action, task)
      }
    )
    const task = activityTracker.add(myTask)
    task.update({ data: 'progress' })
    task.done({ data: 'finished' })
    subscription.unsubscribe()
    expect(events).toHaveLength(0)
  })
})
