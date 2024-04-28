import multer from 'multer'
import { BadRequestError } from '../errors/index.js'

// memory storage engine
const multerStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new BadRequestError('Images only'), false)
  }
}

const uploadSingleImage = (fieldName) =>
  multer({ storage: multerStorage, fileFilter }).single(fieldName)
const uploadImages = (fieldName) =>
  multer({ storage: multerStorage, fileFilter }).fields(fieldName)

export default { uploadSingleImage, uploadImages }
