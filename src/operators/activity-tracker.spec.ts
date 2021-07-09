import ActivityTracker, { Task } from './activity-tracker'

interface TestTask {
  id: number
}

describe('ActivityTracker', () => {
  it('should be able recieve a task and set it to done', () => {
    const myTask = { id: 1 }
    const activityTracker = new ActivityTracker<TestTask>()
    const task = activityTracker.add(myTask)
    expect(activityTracker.getActiveTasks()).toHaveLength(1)
    expect(activityTracker.getActiveTasks()[0].data).toBe(myTask)
    task.done()
    expect(activityTracker.getActiveTasks()).toHaveLength(0)
    expect(activityTracker.getFinishedTasks()).toHaveLength(1)
  })

  it('should cleanup old tasks', () => {
    const activityTracker = new ActivityTracker<TestTask>({
      cleanup: (tasks) => tasks.slice(tasks.length - 1, tasks.length),
    })
    activityTracker.add({ id: 1 }).done()
    activityTracker.add({ id: 2 }).done()
    activityTracker.add({ id: 3 }).done()
    activityTracker.add({ id: 4 }).done()
    expect(activityTracker.getFinishedTasks()).toHaveLength(1)
    expect(activityTracker.getFinishedTasks()[0].data).toEqual({ id: 4 })
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
    expect(activityTracker.getActiveTasks()[0].data).toEqual({ id: 1 })
    task.update({ data: 'update' })
    expect(activityTracker.getActiveTasks()[0].data).toEqual({
      id: 1,
      data: 'update',
    })
    task.set({ id: 2, data: 'set' })
    expect(activityTracker.getActiveTasks()[0].data).toEqual({
      id: 2,
      data: 'set',
    })
    task.done({ data: 'done' })
    expect(activityTracker.getFinishedTasks()[0].data).toEqual({
      id: 2,
      data: 'done',
    })
  })
  it('should notify me of changes through an observable', (done) => {
    const myTask = { id: 1 }
    const activityTracker = new ActivityTracker<TestTask & { data?: string }>()
    const events = [
      (action: string, task: Task<any>) => {
        expect(action).toEqual('added')
      },
      (action: string, task: Task<any>) => {
        expect(action).toEqual('updated')
      },
      (action: string, task: Task<any>) => {
        expect(action).toEqual('updated')
      },
      (action: string, task: Task<any>) => {
        expect(action).toEqual('finished')
        done()
      },
    ]
    const observer = activityTracker.observer.subscribe(({ action, task }) => {
      const assert = events.shift()
      expect(assert).not.toBeUndefined()
      assert!(action, task)
    })
    const task = activityTracker.add(myTask)
    task.update({ data: 'progress' })
    task.done({ data: 'finished' })
    observer.unsubscribe()
  })
})
