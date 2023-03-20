const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3
    },
    name: String,
    passwordHash: {
        type: String,
        required: true,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
})

userSchema.set('toJSON', {
    transform: (document, requiredObject) => {
        requiredObject.id = requiredObject._id
        delete requiredObject._id
        delete requiredObject.__v
        delete requiredObject.passwordHash
    }
})

module.exports = mongoose.model('User', userSchema)