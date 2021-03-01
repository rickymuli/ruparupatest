let itemFilter = (items = [], filteredBy, filterKey, lower) => {
  let filteredItems = items.filter((item) => {
    return ((lower ? item[filterKey].toLowerCase() : item[filterKey]).includes(lower ? filteredBy.toLowerCase() : filteredBy))
  })
  return filteredItems
}

export default itemFilter

export const caseInsensitiveFilter = (items = [], filteredBy, filterKey) => {
  let filteredItems = items.filter((item) => {
    return item[filterKey].match(new RegExp(filteredBy, 'i'))
  })
  return filteredItems
}
