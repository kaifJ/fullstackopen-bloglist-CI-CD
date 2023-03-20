const userRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    let users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
    response.status(200).json(users)
})

userRouter.get('/:id', async (request, response) => {
    let user = await User.findById(request.params.id).populate('blogs', { url: 1, title: 1, author: 1 })
    response.status(200).json(user)
})

userRouter.post('/', async (request, response, next) => {
    let { password, username, name } = request.body
    if (!password) return response.status(400).send()

    if (password.length < 3) {
        next({
            name: 'ValidationError',
            message: 'Password Length should be atleast 3 characters'
        })
        return
    }


    const user = await User.findOne({ username })
    if (user)
        return response.status(400).json({
            error: 'Username should be unique'
        })

    const salt = 10, passwordHash = await bcrypt.hash(password, salt)

    let newUser = new User({
        passwordHash,
        name,
        username
    })
    let savedUser = await newUser.save()
    response.status(201).json(savedUser)

})

module.exports = userRouter