import crypto from 'crypto'

import
{
  NotFoundError,
  InternalServerError,
  BadRequestError
} from '../errors/index.js'
import User from '../models/User.js'
import jwt from '../utils/jwt/index.js'
import sendEmail from '../utils/sendEmail.js'

const register = async (req, res) => {
  const { name, email, password } = req.body
  let { role } = req.body
  if (!role) {
    const isFirstAccount = (await User.countDocuments({})) === 0
    role = isFirstAccount ? 'admin' : 'user'
  }

  const user = await User.create({ name, email, password, role })
  const token = await jwt.createToken(user)
  // jwt.attachTokensToCookies(token, res)

  res.status(201).json({ user, token })
}

const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !await user.comparePassword(password)) {
    throw new NotFoundError('Invalid Email or Password')
  }
  const { _id, name, role } = user
  const token = await jwt.createToken(user)
  // jwt.attachTokensToCookies(token, res)
  res.status(200).json({ data: { _id, name, role }, token })
}

const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000)
  })
  res.status(200).json({ msg: 'logged out' })
}

const changePassword = async (req, res, next) => {
  const { id } = req.params
  const { password } = req.body
  const user = await User.findById(id)
  user.password = password
  user.passwordChangedAt = Date.now()
  user.save()
  res.status(200).json({ msg: 'Your password changed successfully' })
}

const forgotPassword = async (req, res, next) => {
  // Find if user exists by the submitted E-mail
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('There is no user with this E-mail')
  }

  // Create hashed reset code (random 6-digit)
  const resetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode.toString())
    .digest('hex')
  user.passwordResetCode = hashedResetCode
  user.passworResetCodeExpires = Date.now() + 1000 * 60 * 10 // 10 mins
  user.passwordResetCodeVerified = false
  await user.save()

  // Send the reset code via email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Your password reset code (Note!: it is valid for 10 mins)',
      message: `Hello ${user.name}
      You have requested to reset the password of your E-shop account
      Please find the security code to change your password:
      ${resetCode}
      See you soon in our website
      E-shop team`
    })
  } catch (error) {
    user.passwordResetCode = undefined
    user.passworResetCodeExpires = undefined
    user.passwordResetCodeVerified = undefined
    await user.save()

    throw new InternalServerError('Can\'t send the resest code')
  }
  res.status(200).json({
    msg: 'Done Ya Bro!\n' +
         'Reset code has been sent successfully'
  })
}

const verifyResetPasswordCode = async (req, res, next) => {
  const { resetCode } = req.body
  const hashedResetCode = crypto
    .createHash('sha256')
    .update(resetCode)
    .digest('hex')

  const user = await User.findOne({
    passwordResetCode: hashedResetCode,
    passworResetCodeExpires: { $gt: Date.now() }
  })
  if (!user) {
    throw new NotFoundError('Invalid or expired reset code')
  }
  user.passwordResetCodeVerified = true
  await user.save()

  res.status(200).json({ msg: 'Verified Successfully' })
}

const resetPassword = async (req, res, next) => {
  const { email, newPassword } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError('No users for this email')
  }
  if (!user.passwordResetCodeVerified) {
    throw new BadRequestError('Reset code not verified')
  }
  user.password = newPassword
  user.passwordResetCodeVerified = undefined
  user.passworResetCodeExpires = undefined
  user.passwordResetCode = undefined
  await user.save()

  const token = await jwt.createToken(user)
  // jwt.attachTokensToCookies(token, res)
  res.status(200).json({ token })
}

export default {
  register,
  login,
  logout,
  changePassword,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword
}
