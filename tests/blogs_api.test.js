const mongoose = require('mongoose')
const Blog = require('../models/blog')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./api_helper')
const User = require('../models/user')

const api = supertest(app)
let token = ''
let user = ''

describe("blog api testing", () => {
    beforeAll(async () => {
        await User.deleteMany({})

        let newUser = await api.post('/api/users')
            .send({ username: 'blogAuthor', password: 'Hello', name: 'Kaif' })
            .expect(201)

        user = newUser.body

        let loggedInUser = await api.post('/api/login')
            .send({ username: 'blogAuthor', password: 'Hello' })
            .expect(201)

        token = loggedInUser.body.token
    })

    beforeEach(async () => {
        await Blog.deleteMany({})
        await helper.insertMany(user.id)
    })

    test('Blogs are returned in JSON format', async () => {
        api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
        expect(response.body)
    })

    test('id is defined', async () => {
        const result = await Blog.findById(helper.initialBlogs[0]._id)
        expect(result.id).toBeDefined()
    })

    test('adding a new blog', async () => {
        const newBlog = {
            title: 'A new blog',
            author: 'Kaif',
            url: 'https://www.google.com',
            likes: 10,
            user: user.id
        }

        await api.post('/api/blogs')
            .send(newBlog)
            .set({ Authorization: `Bearer ${token}` })
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const responses = await api.get('/api/blogs').expect(200)
        let contents = responses.body.map(blog => {
            delete blog.id
            blog.user = user.id
            return blog
        })

        expect(responses.body).toHaveLength(helper.initialBlogs.length + 1)
        expect(contents).toContainEqual(newBlog)
    })

    test('test if new blog contains like property and is 0 bey default', async () => {
        const newBlog = {
            title: 'Testing blog without likes',
            author: 'Kaif',
            url: 'https://www.google.com',
            user: user.id
        }


        await api.post('/api/blogs')
            .expect(201)
            .set({ Authorization: `Bearer ${token}` })
            .send(newBlog)
            .expect('Content-Type', /application\/json/)

        const responses = await api.get('/api/blogs').expect(200)
        expect(responses.body).toHaveLength(helper.initialBlogs.length + 1)

        let lastBlog = responses.body[helper.initialBlogs.length]
        expect(lastBlog.likes).toBeDefined()
        expect(lastBlog.likes).toBe(0)
    })

    test('title should be required, should return 400 if title not given', async () => {
        const newBlog = {
            author: 'Kaif',
            url: 'https://www.google.com'
        }

        api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs').expect(200)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('url is required, should give 400 if url not given', async () => {
        const newBlog = {
            title: 'No url in this blog',
            author: 'Kaif'
        }

        api.post('/api/blogs')
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs').expect(200)
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('update likes of a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        let updatedLikes = {
            likes: 100
        }

        await api.put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedLikes)
            .expect(200)

        const result = await api.get(`/api/blogs/${blogToUpdate.id}`)
        expect(result.body.likes).toBe(100)
    })

    test('delete blog by id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api.delete(`/api/blogs/${blogToUpdate.id}`)
            .set({ authorization: `Bearer ${token}` })
            .expect(204)

        const response = await helper.blogsInDb()
        expect(response.length).toBe(helper.initialBlogs.length - 1)
    })


    afterAll(() => {
        mongoose.connection.close()
    })
})