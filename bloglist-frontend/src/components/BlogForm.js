const BlogForm = props => {
    let {
        createBlog,
        title,
        setTitle,
        author,
        setAuthor,
        url,
        setUrl
    } = props

    return (
        <form onSubmit={createBlog}>
            <div>
                title:
                <input
                    type="text"
                    value={title}
                    name="title"
                    placeholder="title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={author}
                    name="author"
                    placeholder="author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={url}
                    name="url"
                    placeholder="url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm