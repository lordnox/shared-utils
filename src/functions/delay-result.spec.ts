import { deferred } from '../promise/deferred'
import { delayResult } from './delay-result'
import { inspect } from 'util'

describe('::delayResult', () => {
  it('should not use the delay function when the (period - runtime) is 0 or less', async () => {
    const def = deferred()
    const fn = (x: number) => x * 2
    const localDelay = jest.fn(() => def)
    const delayed = delayResult(fn, {
      delay: localDelay,
    })
    const res = delayed(5)
    def.resolve()
    expect(await res).toBe(10)
    expect(localDelay).toHaveBeenCalledTimes(0)
  })

  it('should use a defined delay function', async () => {
    const def = deferred()
    const fn = (x: number) => x * 2
    const localDelay = jest.fn(() => def)
    const delayed = delayResult(fn, {
      period: 100,
      delay: localDelay,
    })
    const res = delayed(5)
    def.resolve()
    expect(await res).toBe(10)
  })

  it('should delay the result by at least the set amount', async () => {
    const fn = (x: number) => x * 2
    const def = deferred()

    const delayed = delayResult(fn, {
      period: 100,
      delay: (timeout) => {
        expect(timeout).toBeGreaterThan(50)
        return def
      },
    })
    const res = delayed(5)
    expect(inspect(res)).toBe('Promise { <pending> }')
    def.resolve()
    await res
    expect(inspect(res)).toBe('Promise { 10 }')
    expect.assertions(3)
  })

  const fn = (x: number) => x * 2
  describe.each([
    ['with period', delayResult(fn, 100)],
    ['with options', delayResult(fn, { period: 100 })],
  ])('%s', (_, delayed) => {
    it.each([0, 5, 0.1, -1])('should return the result: %d', async (x) => {
      expect(await delayed(x)).toEqual(fn(x))
    })
  })
})
