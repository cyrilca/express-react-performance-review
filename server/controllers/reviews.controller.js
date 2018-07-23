import passport from 'passport'
import jwt from 'jsonwebtoken'
import Review from '../models/review';
import Password from './../utils/password'
import mongoose from 'mongoose'

export default {

  getReviews: async (req, res) => {
    let query = {}

    // For not admins, display only employees
    if (req.user.type !== 'admin') {
      query = { 'participants.author': { $in: req.user._id } } 
    }

    const reviewsList = await Review.find(query).sort('-createdAt').populate('target participants', '-password').lean()

    return res.json(reviewsList)
  },

  addReview: async (req, res) => {
    const { participants, target, body } = req.body
    const participantsFormatted = participants.map(e => ({
      author: e
    }))

    try {
      const newReview = await Review.create({
        author: req.user._id,
        target,
        body,
        participants: participantsFormatted
      })
      return res.json({ success: true })
    } catch (err) {
      console.log(err)
      return res.status(400).json({ error: 'Cannot create new review' })
    }
  },

  getReviewById: async (req, res) => {
    const { id } = req.params
    const review = await Review.findOne({
      _id: mongoose.Types.ObjectId(id)
    }).populate('author target participants.author', '-password -participants.author.password').lean()
    // Show all reviews for admin only
    if (req.user.type !== 'admin') {
      review.participants = review.participants.filter(e =>
        req.user._id.toString() === e.author._id.toString()
      )
    }

    return res.json(review)
  },

  deleteReviewById: async (req, res) => {
    const { id } = req.params
    // Allow delete to admins only
    if (req.user.type === 'admin') {
      try {
        await Review.remove({ _id: id })
        return res.json({ success: true })
      } catch (err) {
        return res.status(400).json({ error: 'Unable to delete review' })
      }
    }
  },

  submitFeedback: async (req, res) => {
    const { id } = req.params
    const { content } = req.body
    // Find review by id
    try {
      const review = await Review.update(
        { _id: id, 'participants.author': req.user._id },
        {
          '$set': {
            'participants.$.content': content,
            'participants.$.submitted': true,
            'participants.$.date': new Date()
          }
        }
      )
      return res.json({ success: true })
    } catch (err) {
      return res.status(400).json({ error: 'Unable to submit feedback' })
    }
  }

}