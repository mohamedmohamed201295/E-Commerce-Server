import slugify from 'slugify'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

import Product from '../models/Product.js'
import { NotFoundError } from '../errors/index.js'
import {
  buildQuery,
  executeQuery
} from '../utils/api-features/index.js'
import upload from '../middleware/upload-image.js'
import del from './utils/handlers-factory.js'

const uploadImages = upload.uploadImages([
  {
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'image',
    maxCount: 5
  }
])

const resizeImages = async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverfileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .toFile(`uploads/products/${imageCoverfileName}`)

    req.body.imageCover = imageCoverfileName
  }
  if (req.files.image) {
    req.body.images = []
    req.files.image.map(async (img, index) => {
      const imgaeFileName =
      `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`
      await sharp(img.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .toFile(`uploads/products/${imgaeFileName}`)
      req.body.images.push(imgaeFileName)
    })
  }
  next()
}

const createProduct = async (req, res) => {
  req.body.slug = slugify(req.body.title)
  const product = await Product.create(req.body)
  res.status(201).json({ product })
}

const getAllProducts = async (req, res) => {
  const query = buildQuery(Product, req.query)
  const products = await executeQuery(query)

  if (products.length === 0) {
    throw new NotFoundError('No products found.')
  }
  res.status(200).json({ NoHits: products.length, products })
}

const getProduct = async (req, res) => {
  res.status(200).json({ product: req.product })
}

const updateProduct = async (req, res) => {
  req.body.slug = slugify(req.body.title)
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )
  if (!product) {
    throw new NotFoundError(`No product with id: ${req.product._id}`)
  }
  res.status(200).json({ product })
}

const deleteProduct = async (req, res) => {
  await del(req, Product)
  res.status(204).send()
}

export default {
  getAllProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
  uploadImages,
  resizeImages
}
