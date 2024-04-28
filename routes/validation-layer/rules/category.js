import pkg from 'express-validator'
import validator from '../validators/validator.js'
import Category from '../../../models/Category.js'
import { BadRequestError, NotFoundError } from '../../../errors/index.js'

// RULES
const createCategoryValidator = [
  pkg
    .check('name')
    .notEmpty()
    .withMessage('Category name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .bail()
    .custom(async (categoryName) => {
      const category = await Category.findOne({ name: categoryName })
      if (category) {
        throw new BadRequestError(`${category.name} category is already exists`)
      }
    }),
  validator
]

const getCategoryValidator = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (categoryId, { req }) => {
      const category = await Category.findById(categoryId)
      if (!category) {
        throw new NotFoundError(`No category found with id: ${categoryId}`)
      }
      req.category = category
    }),
  validator
]

const updateCategoryValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail(),
  pkg
    .body('name')
    .optional()
    .notEmpty()
    .withMessage('Category name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .bail()
    .custom(async (categoryName, { req }) => {
      const category = await Category.findOne({ name: categoryName })
      if (req.category && categoryName === req.body.name) {
        throw new BadRequestError(
          `${categoryName} is exactly the current category name`
        )
      }
      if (category) {
        throw new BadRequestError(`${categoryName} category is already exists`)
      }
    }),
  validator
]

const deleteCategoryValid = [
  pkg
    .param('id')
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

export default {
  createCategoryValidator,
  getCategoryValidator,
  updateCategoryValid,
  deleteCategoryValid
}
