require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'))

// const generateId = () => {
//     return parseInt(Math.random() * 10000000000)
// }

const PORT = process.env.PORT || 3001

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/persons', async (request, response) => {
    const persons = await Person.find({})
    response.json(persons)
})

app.get('/info', async (request, response) => {
    const persons = await Person.find({})
    let html = `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(html)
})

app.get('/api/persons/:id', async (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person)
            response.json(person)
        else response.status(404).end()
    }).catch(err => next(err))
})

app.post('/api/persons', async (request, response, next) => {
    const body = request.body

    if (!body.number || !body.name) {
        let errorMessage = !body.number ?
            'number is missing' :
            'name is missing'

        return response.status(400).send({
            error: errorMessage
        })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    const savedEntry = await newPerson.save().catch(err => next(err))
    return response.json(savedEntry)
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
    const person = {
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(result => {
            response.json(result)
        }).catch(err => next(err))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})