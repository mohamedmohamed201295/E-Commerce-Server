import pkg from 'express-validator'

import validator from '../validators/validator.js'
import User from '../../../models/User.js'
import { NotFoundError, BadRequestError } from '../../../errors/index.js'

const getUserValidator = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (userId, { req }) => {
      const user = await User.findById(userId)
      if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`)
      }
      req.user = user
    }),
  validator
]

const createUserValidator = [
  pkg
    .check('name')
    .notEmpty()
    .withMessage('User name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .bail()
    .custom(async (userName) => {
      const user = await User.findOne({ name: userName })
      if (user) {
        throw new BadRequestError(`${user.name} is already exists`)
      }
    }),
  pkg
    .body('email')
    .notEmpty()
    .withMessage('E-mail is required')
    .bail()
    .isEmail()
    .withMessage('Please, provide valid E-mail')
    .bail()
    .custom(async (email) => {
      const existEmail = await User.findOne({ email })
      if (existEmail) {
        throw new BadRequestError(`${email} already exists`)
      }
    }),
  pkg
    .body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password is short')
    .isLength({ max: 12 })
    .withMessage('Password is long'),
  pkg
    .body('role')
    .optional()
    .notEmpty()
    .withMessage('Please, provide your role')
    .bail()
    .custom(async (role) => {
      const validRules = ['user', 'admin', 'manager']
      const isValidRole = validRules.includes(role)
      if (!isValidRole) {
        throw new BadRequestError('Invalid role')
      }
    }),
  validator
]

const updateUserValidator = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (userId, { req }) => {
      const user = await User.findById(userId)
      if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`)
      }
      req.user = user
    }),
  pkg
    .check('name')
    .optional()
    .notEmpty()
    .withMessage('User name must be provided')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Too short name')
    .isLength({ max: 32 })
    .withMessage('Too long name')
    .bail()
    .custom(async (userName) => {
      const user = await User.findOne({ name: userName })
      if (user) {
        throw new BadRequestError(`${user.name} is already exists`)
      }
    }),
  pkg
    .body('email')
    .optional()
    .notEmpty()
    .withMessage('E-mail is required')
    .bail()
    .isEmail()
    .withMessage('Please, provide valid E-mail')
    .bail()
    .custom(async (email) => {
      const existEmail = await User.findOne({ email })
      if (existEmail) {
        throw new BadRequestError(`${email} already exists`)
      }
    }),
  pkg
    .body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password is short')
    .isLength({ max: 12 })
    .withMessage('Password is long'),
  pkg
    .body('role')
    .optional()
    .notEmpty()
    .withMessage('Please, provide your role')
    .bail()
    .custom(async (role) => {
      const validRules = ['user', 'admin', 'manager']
      const isValidRole = validRules.includes(role)
      if (!isValidRole) {
        throw new BadRequestError('Invalid role')
      }
    }),
  validator
]

const deleteUserValidator = [
  pkg
    .param('id')
    .isMongoId()
    .withMessage('Invalid id')
    .bail()
    .custom(async (userId, { req }) => {
      const user = await User.findById(userId)
      if (!user) {
        throw new NotFoundError(`No user found with id: ${userId}`)
      }
    }),
  validator
]

export default {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator
}
