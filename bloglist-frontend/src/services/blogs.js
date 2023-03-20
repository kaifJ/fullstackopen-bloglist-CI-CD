/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const request = axios.get(baseUrl)
    const response = await request
    return response.data
}

const getBlogById = async (id) => {
    const request = axios.get(`${baseUrl}/${id}`)
    const response = await request
    return response.data
}

const createBlog = async (blog) => {
    const config = {
        headers: { Authorization: token }
    }

    const request = axios.post(baseUrl, blog, config)
    const response = await request
    return response.data
}

const updateBlog = async blog => {
    const config = {
        headers: { Authorization: token }
    }

    const request = axios.put(`${baseUrl}/${blog.id}`, { likes: blog.likes }, config)
    const response = await request
    return response.data
}

const addComment = async blog => {
    const config = {
        headers: { Authorization: token }
    }

    const request = axios.patch(`${baseUrl}/${blog.id}`, { comment: blog.comment }, config)
    const response = await request
    return response.data
}

const deleteBlog = async id => {
    const config = {
        headers: { Authorization: token }
    }

    const request = axios.delete(`${baseUrl}/${id}`, config)
    const response = await request
    return response.data
}

export default { getAll, setToken, createBlog, updateBlog, deleteBlog, getBlogById, addComment }