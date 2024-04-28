import jwt from 'jsonwebtoken'

const createToken = async (payload) => {
  const token = jwt.sign(
    { userId: payload._id, name: payload.name, role: payload.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  )
  return token
}

export default createToken
