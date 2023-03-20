import React from 'react'
import blogServices from '../services/blogs'

const CommentForm = ({ blogId, fetchBlog }) => {
    const [comment, setComment] = React.useState('')

    const handleChange = e => {
        setComment(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        blogServices.addComment({
            id: blogId,
            comment
        }).then(() => {
            setComment('')
            fetchBlog()
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={comment}
                onChange={handleChange}
                name='comment'
                placeholder='comment'
            />
            <button type="submit">add comment</button>
        </form>
    )
}

export default CommentForm