import express from 'express'
import lusca from 'lusca'
import cors from 'cors'
import morgan from 'morgan'

const app = express()

const IS_DEV = process.env.NODE_ENV === 'development'
const PORT = IS_DEV ? 3000 : 3001

if (!IS_DEV) {
  app.use(lusca())
} else {
  app.use(morgan('dev'))
  app.use(cors())
}

require('./configure')(app)
require('./routes')(app)

app.listen(PORT, () => {
  console.log(`listening to ${PORT}`)
})