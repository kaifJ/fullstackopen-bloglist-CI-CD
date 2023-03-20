import Blog from './Blog'

const Blogs = props => {
    return <div className='blog-container'>
        {props.blogs.map(blog =>
            <Blog key={blog.id} blog={blog} fetchAllBlogs={props.fetchBlogs} />
        )}
    </div>
}

export default Blogs