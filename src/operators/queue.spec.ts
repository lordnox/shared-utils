import Queue from './queue'

describe('Queue', () => {
  it('should create a simple queue and drain it', async () => {
    const queue = new Queue((item: number) => item * 2, { name: '🎲' })
    const results = Promise.all([
      queue.enque(1),
      queue.enque(2),
      queue.enque(3),
      queue.enque(4),
    ])
    expect(queue.getStatus()).toEqual(4)
    expect(await queue.enque(5)).toEqual(10)
    expect(await results).toEqual([2, 4, 6, 8])
  })

  it('should handle limited availablility', async () => {
    const queue = new Queue((text: string) => text.length, {
      name: '👽',
      level: 2,
    })
    const results = Promise.all([
      queue.enque('hello'),
      queue.enque('Hallo'),
      queue.enque('hi'),
      queue.enque('ahoi'),
    ])
    expect(queue.getStatus()).toEqual(2)
    expect(await results).toEqual([5, 5, 2, 4])
  })

  it('should handle rejections', async () => {
    const queue = new Queue(
      (action: 'throw' | 'reject') => {
        if (action === 'throw') throw new Error(action)
        return Promise.reject(new Error(action))
      },
      {
        name: '🙀',
      }
    )
    const catchThis = (err: Error) => err.message
    const promises: Promise<any>[] = []
    expect(queue.getStatus()).toEqual(0)
    promises.push(queue.enque('throw').catch(catchThis))
    expect(queue.getStatus()).toEqual(0)
    promises.push(queue.enque('reject').catch(catchThis))
    expect(queue.getStatus()).toEqual(1)
    promises.push(queue.enque('reject').catch(catchThis))
    expect(queue.getStatus()).toEqual(2)
    promises.push(queue.enque('throw').catch(catchThis))
    expect(queue.getStatus()).toEqual(2)
    expect(await Promise.all(promises)).toEqual([
      'throw',
      'reject',
      'reject',
      'throw',
    ])
  })
})
