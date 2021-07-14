import { promises as fs } from 'fs'
import { join } from 'path'

export interface DirEntries {
  dirs: string[]
  files: string[]
}
export type DefaultErrorTypes = Error | NodeJS.ErrnoException
export type ErrorCallback<ErrorTypes = DefaultErrorTypes> = (
  error: ErrorTypes,
  result?: null | undefined
) => void

export type Callback<Type, ErrorTypes = DefaultErrorTypes> = ((
  error: null | undefined,
  result: Type
) => void) &
  ErrorCallback<ErrorTypes>
export const listDir = async (
  dir: string,
  {
    filterDir = () => true,
    filterFile = () => true,
  }: {
    filterDir?: (dir: string) => boolean
    filterFile?: (file: string) => boolean
  } = {}
) => {
  const entries: DirEntries = { dirs: [], files: [] }
  const files = await fs.readdir(dir)
  if (files.length < 1) return entries

  await Promise.all(
    files.map(async (filename) => {
      const file = await fs.stat(join(dir, filename))
      if (file.isDirectory()) {
        if (filterDir(filename)) entries.dirs.push(filename)
      } else {
        if (filterFile(filename)) entries.files.push(filename)
      }
    })
  )
  entries.dirs.sort()
  entries.files.sort()
  return entries
}

const _listFiles = async (
  path: string,
  dir: string,
  recursive: boolean,
  filterFile: (file: string, dir: string, path: string) => boolean,
  filterDir?: (dir: string) => boolean
): Promise<string[]> => {
  const { dirs, files } = await listDir(join(path, dir), {
    filterDir,
    filterFile: (file) => filterFile(file, dir, path),
  })
  if (!recursive || dirs.length === 0) return files
  const entries = await Promise.all(
    dirs.map(async (subdir) => {
      const subFiles = await _listFiles(
        path,
        join(dir, subdir),
        recursive,
        filterFile,
        filterDir
      )
      return subFiles.map((file) => join(subdir, file))
    })
  )
  return entries.reduce((files, addFiles) => files.concat(addFiles), files)
}
export const listFiles = async (
  dir: string,
  {
    recursive = true,
    filterDir,
    filterFile = () => true,
  }: {
    recursive?: boolean
    filterDir?: (dir: string) => boolean
    filterFile?: (file: string, dir: string, path: string) => boolean
  } = {}
): Promise<string[]> => _listFiles(dir, '', recursive, filterFile, filterDir)
