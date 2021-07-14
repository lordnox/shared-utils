import { listDir, listFiles } from './list'
import { join } from 'path'

describe('::listDir', () => {
  it('should list all files correctly', async () => {
    expect(await listDir(join(__dirname, './fixtures'))).toEqual({
      dirs: ['empty', 'sub'],
      files: ['a', 'b'],
    })
  })

  it('should apply the filters', async () => {
    expect(
      await listDir(join(__dirname, './fixtures'), {
        filterDir: (dir) => dir !== 'sub',
        filterFile: (file) => file !== 'a',
      })
    ).toEqual({
      dirs: ['empty'],
      files: ['b'],
    })
  })
})

describe('::listFiles', () => {
  it('should list all files', async () => {
    expect(await listFiles(join(__dirname, './fixtures'))).toEqual([
      'a',
      'b',
      'sub/a',
      'sub/b',
      'sub/c',
    ])
  })

  it('should list all files', async () => {
    expect(
      await listFiles(join(__dirname, './fixtures'), {
        recursive: false,
      })
    ).toEqual(['a', 'b'])
  })

  it('should filter all files', async () => {
    expect(
      await listFiles(join(__dirname, './fixtures'), {
        filterFile: (file, dir) =>
          !(file === 'a' || (dir === 'sub' && file === 'b')),
      })
    ).toEqual(['b', 'sub/c'])
  })
})
