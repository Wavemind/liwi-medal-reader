export const _keys = object => {
  return Object.keys(object).map(key => parseInt(key, 10))
}
