/* eslint-disable no-unused-vars */
import { useState } from 'react'
import blogServices from '../services/blogs'
import { Link } from 'react-router-dom'

const Blog = (props) => {
    const [visible, setVisible] = useState(false)
    const [blog, setBlog] = useState(props.blog)
    let username = JSON.parse(window.localStorage.getItem('loggedInUser')) ? JSON.parse(window.localStorage.getItem('loggedInUser')).username : undefined

    // const toggleVisibility = () => {
    //     setVisible(prevState => setVisible(!prevState))
    // }

    const updateLike = () => {
        blogServices.updateBlog({
            likes: blog.likes + 1,
            id: blog.id
        }).then(result => {
            setBlog(() => {
                return { ...blog, likes: result.likes }
            })
        }).catch(err => {
            console.log(err)
        })
    }

    const deleteBlog = () => {
        if (window.confirm('Are you sure you want to delete this blog ? ')) {
            blogServices.deleteBlog(blog.id)
                .then(() => props.fetchAllBlogs())
                .catch(err => console.log(err))
        }
    }

    return (
        <div className='individual-blog'>
            <div>
                <Link to={`/blogs/${blog.id}`}> <span className='title-span'>{blog.title}</span></Link>
                {/* <button className='toggleButton' onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
        <div className="author-div">
          {blog.author}
        </div> */}
            </div>
            {visible ? <>
                <div className='url-div'>
                    {blog.url}
                </div>
                <div className='like-div'>
                    <span>Likes {blog.likes}</span>
                    <button id="like-button" onClick={props.updateLike || updateLike}>Like</button>
                </div>
                {username === blog.user.username ?
                    <button id="delete-button" onClick={deleteBlog}>Delete</button> :
                    null}
            </> : null}

        </div>
    )
}
export default Blog