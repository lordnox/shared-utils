import { LogFn, createLogger } from '../operators/log'
import { deferred, Deferred } from '../promise/deferred'

export type AvailabilityFn = (active: number, level: number) => boolean

export class Queue<Type, Response> {
  #queue: [Type, Deferred<Response>][] = []
  #active = 0
  #handle: (data: Type) => Response | PromiseLike<Response>
  #level: number
  #log: LogFn
  #available: AvailabilityFn

  public constructor(
    handle: (data: Type) => Response | PromiseLike<Response>,
    {
      level = 5,
      name = 'Q',
      availabilityFn = (active, level) => active < level,
    }: { level?: number; name?: string; availabilityFn?: AvailabilityFn } = {}
  ) {
    this.#handle = handle
    this.#level = level
    this.#log = createLogger('queue')(name)
    this.#available = availabilityFn
  }

  private available() {
    return this.#available(this.#active, this.#level)
  }

  public deque() {
    if (this.available()) this.pop()
  }

  public enque(data: Type) {
    this.#log('enqueing new item')
    const promise = deferred<Response>()
    this.#queue.push([data, promise])
    this.deque()
    return promise
  }

  public async pop() {
    if (!this.#queue.length) {
      return
    }
    this.#active++
    const [item, promise] = this.#queue.shift()!
    try {
      const result = await this.#handle(item)
      promise.resolve(result)
    } catch (error) {
      promise.reject(error)
    }
    this.#active--
    this.pop()
  }

  public getStatus() {
    return this.#active
  }
}

export default Queue
