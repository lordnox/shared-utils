import { delayResult } from './delay-result'

describe('::delayResult', () => {
  const fn = (x: number) => x * 2
  const delayed = delayResult(fn, 5)
  it.each([0, 5, 0.1, -1])('should return the result', async (x) => {
    expect(await delayed(x)).toEqual(fn(x))
  })
})
