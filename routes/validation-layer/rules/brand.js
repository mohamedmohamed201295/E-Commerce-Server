import pkg from 'express-validator'
import Brand from '../../../models/Brand.js'
import validator from '../validators/validator.js'
import { NotFoundError, BadRequestError } from '../../../errors/index.js'

const createBrandValid = [
  pkg
    .body('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Brand name is less than 2 characters')
    .isLength({ max: 20 })
    .withMessage('Brand name is more than 20 characters')
    .bail()
    .custom(async (brandName) => {
      const brand = await Brand.findOne({ name: brandName })
      if (brand) {
        throw new BadRequestError(`${brandName} brand is already exists`)
      }
    }),
  validator
]

const getBrandValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (brandId, { req }) => {
      const brand = await Brand.findById(brandId)
      if (!brand) {
        throw new NotFoundError(`No brand with id: ${brandId}`)
      }
      req.brand = brand
    }),
  validator
]

const updateBrandValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (brandId, { req }) => {
      const brand = await Brand.findById(brandId)
      if (!brand) {
        throw new NotFoundError(`No brand with id: ${brandId}`)
      }
      req.brand = brand
    }),
  pkg
    .body('name')
    .optional()
    .notEmpty()
    .withMessage('Brand name is required')
    .bail()
    .isLength({ min: 2 })
    .withMessage('Brand name is less than 2 characters')
    .isLength({ max: 20 })
    .withMessage('Brand name is more than 20 characters')
    .bail()
    .custom(async (brandName, { req }) => {
      const brand = await Brand.findOne({ name: brandName })
      if (brand) {
        throw new BadRequestError(`${brandName} brand is already exists`)
      }
      if (req.brand.name === brandName) {
        throw new BadRequestError(
          `${brandName} is exactly the current brand name`
        )
      }
    }),
  validator
]

const deleteBrandValid = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId)
      if (!brand) {
        throw new NotFoundError(`No brand with id: ${brandId}`)
      }
    }),
  validator
]

export default {
  createBrandValid,
  getBrandValid,
  updateBrandValid,
  deleteBrandValid
}
