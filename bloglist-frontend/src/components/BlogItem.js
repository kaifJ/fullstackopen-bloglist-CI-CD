import React from 'react'
import { useParams } from 'react-router-dom'
import blogServices from '../services/blogs'
import CommentForm from './CommentForm'

const BlogItem = () => {
    const blogId = useParams().id
    const [blog, setBlog] = React.useState(null)

    React.useEffect(() => {
        fetchBlog()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchBlog = () => {
        blogServices.getBlogById(blogId).then(result => setBlog(result))
    }

    const updateLike = () => {
        blogServices.updateBlog({
            likes: blog.likes + 1,
            id: blog.id
        }).then((result) => {
            setBlog({ ...blog, likes: result.likes })
        })
    }

    return blog ? (
        <div>
            <h2>{blog.title}</h2>
            <a href={`${blog.url}`}>{blog.url}</a><br />
            <span>{blog.likes} likes <button onClick={updateLike}>Like</button></span><br />
            <span>added by {blog.author}</span><br /><br />
            <CommentForm blogId={blog.id} fetchBlog={fetchBlog} />
            <h4>Comments</h4>
            <ul>
                {blog.comments.map((comment, index) => <li key={`${comment}~${index}`}>{comment}</li>)}
            </ul>
        </div >
    ) : null
}

export default BlogItem