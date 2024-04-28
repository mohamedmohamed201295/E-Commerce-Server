import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'

import User from '../models/User.js'
import {
  buildQuery,
  executeQuery
} from '../utils/api-features/index.js'
import { NotFoundError } from '../errors/index.js'
import upload from '../middleware/upload-image.js'
import del from './utils/handlers-factory.js'

const uploadImage = upload.uploadSingleImage('image')

const resizeImage = async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .toFile(`uploads/users/${fileName}`)

    req.body.image = fileName
  }
  next()
}

const getAllUsers = async (req, res, next) => {
  const query = buildQuery(User, req.query)
  const users = await executeQuery(query)
  if (users.length === 0) {
    throw new NotFoundError('No users found.')
  }
  res.status(200).json({ NoHits: users.length, users })
}

const getUser = (req, res, next) => {
  res.status(200).json({ User: req.user })
}

const createUser = async (req, res, next) => {
  const user = await User.create(req.body)
  res.status(201).json({ user })
}

const updateUser = async (req, res, next) => {
  // const { id } = req.params
  const { name, email, password, role } = req.body
  // const user = await User.findByIdAndUpdate(id, req.body, { new: true })
  if (name) {
    req.user.name = name
  }
  if (email) {
    req.user.email = email
  }
  if (password) {
    req.user.password = password
  }
  if (role) {
    req.user.role = role
  }
  await req.user.save()
  res.status(200).json({ user: req.user })
}

const deleteUser = async (req, res, next) => {
  await del(req, User)
  res.status(204).send()
}

const getLoggedUserData = (req, res, next) => {
  req.params.id = req.user._id
  next()
}
export default {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  uploadImage,
  resizeImage,
  getLoggedUserData
}
