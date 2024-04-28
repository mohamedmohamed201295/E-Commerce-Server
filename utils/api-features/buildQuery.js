import sorter from './sort.js'
import selecter from './select.js'
import searchObjQuery from './search.js'
import filterObjQuery from './priceRateOrder.js'

const buildQuery = (Model, queryParams) => {
  const { sort, fields, search, page, limit, numericFilters } = queryParams
  const skip = ((parseInt(page) || 1) - 1) * (parseInt(limit) || 5)
  let searchFilterObjQuery = {}

  // Searching
  if (search) {
    searchFilterObjQuery = searchObjQuery(
      search,
      Model,
      searchFilterObjQuery
    )
  }
  // numeric filter
  if (numericFilters) {
    searchFilterObjQuery = filterObjQuery(
      numericFilters,
      searchFilterObjQuery
    )
  }
  let result = Model.find(searchFilterObjQuery)

  // Sorting
  result = sorter(result, sort)

  // Fields selection
  result = selecter(result, fields)

  // Pagination
  return result.skip(skip).limit(limit)
}

export default buildQuery
