import slugify from 'slugify'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import Category from '../models/Category.js'
import upload from '../middleware/upload-image.js'
import del from './utils/handlers-factory.js'
import { NotFoundError } from '../errors/index.js'
import {
  buildQuery,
  executeQuery
} from '../utils/api-features/index.js'

const uploadImage = upload.uploadSingleImage('image')

const resizeImage = async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .toFile(`uploads/categories/${fileName}`)

    req.body.image = fileName
  }
  next()
}

const createCategory = async (req, res) => {
  const { name, image } = req.body
  const category = await Category.create({
    name,
    slug: slugify(name),
    Image: image
  })
  res.status(201).json({ category })
}

const getAllCategories = async (req, res) => {
  const query = buildQuery(Category, req.query)
  const categories = await executeQuery(query)

  if (categories.length === 0) {
    throw new NotFoundError('No categories found.')
  }
  res.status(200).json({ NoHits: categories.length, categories })
}

const getCategory = async (req, res) => {
  res.status(200).json({ Category: req.category })
}

const updateCategory = async (req, res) => {
  const { id } = req.params

  const { name, image } = req.body

  const slug = slugify(name)

  const category = await Category.findByIdAndUpdate(
    id,
    { name, slug, image },
    { new: true }
  )

  if (!category) {
    throw new NotFoundError(`No category Found for id: ${id}`)
  }
  res.status(200).json({ Category: category })
}

const deleteCategory = async (req, res) => {
  await del(req, Category)
  res.status(204).send()
}

export default {
  getAllCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage
}
