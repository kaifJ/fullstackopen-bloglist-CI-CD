import { useState, useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'

import Blogs from './components/Blogs'
import Users from './components/Users'
import User from './components/User'
import Menu from './components/Menu'
import BlogItem from './components/BlogItem'

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notificaiton'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState('')
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)

    const blogFormRef = useRef()

    useEffect(() => {
        const loggedInUser = window.localStorage.getItem('loggedInUser')
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        fetchBlogs()
    }, [])

    const fetchBlogs = () => {
        blogService.getAll().then(blogs => {
            let sorted = blogs.sort((a, b) => {
                return a.likes < b.likes ? 1 : -1
            })
            setBlogs(sorted)
        }
        )
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            setSuccessMessage('Logged In Successfully')
            setTimeout(() => {
                setSuccessMessage('')
            }, 5000)

            blogService.setToken(user.token)
            window.localStorage.setItem('loggedInUser', JSON.stringify(user))

            setUser(user)
            setUsername('')
            setPassword('')
        } catch (error) {
            setErrorMessage('Wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLogOut = () => {
        setUser('')
        window.localStorage.removeItem('loggedInUser')
    }

    const createBlog = async (e) => {
        e.preventDefault()
        try {
            let blog = await blogService.createBlog({
                title,
                author,
                url
            })

            blogFormRef.current.toggleVisibility()
            setSuccessMessage('Blog Created Successfully')
            setTimeout(() => {
                setSuccessMessage('')
            }, 5000)


            setBlogs([...blogs, blog])

            setTitle('')
            setAuthor('')
            setUrl('')
        } catch (error) {
            setErrorMessage('Could not create blog')
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
    }

    if (!user) {
        return <div>
            <Notification message={errorMessage || successMessage} type={errorMessage ? 'error' : 'success'} />
            <LoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
            />
        </div>
    }

    return (
        <div>
            <Notification message={errorMessage || successMessage} type={errorMessage ? 'error' : 'success'} />
            {user ?
                <div>
                    <div style={{ display: 'flex', backgroundColor: '#D2D2D3' }}>
                        <Menu />
                        <span>{`${user.name} Logged in `}</span>
                        <button onClick={handleLogOut}>Logout</button>
                    </div>
                    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                        <BlogForm
                            title={title}
                            setTitle={setTitle}
                            author={author}
                            setAuthor={setAuthor}
                            url={url}
                            setUrl={setUrl}
                            createBlog={createBlog}
                        />
                    </Togglable>
                </div> :
                <LoginForm
                    username={username}
                    setUsername={setUsername}
                    password={password}
                    setPassword={setPassword}
                    handleLogin={handleLogin}
                />}
            <h2>blogs</h2>
            <Routes>
                <Route path='/' element={<Blogs fetchBlogs={fetchBlogs} blogs={blogs} />} />
                <Route path='/users' element={<Users />} />
                <Route path='/users/:id' element={<User />} />
                <Route path='/blogs/:id' element={<BlogItem />} />
            </Routes>

        </div>
    )
}

export default App
