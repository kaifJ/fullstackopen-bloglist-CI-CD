const User = require('../models/user')

const initialUsers = [
    { username: 'root', name: 'superUser', passwordHash: 'SecretKey' }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const nonExistingUser = async () => {
    let user = new User({
        username: 'temp',
        passwordHash: 'Secret'
    })

    await user.save()
    await user.remove()
    return user._id.toString()
}

const insertMany = async () => {
    const users = initialUsers.map(user => new User(user))
    const promises = users.map(user => user.save())
    return Promise.all(promises)
}


module.exports = {
    usersInDb,
    initialUsers,
    nonExistingUser,
    insertMany,
}