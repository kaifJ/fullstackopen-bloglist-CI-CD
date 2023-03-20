const express = require('express')
const cors = require('cors')
require('express-async-errors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const tokenExtractor = require('./middleware/tokenExtractor')
// const userExtractor = require('./middleware/userExtractor')

const app = express()

const mongoUrl = config.MONGODB_URI
console.log(mongoUrl)
mongoose.connect(mongoUrl)
    .then(() => logger.info('Connected to DB'))
    .catch(() => logger.error('Could not connect'))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(tokenExtractor)
// app.use(userExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({
            error: error.message
        })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }
    next(error)
}

app.use(errorHandler)

module.exports = app