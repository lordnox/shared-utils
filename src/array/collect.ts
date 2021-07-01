interface CollectOptions {
  order?: 'unshift' | 'push'
  overflow?: number
}

/**
 * Collects arguments and calls a function with them until an overflow is reached.
 *
 * ```
 * const print = collect(console.log, { overflow: 3 })
 * print(1) // ['1']
 * print(2) // ['1', '2']
 * print(3) // ['1', '2', '3']
 * print(4) // ['2', '3', '4']
 * ```
 **/
export const collect = <T>(
  fn: (args: T[]) => void,
  { order = 'unshift', overflow = 100 }: CollectOptions = {}
) => {
  type AddArg = (arg: T) => void
  let args: T[] = []
  const addArgUnshift: AddArg = (arg) => {
    args.unshift(arg)
    args = args.slice(0, overflow)
  }
  const addArgPush: AddArg = (arg) => {
    args.push(arg)
    args = args.slice(Math.max(0, args.length - overflow))
  }
  const addArg = order === 'unshift' ? addArgUnshift : addArgPush
  return (arg: T) => {
    addArg(arg)
    fn(args)
  }
}
