export const rangeToString = (item: { start: Date; end: Date }) => {
  const sy = item.start.getFullYear()
  const ey = item.end.getFullYear()
  const sm = item.start.getMonth() + 1
  const em = item.end.getMonth() + 1
  const sd = item.start.getDate()
  const ed = item.end.getDate()
  if (sy === ey)
    if (sm === em) return `${sd}.-${ed}.${sm}.${sy}`
    else return `${sd}.${sm}.-${ed}.${em}.${sy}`
  return `${sd}.${sm}.${sy}-${ed}.${em}.${ey}`
}
