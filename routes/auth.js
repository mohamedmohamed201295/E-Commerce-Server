import express from 'express'
import authController from '../controllers/auth.js'
import validationLayer from './validation-layer/rules/auth.js'

const router = express.Router()
const {
  register,
  login,
  changePassword,
  logout,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword
} = authController
const { registerValid, loginValid, changePasswordValid } = validationLayer

router.post('/register', registerValid, register)
router.post('/login', loginValid, login)
router.post('/forgotPassword', forgotPassword)
router.post('/verifyResetPasswordCode', verifyResetPasswordCode)
router.put('/resetPassword', resetPassword)
router.put('/changePassword/:id', changePasswordValid, changePassword)
router.get('/logout', logout)

export default router
