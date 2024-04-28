import pkg from 'express-validator'

import validator from '../validators/validator.js'
import SubCategory from '../../../models/SubCategory.js'
import { BadRequestError, NotFoundError } from '../../../errors/index.js'
import Category from '../../../models/Category.js'

// Rules
const createSubCategoryValid = [
  pkg
    .body('name')
    .notEmpty()
    .withMessage('Subcategory name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .bail()
    .custom(async (subCategoryName) => {
      const subCategory = await SubCategory.findOne({ name: subCategoryName })
      if (subCategory) {
        throw new BadRequestError(
          `${subCategoryName} subcategory is already exists`
        )
      }
    }),
  pkg
    .check('category')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId)
      if (!category) {
        throw new NotFoundError(`No category found with id: ${categoryId}`)
      }
    }),
  validator
]

const getSubCategoryValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (subCategoryId, { req }) => {
      const subCategory = await SubCategory.findById(subCategoryId)
      if (!subCategory) {
        throw new NotFoundError(
          `No subcategory found with id: ${subCategoryId}`
        )
      }
      req.subCategory = subCategory
    }),
  validator
]

const updateSubCategoryValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (subCategoryId, { req }) => {
      const subCategory = await SubCategory.findById(subCategoryId)
      if (!subCategory) {
        throw new NotFoundError(
          `No subcategory found with id: ${subCategoryId}`
        )
      }
      req.subCategory = subCategory
    }),
  pkg
    .body('name')
    .notEmpty()
    .withMessage('Subcategory name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .custom(async (subCategoryName, { req }) => {
      const subCategory = await SubCategory.findOne({ name: subCategoryName })
      if (req.subCategory && req.subCategory.name === subCategoryName) {
        throw new BadRequestError(
          `${req.body.name} is exactly the current subcategory name`
        )
      }
      if (subCategory) {
        throw new NotFoundError(
          `${subCategoryName} subcategory is already exists`
        )
      }
    }),
  pkg
    .body('category')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId)
      if (!category) {
        throw new NotFoundError(`No category found with id: ${categoryId}`)
      }
    }),
  validator
]

const deleteSubCategoryValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .custom(async (subCategoryId) => {
      const subCategory = await SubCategory.findById(subCategoryId)
      if (!subCategory) {
        throw new NotFoundError(
          `No subcategory found with id: ${subCategoryId}`
        )
      }
    }),
  validator
]

export default {
  createSubCategoryValid,
  getSubCategoryValid,
  updateSubCategoryValid,
  deleteSubCategoryValid
}
