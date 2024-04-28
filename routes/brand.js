import express from 'express'

import brandController from '../controllers/brand.js'
import validationLayer from './validation-layer/rules/brand.js'
import auth from '../utils/authorization/auth.js'

const router = express.Router()
const {
  createBrand,
  updateBrand,
  deleteBrand,
  getAllBrands,
  getBrand,
  uploadImage,
  resizeImage
} = brandController
const {
  createBrandValid,
  getBrandValid,
  updateBrandValid,
  deleteBrandValid
} = validationLayer

router.use(auth.protect)

router
  .route('/')
  .post(
    auth.allowedTo('admin', 'manager'),
    uploadImage,
    resizeImage,
    createBrandValid,
    createBrand
  )
  .get(getAllBrands)

router
  .route('/:id')
  .put(
    auth.allowedTo('admin', 'manager'),
    uploadImage,
    updateBrandValid,
    resizeImage,
    updateBrand
  )
  .delete(
    auth.allowedTo('admin'),
    deleteBrandValid,
    deleteBrand
  )
  .get(
    getBrandValid,
    getBrand
  )

export default router
