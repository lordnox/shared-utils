import { deferred } from './deferred'

export const only = <Fn extends (...args: any[]) => any>(fn: Fn) => {
  let running: Promise<any> = Promise.resolve()

  return async (...args: Parameters<Fn>) => {
    const lastRun = running
    const thisRun = deferred()
    running = thisRun
    await lastRun
    const result = await fn(...args)
    thisRun.resolve()
    return result
  }
}
