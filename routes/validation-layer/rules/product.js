import pkg from 'express-validator'

import { NotFoundError, BadRequestError } from '../../../errors/index.js'
import validator from '../validators/validator.js'
import Category from '../../../models/Category.js'
import SubCategory from '../../../models/SubCategory.js'
import Product from '../../../models/Product.js'

const getProductValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid product id')
    .bail()
    .custom(async (productId, { req }) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new NotFoundError(`No product found with id: ${productId}`)
      }
      req.product = product
    }),
  validator
]

const createProductValid = [
  pkg
    .body('title')
    .notEmpty()
    .withMessage('Product title is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Product title must be more than 3 characters')
    .isLength({ max: 100 })
    .withMessage('Product title must be less than 100 characters')
    .bail()
    .custom(async (productTitle) => {
      const product = await Product.findOne({ title: productTitle })
      if (product) {
        throw new BadRequestError(`${productTitle} is already exists`)
      }
    }),
  pkg
    .body('description')
    .notEmpty()
    .withMessage('Product slug is required')
    .bail()
    .isLength({ max: 2000 })
    .withMessage('Product description is greater than 2000 characters')
    .isLength({ min: 20 })
    .withMessage('Product description is less than 20 characters'),
  pkg.body('quantity', 'Product quantity is required').notEmpty(),
  pkg
    .body('price')
    .notEmpty()
    .withMessage('Product price is required')
    .bail()
    .isNumeric()
    .withMessage('Product price must be numeric')
    .isLength({ max: 1000000 })
    .withMessage('Product price must be less than 20 numbers'),
  pkg
    .body('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Product price must be numeric')
    .toFloat()
    .custom((value, { req }) => {
      if (value >= req.body.price) {
        throw new BadRequestError(
          'Price must be lower than price after the discount'
        )
      }
      return true
    }),
  pkg
    .body('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array of strings'),
  pkg
    .check('imageCover')
    .optional()
    .notEmpty()
    .withMessage('Image cover must be provided'),
  pkg
    .body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of strings'),
  pkg
    .body('category')
    .isMongoId()
    .withMessage('Invalid category id')
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId)
      if (!category) {
        throw new NotFoundError(`No category found with id: ${categoryId}`)
      }
    }),
  pkg
    .body('subCategories')
    .optional()
    .isMongoId()
    .withMessage('Invalid subcategory id')
    .bail()
    .custom(async (subCategoriesIds, { req }) => {
      const subCategoriesDB = await SubCategory.find({
        category: req.body.category
      })
      /* This array will save subcategories ids that belong to submitted
          category */
      const subCategoriesIdsDB = []

      // Check if all submitted subcategories in DBs
      const submittedSubcategories = await SubCategory.find({
        _id: { $exists: true, $in: subCategoriesIds }
      })
      if (
        submittedSubcategories.length < 1 ||
        submittedSubcategories.length !== subCategoriesIds.length
      ) {
        throw new NotFoundError('Invalid subcategories Ids')
      }

      subCategoriesDB.forEach((subCategory) => {
        subCategoriesIdsDB.push(subCategory._id.toString())
      })
      const checker = subCategoriesIds.every((id) =>
        subCategoriesIdsDB.includes(id)
      )
      if (!checker) {
        throw new NotFoundError(
          `Subcategories does not belong to categoryId: ${req.body.category}`
        )
      }
    }),
  pkg.body('brand').optional().isMongoId().withMessage('Invalid brand id'),
  pkg
    .body('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings Average must be a number')
    .bail()
    .toFloat()
    .isLength({ min: 1 })
    .withMessage('lower than 1')
    .isLength({ max: 5 })
    .withMessage('greater than 1'),
  pkg
    .body('ratingsAverage')
    .optional()
    .isNumeric()
    .withMessage('Ratings Average must be a number'),
  validator
]

const updateProductValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid product id')
    .bail()
    .custom(async (productId, { req }) => {
      const product = await Product.findById(productId)
      if (!product) {
        throw new NotFoundError(`No product found with id: ${productId}`)
      }
      req.product = product
    }),
  validator
]

const deleteProductValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid product id')
    .bail()
    .custom(async (ProductId) => {
      const product = await Product.findById(ProductId)
      if (!product) {
        throw new NotFoundError(`No product found with id: ${ProductId}`)
      }
    }),
  validator
]

export default {
  getProductValid,
  createProductValid,
  updateProductValid,
  deleteProductValid
}
