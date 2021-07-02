export const delay = async (
  period: number,
  { timeout = setTimeout }: { timeout?: typeof setTimeout } = {}
) => {
  let timeoutId: ReturnType<typeof timeout>
  const promise = new Promise((resolve) => {
    timeoutId = timeout(resolve, period)
  })
  promise.finally(() => {
    clearTimeout(timeoutId)
  })
  return promise
}
