import mongoose from 'mongoose'

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    unique: [true, 'Brand name must be unique'],
    minlength: [2, 'Too short'],
    maxlength: [20, 'Too long']
  },
  slug: {
    type: String,
    lowercase: true
  },
  image: {
    type: String
  }
})

const setImageURL = (doc) => {
  const imageURL = `${process.env.BASE_URL}/brands/${doc.image}`
  doc.image = imageURL
}

BrandSchema.post('init', (doc) => {
  setImageURL(doc)
})

BrandSchema.post('save', (doc) => {
  setImageURL(doc)
})

export default mongoose.model('Brand', BrandSchema)
