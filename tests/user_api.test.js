const mongoose = require('mongoose')
const User = require('../models/user')
const helper = require('./user_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('User Route Testing', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await helper.insertMany()
    })

    test('intial number of users should be one', async () => {
        const users = await helper.usersInDb()
        expect(users.length).toBe(1)
    })

    test('trying to another user with existing username should throw error', async () => {
        const userData = {
            username: "root",
            name: "Something",
            password: "Something"
        }

        await api.post('/api/users')
            .send(userData)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toBe(helper.initialUsers.length)
    })

    test('username is required', async () => {
        const userData = {
            name: "something",
            password: "something"
        }

        await api.post('/api/users')
            .send(userData)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toBe(helper.initialUsers.length)
    })

    test('password is required', async () => {
        const userData = {
            name: "something",
            username: "something"
        }

        await api.post('/api/users')
            .send(userData)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toBe(helper.initialUsers.length)
    })

    test('username should have atleast 3 characters', async () => {
        const userData = {
            usename: 'he',
            password: "hello"
        }

        await api.post('/api/users')
            .send(userData)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toBe(helper.initialUsers.length)
    })

    test('password should have atleast 3 characters', async () => {
        const userData = {
            usename: 'hehello',
            password: "he"
        }

        await api.post('/api/users')
            .send(userData)
            .expect(400)

        const users = await helper.usersInDb()
        expect(users.length).toBe(helper.initialUsers.length)
    })

    afterAll(() => {
        mongoose.connection.close()
    })
})
