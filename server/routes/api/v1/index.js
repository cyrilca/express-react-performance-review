const express = require('express')
const router = express.Router()
import passport from 'passport'

import UserController from './../../../controllers/user.controller'
import ReviewsController from './../../../controllers/reviews.controller'
const auth = passport.authenticate('jwt', { session: false })

router.get('/', (req, res) => res.sendStatus(200))
router.post('/account/login', UserController.signIn)

router.get('/account', auth, UserController.getInfo)
router.post('/employees', auth, UserController.addEmployee)
router.get('/employees', auth, UserController.employeeList)
router.delete('/employees/:id', auth, UserController.deleteEmployee)

router.get('/reviews', auth, ReviewsController.getReviews)
router.post('/reviews', auth, ReviewsController.addReview)
router.put('/reviews/:id', auth, ReviewsController.submitFeedback)
router.get('/reviews/:id', auth, ReviewsController.getReviewById)
router.delete('/reviews/:id', auth, ReviewsController.deleteReviewById)

module.exports = router