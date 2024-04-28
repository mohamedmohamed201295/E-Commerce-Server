import valid from 'validator'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: [true, 'Name must be unique'],
    minlength: [3, 'Too short'],
    maxlength: [20, 'Too long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: {
      validator: valid.isEmail,
      message: 'This is not an E-mail'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 8 characters long']
    // maxlength: [12, 'Password must be at most 12 character']
  },
  passwordChangedAt: Date,
  passwordResetCode: String,
  passworResetCodeExpires: Date,
  passwordResetCodeVerified: Boolean,
  role: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  }
},
{ timestamps: true }
)

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (pass) {
  return await bcrypt.compare(pass, this.password)
}

export default mongoose.model('User', UserSchema)
