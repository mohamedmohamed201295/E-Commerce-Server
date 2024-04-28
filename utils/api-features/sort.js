const buildSortOptions = (result, sort) => {
  if (!sort) {
    return result.sort('-createdAt') // Default sort option
  }
  const sortFields = sort.split(',').join(' ')
  return result.sort(sortFields)
}

export default buildSortOptions
