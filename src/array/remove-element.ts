export const removeElement = <T>(
  arr: T[],
  item: T,
  compare = (element: T, item: T) => element === item
) => {
  const index = arr.findIndex((element) => compare(element, item))
  if (index === -1) return arr
  return [...arr.slice(0, index), ...arr.slice(index + 1)]
}

export const removeElementInPlace = <T>(
  arr: T[],
  item: T,
  compare = (element: T, item: T) => element === item
) => {
  const index = arr.findIndex((element) => compare(element, item))
  if (index === -1) return
  arr.splice(index, 1)
}
