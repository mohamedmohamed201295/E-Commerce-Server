const priceRateOrderer = (numericFilters, searchFilterObjQuery) => {
  const operatorMap = {
    '>': '$gt',
    '>=': '$gte',
    '=': '$eq',
    '<': '$lt',
    '<=': '$lte'
  }
  const regEx = /\b(<|>|>=|=|<|<=)\b/g
  const options = ['price', 'ratingsAverage']
  const filters = numericFilters.replace(
    regEx,
    (match) => `-${operatorMap[match]}-`
  )
  filters.split(',').forEach((item) => {
    const [field, operator, value] = item.split('-')
    if (options.includes(field)) {
      searchFilterObjQuery[field] = { [operator]: parseFloat(value) }
    }
  })
  return searchFilterObjQuery
}

export default priceRateOrderer
