import mongoose from 'mongoose'

const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, 'already exists'],
      minlength: [3, 'Too short'],
      maxlength: [32, 'Too long']
    },
    slug: {
      type: String,
      lowercase: true
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'Subcategory must be belong to parent category']
    }
  },
  { timestamps: true }
)

export default mongoose.model('SubCategory', SubCategorySchema)
