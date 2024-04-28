import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      unique: [true, 'The Product already exists'],
      trim: true,
      minlength: [3, 'Product title is too short'],
      maxlength: [100, 'Product title is too long']
    },
    slug: {
      type: String,
      required: [true, 'Do not forget slug'],
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [20, 'Product description is too short']
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is required']
    },
    sold: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      trim: true,
      max: [1000000, 'Too much']
    },
    priceAfterDiscount: {
      type: Number
    },
    colors: {
      type: [String]
    },
    imageCover: {
      type: String,
      required: [true, 'Product image is required']
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required']
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory'
      }
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand'
    },
    ratingsAverage: {
      type: Number,
      min: [1, 'lower than 1'],
      max: [5, 'grater than 5']
    },
    ratingQuantity: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageURL = `${process.env.BASE_URL}/products/${doc.imageCover}`
    doc.imageCover = imageURL
  }
  if (doc.images) {
    const images = []
    doc.images.forEach((img) => {
      const imageURL = `${process.env.BASE_URL}/products/${img}`
      images.push(imageURL)
    })
    doc.images = images
  }
}

ProductSchema.post('init', (doc) => {
  setImageURL(doc)
})

ProductSchema.post('save', (doc) => {
  setImageURL(doc)
})

export default mongoose.model('Product', ProductSchema)
