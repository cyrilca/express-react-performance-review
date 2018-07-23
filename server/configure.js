require('dotenv').config()

import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import User from './models/user'
import passport from 'passport'
import passportJWT from 'passport-jwt'

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy
const jwtOptions = {}

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

var jwtStrategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  // Good to have a cache here
  const userObject = await User.findOne({ _id: jwt_payload._id }).select('-password').lean()
  next(null, userObject || false)
})

module.exports = (app) => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  passport.use(jwtStrategy)
  app.use(passport.initialize())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
}
