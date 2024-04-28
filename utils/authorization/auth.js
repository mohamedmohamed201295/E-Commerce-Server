import jwt from 'jsonwebtoken'

import User from '../../models/User.js'
import { UnauthenticatedError, Forbidden } from '../../errors/index.js'

const getUserById = async (userId) => {
  const user = await User.findById(userId)
  if (!user) {
    throw new UnauthenticatedError('User not found')
  }
  return user
}

const checkPasswordChanged = (user, tokenIssuedAt) => {
  if (user.passwordChangedAt) {
    const passChangedTimestamp = user.passwordChangedAt.getTime() / 1000
    if (passChangedTimestamp > tokenIssuedAt) {
      throw new UnauthenticatedError(
        'Please log in again.'
      )
    }
  }
}

const protect = async (req, res, next) => {
  // VerifyToken
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Please provide a valid token')
  }
  const token = authHeader.split(' ')[1]

  // DecodeToken
  if (!token) {
    throw new UnauthenticatedError('Invalid or expired token')
  }
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

  const currentUser = await getUserById(decodedToken.userId)
  checkPasswordChanged(currentUser, decodedToken.iat)
  req.user = currentUser
  next()
}

const allowedTo = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new Forbidden('You are not authorized to access this route')
    }
    next()
  }
}

export default { protect, allowedTo }
