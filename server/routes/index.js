const express = require('express')
const router = express.Router()
const v1 = require('./api/v1')

module.exports = (app) => {
  app.use('/api/v1', v1)
}