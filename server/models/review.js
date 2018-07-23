import mongoose from 'mongoose'
const Schema = mongoose.Schema

const reviewSchema = mongoose.Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  target: { type: Schema.Types.ObjectId, ref: 'User' },
  body: String,
  participants: [
    {
      author: { type: Schema.Types.ObjectId, ref: 'User' },
      content: { type: String, default: '' },
      submitted: { type: Boolean, default: false },
      date: Date
    }
  ]
}, {
    _id: true,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
  }
)

let User = mongoose.model('Review', reviewSchema)

export default User