import express from 'express'
import subCategoryController from '../controllers/subcategory.js'
import subCategoryValid from './validation-layer/rules/subcategory.js'
import auth from '../utils/authorization/auth.js'

const router = express.Router({ mergeParams: true })
const {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory
} = subCategoryController

const {
  createSubCategoryValid,
  getSubCategoryValid,
  updateSubCategoryValid,
  deleteSubCategoryValid
} = subCategoryValid

router.use(auth.protect)

router
  .route('/')
  .post(
    auth.allowedTo('admin', 'manager'),
    createSubCategoryValid,
    createSubCategory
  )
  .get(getAllSubCategories)
router
  .route('/:id')
  .get(
    getSubCategoryValid,
    getSubCategory
  )
  .put(
    auth.allowedTo('admin', 'manager'),
    updateSubCategoryValid,
    updateSubCategory
  )
  .delete(
    auth.allowedTo('admin'),
    deleteSubCategoryValid,
    deleteSubCategory
  )

export default router
