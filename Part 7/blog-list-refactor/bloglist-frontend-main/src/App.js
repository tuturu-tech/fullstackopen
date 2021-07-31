import './App.css'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs } from './reducers/blogReducer'
import { alreadyLogged, login, logout } from './reducers/loginReducer'
import { setNotification } from './reducers/notificationReducer'
import {
  Switch, Link, Route, useRouteMatch, Redirect
} from 'react-router-dom'
import { Navbar, Nav } from 'react-bootstrap'

import Blogs from './components/Blogs'
import Notification from './components/Notification'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Users from './components/Users'
import User from './components/User'
import Blog from './components/Blog'
import { initializeUsers } from './reducers/usersReducer'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)
  const blogs = useSelector(state => state.blogs)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const padding = {
    padding: 5,
    color: 'white'
  }


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      dispatch(login(username, password))
      setUsername('')
      setPassword('')
    } catch (exception) {

      dispatch(setNotification('wrong username or password', true, 5))
    }
  }

  const handleLogout = async (event) => {
    try {
      dispatch(logout())
    } catch(exception){
      dispatch(setNotification('couldn\'t log out', true, 5))
    }
  }

  useEffect(() => {
    dispatch(alreadyLogged())
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  const match = useRouteMatch('/users/:id')
  const displayUser = match
    ? users.find(user => user.id === match.params.id)
    : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const displayBlog = matchBlog
    ? blogs.find(blog => blog.id === matchBlog.params.id)
    : null

  if ( !user ) {
    return (
      <div className="container">
        <h2>login</h2>
        <Notification/>
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
    <div className="container">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#">Blog-app</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span" style={{ marginTop: 5 }}>
              <Link style={padding} to="/">blogs</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span" style={{ marginTop: 5 }}>
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <em style={{ color: 'white' }}>{user.name} logged in <button type="submit" onClick={handleLogout}>logout</button></em>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path="/users/:id">
          <User user={displayUser} />
        </Route>
        <Route path="/users">
          <Users users={users}/>
        </Route>
        <Route path="/blogs/:id">
          <h2>Blogs</h2>
          <Notification/>
          { displayBlog ? <Blog blog={displayBlog} /> : <Redirect to="/" />}
        </Route>
        <Route path="/">
          <div>
            <h2>Blogs</h2>
            <Notification/>
            <Togglable buttonLabel='create new blog'>
              <BlogForm />
            </Togglable>
            <Blogs blogs={blogs}/>
          </div>
        </Route>
      </Switch>
    </div>

  )
}

export default App