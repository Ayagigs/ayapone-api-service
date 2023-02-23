import mongoose from 'mongoose'
import { EUserRole } from '../enums/EUserRole.js'

const userSchema = new mongoose.Schema(
  {
    last_name: {
      type: String,
      required: [true, 'Please enter your Last name.'],
    },
    first_name: {
      type: String,
      required: [true, 'Please enter your First Name.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: [true, 'Email already used by another user']
    },
    username: {
      type: String,
      unique: [true, 'Username already used by another user']
    },
    phone_number: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    password_reset_token: {
      type: String,
    },
    user_role: {
      type: String,
      enum: EUserRole,
      default: EUserRole.BUYER,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
    },
  },
)

userSchema.virtual('full_name').get(function () {
  return this.first_name + ' ' + this.last_name;
})

userSchema.methods.toJSON = function () {
  var obj = this.toObject()
  delete obj.password
  delete obj.password_reset_token
  delete obj.__v
  return obj
}

export const User = mongoose.model('users', userSchema)
