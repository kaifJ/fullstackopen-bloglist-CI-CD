const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log('Connected to db')
    }).catch(() => {
        console.log('Error in connecting to db')
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function (number) {
                return /\d{2}-\d{6}|\d{3}-\d{5}/.test(number)
            },
            message: 'Phone Number format is not correct. Please use either 2 or 3 numbers before "-" And total length should be 8'
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, requiredObject) => {
        requiredObject.id = requiredObject._id.toString()
        delete requiredObject._id
        delete requiredObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)