import React from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users'

const User = () => {
    const userId = useParams().id
    const [user, setUser] = React.useState(null)

    React.useEffect(() => {
        userService.getUser(userId).then(result => setUser(result))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return user ? (
        <div>
            <h3>added blogs</h3>
            <ul>
                {user.blogs.map(blog => (<li key={blog.title}>{blog.title}</li>))}
            </ul>

        </div>
    ) : null
}

export default User