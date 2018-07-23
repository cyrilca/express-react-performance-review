import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  type: String,
  permissions: [ { type: String, actions: [ String ] } ]
}, {
    _id: true,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

let User = mongoose.model('User', userSchema)

export default User