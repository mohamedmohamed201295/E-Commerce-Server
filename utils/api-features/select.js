const buildSelectFields = (result, fields) => {
  if (!fields) {
    return result.select('-__v') // Default select fields
  }

  const selectedFields = fields.split(',').join(' ')
  return result.select(selectedFields)
}

export default buildSelectFields
