import slugify from 'slugify'
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import Brand from '../models/Brand.js'
import {
  buildQuery,
  executeQuery
} from '../utils/api-features/index.js'
import del from './utils/handlers-factory.js'
import { NotFoundError } from '../errors/index.js'
import upload from '../middleware/upload-image.js'

const uploadImage = upload.uploadSingleImage('image')

const resizeImage = async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .toFile(`uploads/brands/${fileName}`)

    req.body.image = fileName
  }
  next()
}

const createBrand = async (req, res) => {
  const { name, image } = req.body
  const brand = await Brand.create({
    name,
    slug: slugify(name),
    image
  })
  res.status(201).json({ brand })
}

const getAllBrands = async (req, res) => {
  const query = buildQuery(Brand, req.query)
  const brands = await executeQuery(query)

  if (brands.length === 0) {
    throw new NotFoundError('No brands found.')
  }
  res.status(200).json({ NoHits: brands.length, brands })
}

const getBrand = (req, res) => {
  res.status(200).json({ Brand: req.brand })
}

const updateBrand = async (req, res) => {
  req.body.slug = slugify(req.body.name)
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  )

  if (!brand) {
    throw new NotFoundError('No category Found for id')
  }
  res.status(200).json({ brand })
}

const deleteBrand = async (req, res) => {
  await del(req, Brand)
  res.status(204).send()
}

export default {
  createBrand,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadImage,
  resizeImage
}
