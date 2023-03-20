const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const userExtractor = require('../middleware/userExtractor')

// const getToken = (request) => {
//     const authorization = request.get('authorization')
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//         return authorization.substring(7)
//     }
//     return null
// }

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
    const blog = new Blog(request.body)
    // const token = getToken(request)

    // const decodedToken = jwt.verify(token, process.env.SECRET)
    // if (!decodedToken.id) {
    //     return response.status(401).json({ error: 'token missing or invalid' })
    // }

    let user = await User.findById(request.user)
    blog.user = user._id
    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()
    response.status(201).json(result)
})

blogRouter.get('/:id', async (request, response) => {
    let blog = await Blog.findById(request.params.id)
    if (!blog) return response.status(400).end()

    response.json(blog.toJSON())
})

blogRouter.put('/:id', async (request, response) => {
    let updatedValues = {
        likes: request.body.likes
    }

    try {
        let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, updatedValues, { new: true })
        return response.send(updatedBlog.toJSON())
    } catch (error) {
        return response.status(500).json(error)
    }
})

blogRouter.patch('/:id', async (request, response) => {
    let BlogToUpdate = await Blog.findById(request.params.id)
    BlogToUpdate.comments.push(request.body.comment)

    await BlogToUpdate.save()
    response.status(204).send()
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (blog.user.toString() !== request.user) {
        return response.status(401).send({
            message: 'invalid token'
        })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})


module.exports = blogRouter