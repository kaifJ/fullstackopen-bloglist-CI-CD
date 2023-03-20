const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    if (!blogs || blogs.length === 0)
        return 0

    let totalLikes = 0
    blogs.forEach(blog => {
        totalLikes += blog.likes
    })

    return totalLikes
}

const favouriteBlog = blogs => {
    let favBlog = {
        title: '',
        author: '',
        likes: 0
    }

    for (let blog of blogs) {
        if (blog.likes > favBlog.likes) {
            favBlog.likes = blog.likes
            favBlog.title = blog.title
            favBlog.author = blog.author
        }
    }

    return favBlog
}

const mostBlogs = blogs => {
    let authors = {}
    for (let blog of blogs) {
        if (authors[blog.author]) {
            authors[blog.author].blogs += 1
        } else {
            authors[blog.author] = {
                author: blog.author,
                blogs: 1
            }

        }
    }

    return _.maxBy(Object.values(authors), 'blogs')
}

const mostLikes = blogs => {
    let likes = {}
    for (let blog of blogs) {
        if (likes[blog.author]) {
            likes[blog.author].likes += blog.likes
        } else {
            likes[blog.author] = {
                author: blog.author,
                likes: blog.likes
            }
        }
    }

    return _.maxBy(Object.values(likes), 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs,
    mostLikes
}