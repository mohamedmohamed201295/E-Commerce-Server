import { validationResult } from 'express-validator'

const validationFunc = (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({ result: result.array() })
  }
  next()
}

export default validationFunc
