import express from 'express'

import userController from '../controllers/user.js'
import auth from '../utils/authorization/auth.js'
import validationLayer from './validation-layer/rules/user.js'

const router = express.Router()
const {
  getAllUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
  uploadImage,
  resizeImage,
  getLoggedUserData
} = userController
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator
} = validationLayer

router.get(
  '/getMe',
  auth.protect,
  getLoggedUserData,
  getUser
)

router.use(auth.protect, auth.allowedTo('admin', 'manager'))

router.get('/', getAllUsers)
router.route('/:id')
  .get(getUserValidator, getUser)
  .put(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser)
router.post('/', uploadImage, resizeImage, createUserValidator, createUser)

export default router
