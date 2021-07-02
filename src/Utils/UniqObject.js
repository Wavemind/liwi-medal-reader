export default array => {
  const seen = new Set()
  return array.filter(el => {
    const duplicate = seen.has(el.id)
    seen.add(el.id)
    return !duplicate
  })
}
