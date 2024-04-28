import slugify from 'slugify'
import SubCategory from '../models/SubCategory.js'
import {
  buildQuery,
  executeQuery
} from '../utils/api-features/index.js'
import NotFoundError from '../errors/not-found.js'
import del from './utils/handlers-factory.js'

const createSubCategory = async (req, res) => {
  if (!req.body.category) req.body.category = req.params.category
  const { name, category } = req.body
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category
  })
  res.status(201).json({ subCategory })
}

const getAllSubCategories = async (req, res) => {
  const query = buildQuery(SubCategory, req.query)
  const subcategories = await executeQuery(query)

  if (subcategories.length === 0) {
    throw new NotFoundError('No subcategories found.')
  }
  res.status(200).json({ NoHits: subcategories.length, subcategories })
}

const getSubCategory = async (req, res) => {
  res.status(200).json({ Subcategory: req.subCategory })
}

const updateSubCategory = async (req, res) => {
  const { name, category } = req.body

  if (category) {
    req.subCategory.category = category
  }
  req.subCategory.name = name
  req.subCategory.slug = slugify(name)
  req.subCategory.save()

  res.status(200).json({ subcategory: req.subCategory })
}

const deleteSubCategory = async (req, res) => {
  await del(req, SubCategory)
  res.status(204).send()
}

export default {
  createSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory
}
