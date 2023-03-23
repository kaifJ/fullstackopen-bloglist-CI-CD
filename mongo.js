const mongoose = require('mongoose')

if (process.env.length < 3) {
    console.log('Please enter atleast one argument')
    return
}

let password = process.argv[2]
const url = `mongodb+srv://KaifJamadar:${password}@cluster0.ybzdgqw.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose.connect(url)
        .then(() => {
            Person.find({}).then(result => {
                result && result.forEach(row => console.log(`${row['name']} ${row['number']}`))
            }).catch(err => {
                console.log(err)
                console.log('Failed to fetch data')
            }).finally(() => {
                mongoose.connection.close()
            })
        }).catch(err => {
            console.log(err)
            console.log('Failed to establish connection')
        })

    return
}

if (process.argv.length < 5) {
    console.log('Please provide name and phone number')
    return
}

let [name, phoneNumber] = [process.argv[3], process.argv[4]]

mongoose.connect(url)
    .then(() => {
        console.log('Connection Successfully established')

        const newPerson = new Person({
            name,
            number: phoneNumber
        })

        return newPerson.save()
    }).then(() => {
        console.log(`Added ${name} ${phoneNumber} to phonebook`)
        mongoose.connection.close()
    }).catch(err => {
        console.log(err)
        console.log('Some error occured in either connection or saving to db')
    })