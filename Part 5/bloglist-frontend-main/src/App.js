import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [eventMessage, setEventMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setIsError(true)
      setEventMessage('wrong username or password')
      setTimeout(() => {
        setEventMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    try {
      window.localStorage.removeItem('loggedBlogappUser')
      setUser(null)
    } catch(exception){
      setIsError(true)
      setEventMessage('something went wrong during logout')
      setTimeout(() => {
        setEventMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  const handleNewBlog = async (blogObject) => {
    try{
      const result = await blogService
        .create(blogObject)
      setBlogs(blogs.concat(result))
      console.log(result)
      setEventMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setEventMessage(null)
      }, 5000)
    } catch(exception){
      setIsError(true)
      setEventMessage('Couldn\'t add the blog')
      setTimeout(() => {
        setEventMessage(null)
        setIsError(false)
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if ( !user ) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification eventMessage={eventMessage} isError={isError}/>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification eventMessage={eventMessage} isError={isError}/>
      <p>{user.name} logged in <button type="submit" onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel='create new blog'>
        <BlogForm
          createBlog={handleNewBlog}
          setEventMessage={setEventMessage}
          setIsError={setIsError}
        />
      </Togglable>

      {blogs.sort((a, b) => b.likes - a.likes).map(blog => <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setIsError={setIsError} setEventMessage={setEventMessage} user={user} />)}

    </div>
  )
}

export default App