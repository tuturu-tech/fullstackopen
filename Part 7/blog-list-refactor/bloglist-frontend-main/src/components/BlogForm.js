/* eslint-disable linebreak-style */
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Form, Button } from 'react-bootstrap'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({})
  let newTitle, newAuthor, newUrl

  const handleNewBlog = async (event) => {
    event.preventDefault()
    try{
      dispatch(createBlog(newBlog))
      dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, false, 5))
    }
    catch (exception){
      dispatch(setNotification('Couldn\'t add the blog', true, 5))
    }

    setNewBlog({})
  }

  return(
    <div className="blogFormDiv">
      <h2>create a new blog</h2>
      <Form onSubmit={handleNewBlog}>
        <Form.Group>
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            name="Title"
            value={newTitle}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
          <Form.Label>Author:</Form.Label>
          <Form.Control
            id="author"
            type="text"
            value={newAuthor}
            name="Title"
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
          <Form.Label>Url:</Form.Label>
          <Form.Control
            id="url"
            type="text"
            value={newUrl}
            name="Title"
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
          <Button variant="primary" type="submit">
            create
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

export default BlogForm
