import React from 'react'
import userService from '../services/users'
import { Link } from 'react-router-dom'

const Users = () => {
    const [users, setUsers] = React.useState([])

    React.useEffect(() => {
        userService.getUsers().then(result => setUsers(result))
    }, [])

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                    {users.map(user => (
                        <tr key={user.id}>
                            <Link to={`/users/${user.id}`}>{user.name}</Link>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Users