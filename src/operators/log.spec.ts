import * as Log from './log'

let logger: {
  log: jest.MockedFunction<Console['log']>
  info: jest.MockedFunction<Console['info']>
  warn: jest.MockedFunction<Console['warn']>
  debug: jest.MockedFunction<Console['debug']>
  error: jest.MockedFunction<Console['error']>
}

beforeEach(() => {
  logger = {
    log: jest.fn<void, Parameters<Console['log']>>(),
    info: jest.fn<void, Parameters<Console['info']>>(),
    warn: jest.fn<void, Parameters<Console['warn']>>(),
    debug: jest.fn<void, Parameters<Console['debug']>>(),
    error: jest.fn<void, Parameters<Console['error']>>(),
  }
  Log.setLogger(logger)
})

describe('logger', () => {
  it('should create a simple logging function', () => {
    let i = 0
    const getNow = () => {
      return 1625564156533 + ++i * 1250
    }
    const log = Log.createLogger('test', { now: getNow })('Magic:')
    expect(typeof log).toBe('function')
    log('Now you see me.')
    expect(logger.log).toHaveBeenLastCalledWith(
      '[11:35:57] Magic: Now you see me.'
    )
    Log.setLogType('test', false)
    log("Now you don't")
    expect(logger.log).not.toHaveBeenLastCalledWith(
      "[11:35:58] Magic: Now you don't"
    )
    Log.setLogType('test', true)
    log('Hello Again')

    expect(logger.log).toHaveBeenLastCalledWith(
      '[11:35:59 +1250ms] Magic: Hello Again'
    )
  })
})
