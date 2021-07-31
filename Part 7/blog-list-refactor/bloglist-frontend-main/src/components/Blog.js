/* eslint-disable linebreak-style */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { like, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import CommentForm from './CommentForm'
import { Button, Card, ListGroup } from 'react-bootstrap'

const Blog = ({ blog }) => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  let showIfRightUser
  if(!blog.user.id){
    showIfRightUser = { display: user.id === blog.user ? '' : 'none' }
  } else {
    showIfRightUser = { display: user.username === blog.user.username || user.id === blog.user.id ? '' : 'none' }
  }

  const handleLike= async (event) => {
    dispatch(like(blog.id))
  }

  const handleDelete= async (event) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      try{
        dispatch(deleteBlog(blog.id))
        dispatch(setNotification(`Blog ${blog.title} by ${blog.author} removed`, false, 5))
      } catch {
        dispatch(setNotification('Blog is already deleted', true, 5))
      }
    }
  }

  return(
    <div key={blog.id} className='blog'>
      <Card key={blog.id} style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{blog.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Author: {blog.author}</Card.Subtitle>
          <Card.Link href={`${blog.url}`}>{blog.url}</Card.Link>
          <Card.Text>Likes {blog.likes} <Button id="likeButton" variant="primary" onClick={handleLike}>like</Button></Card.Text>
          <br/>
          <Button variant="danger" style={showIfRightUser} id={blog.id} author={blog.author} title={blog.title} onClick={handleDelete}>remove</Button>
        </Card.Body>
      </Card>
      <h3>Comments</h3>
      <CommentForm blog={blog} />
      <Card>
        <ListGroup variant="flush">
          {blog.comments
            ? blog.comments.map(comment =>
              comment !== ''
                ? <ListGroup.Item key={(Math.random() * 10000).toFixed(0)}>{comment}</ListGroup.Item>
                : null
            )
            : null }
        </ListGroup>
      </Card>
    </div>
  )
}

export default Blog