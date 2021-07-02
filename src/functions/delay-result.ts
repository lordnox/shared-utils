import { delay } from '../promise/delay'
import { UnpackPromise } from '../promise/unpack-type'

export const delayResult =
  <Fn extends (...args: any[]) => any>(fn: Fn, period: number = 0) =>
  async (...args: Parameters<Fn>): Promise<UnpackPromise<ReturnType<Fn>>> => {
    const start = Date.now()
    const result = await fn(...args)
    const waitFor = period - (Date.now() - start)
    if (waitFor > 0) await delay(waitFor)
    return result
  }
