import express from 'express'

import categoryController from '../controllers/category.js'
import validationLayer from './validation-layer/rules/category.js'
import subCategoryRoute from './subcategory.js'
import auth from '../utils/authorization/auth.js'

const router = express.Router()
const {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage
} = categoryController

const {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValid,
  deleteCategoryValid
} = validationLayer

router.use(auth.protect)

router.route('/')
  .get(getAllCategories)
  .post(
    auth.allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  )

router
  .route('/:id')
  .get(
    getCategoryValidator,
    getCategory
  )
  .put(
    auth.allowedTo('admin', 'manager'),
    uploadImage,
    updateCategoryValid,
    resizeImage,
    updateCategory
  )
  .delete(
    auth.allowedTo('admin'),
    deleteCategoryValid,
    deleteCategory
  )
router.use('/:category/subcategories', subCategoryRoute)

export default router
