import { delay } from '../promise/delay'
import { UnpackPromise } from '../promise/unpack-type'

export type PromisedResult<Fn extends (...args: any[]) => any> = Promise<
  UnpackPromise<ReturnType<Fn>>
>
export interface DelayedResultOptions {
  period: number
  delay: typeof delay
  now: () => number
}

export function delayResult<Fn extends (...args: any[]) => any>(
  fn: Fn,
  period?: number
): (...args: Parameters<Fn>) => PromisedResult<Fn>
export function delayResult<Fn extends (...args: any[]) => any>(
  fn: Fn,
  options: Partial<DelayedResultOptions>
): (...args: Parameters<Fn>) => PromisedResult<Fn>
export function delayResult<Fn extends (...args: any[]) => any>(
  fn: Fn,
  opts = {}
) {
  const options = (
    typeof opts === 'number' ? { period: opts } : opts
  ) as Partial<DelayedResultOptions>
  const period = options.period ?? 0
  const delayFn = options.delay ?? delay
  const nowFn = options.now ?? Date.now
  return async (
    ...args: Parameters<Fn>
  ): Promise<UnpackPromise<ReturnType<Fn>>> => {
    const start = nowFn()
    const result = await fn(...args)
    const end = nowFn()
    const runtime = end - start
    const waitFor = period - runtime
    if (waitFor > 0) await delayFn(waitFor)
    return result
  }
}
