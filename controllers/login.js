const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { password, username } = request.body

    const user = await User.findOne({ username })
    const passwordCorrect = user === null ?
        false :
        await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect))
        return response.status(401).json({
            error: 'invalid username or password'
        })

    const userTokenInfo = {
        username,
        id: user._id
    }

    const token = await jwt.sign(userTokenInfo, process.env.SECRET)
    return response.status(201).send({
        token,
        username: user.username,
        name: user.name
    })
})

module.exports = loginRouter