import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: [true, 'Category must be unique'],
      minlength: [3, 'Too short'],
      maxlength: [32, 'Too long']
    },
    slug: {
      type: String,
      lowercase: true
    },
    Image: {
      type: String
    }
  },
  { timestamps: true }
)

const setImageURL = (doc) => {
  if (doc.Image) {
    const imageURL = `${process.env.BASE_URL}/categories/${doc.Image}`
    doc.Image = imageURL
  }
}

CategorySchema.post('init', (doc) => {
  setImageURL(doc)
})

CategorySchema.post('save', (doc) => {
  setImageURL(doc)
})

export default mongoose.model('Category', CategorySchema)
