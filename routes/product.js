import express from 'express'

import controller from '../controllers/product.js'
import validationLayer from './validation-layer/rules/product.js'
import reviewRouter from './review.js'
import auth from '../utils/authorization/auth.js'

const router = express.Router()
const {
  getProductValid,
  createProductValid,
  updateProductValid,
  deleteProductValid
} = validationLayer
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  resizeImages
} = controller

router.use(auth.protect)

router
  .route('/')
  .get(getAllProducts)
  .post(
    auth.allowedTo('admin', 'manager'),
    uploadImages,
    resizeImages,
    createProductValid,
    createProduct
  )
router
  .route('/:id')
  .get(
    getProductValid,
    getProduct
  )
  .put(
    auth.allowedTo('admin', 'manager'),
    uploadImages,
    resizeImages,
    updateProductValid,
    updateProduct
  )
  .delete(
    auth.allowedTo('admin'),
    deleteProductValid,
    deleteProduct
  )
router.use('/:products/review', reviewRouter)

export default router
