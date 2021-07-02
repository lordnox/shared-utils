// Copyright 2018-2021 the Deno authors. All rights reserved. MIT license.

import { deferred } from './deferred'

describe('::deferred', () => {
  it('[async] deferred: resolve', async function () {
    const d = deferred<string>()
    d.resolve('🦕')
    expect(await d).toEqual('🦕')
  })

  it('[async] deferred: reject', async function () {
    const d = deferred<number>()
    const error = new Error('A deno error 🦕')
    d.reject(error)
    expect(d).rejects.toEqual(error)
  })
})
