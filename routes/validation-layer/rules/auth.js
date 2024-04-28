import pkg from 'express-validator'
import validator from '../validators/validator.js'
import User from '../../../models/User.js'
import { BadRequestError, NotFoundError } from '../../../errors/index.js'
// import bcrypt from 'bcryptjs'

const registerValid = [
  pkg
    .body('name')
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name is short')
    .isLength({ max: 20 })
    .withMessage('Name is long')
    .bail()
    .custom(async (name) => {
      const user = await User.findOne({ name })
      if (user) {
        throw new BadRequestError(`${name} already exists`)
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
  validator
]

const loginValid = [
  pkg
    .body('email')
    .notEmpty()
    .withMessage('E-mail is required')
    .bail()
    .isEmail()
    .withMessage('Please, provide valid E-mail')
    .bail(),
  pkg
    .body('password')
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password is short')
    .isLength({ max: 12 })
    .withMessage('Password is long')
    .bail(),
  validator
]

const changePasswordValid = [
  pkg
    .check('id')
    .isMongoId()
    .withMessage('It is not mongo id'),
  pkg
    .body('currentPassword')
    .notEmpty()
    .withMessage('Current Password feild is required'),
  pkg
    .body('passwordConfirm')
    .notEmpty()
    .withMessage('Password Confirm feild is required'),
  pkg
    .body('password')
    .notEmpty()
    .withMessage('Password feild is required')
    .bail()
    .custom(async (pass, { req }) => {
      const user = await User.findById(req.params.id)
      if (!user) {
        throw new NotFoundError('There is no user for this id')
      }
      const isMatch = await user.comparePassword(req.body.currentPassword)
      if (!isMatch) {
        throw new NotFoundError('Incorrect currentPassword')
      }
      if (pass === req.body.currentPassword) {
        throw new BadRequestError(
          'Wrong Password!!!'
        )
      }
      if (pass !== req.body.passwordConfirm) {
        throw new BadRequestError('password confirmation incorrect')
      }
    }),
  validator
]

export default { registerValid, loginValid, changePasswordValid }
