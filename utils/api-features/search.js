import Category from '../../models/Category.js'
import Product from '../../models/Product.js'
import Brand from '../../models/Brand.js'
import Review from '../../models/Review.js'
import SubCategory from '../../models/SubCategory.js'
import User from '../../models/User.js'

const getSearchFields = (search, Model, searchFilterObjQuery) => {
  const searchRegex = new RegExp(search, 'i')

  let searchFields
  switch (Model) {
    case Category:
    case Brand:
    case SubCategory:
      searchFields = ['name', 'slug']
      break
    case Product:
      searchFields = ['title', 'slug', 'description']
      break
    case Review:
      searchFields = ['comment']
      break
    case User:
      searchFields = ['name', 'email', 'role']
      break
      // Add more cases for other models if needed
    default:
      searchFields = []
  }

  searchFilterObjQuery.$or = searchFields
    .map(field => ({ [field]: searchRegex }))
  return searchFilterObjQuery
}

export default getSearchFields
