import { rangeToString } from './range-to-string'

describe('::rangeToString', () => {
  it.each([
    ['2021-07-19', '2021-07-25', '19.-25.7.2021'],
    ['2021-07-25', '2021-08-01', '25.7.-1.8.2021'],
    ['2021-12-27', '2022-01-02', '27.12.2021-2.1.2022'],
  ])('should convert %s & %s to %s', (startStr, endStr, hash) => {
    const start = new Date(Date.parse(startStr))
    const end = new Date(Date.parse(endStr))
    expect(rangeToString({ start, end })).toEqual(hash)
  })
})
