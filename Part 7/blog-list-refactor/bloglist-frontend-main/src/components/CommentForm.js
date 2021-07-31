/* eslint-disable linebreak-style */
import React from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button, Form, InputGroup } from 'react-bootstrap'

const CommentForm = ({ blog }) => {
  const dispatch = useDispatch()
  let comment

  const handleNewComment =  async (event) => {
    event.preventDefault()

    try{
      dispatch(addComment(blog.id, comment))
      document.getElementById('comment').value=''
    } catch(exception){
      dispatch(setNotification('Comment could not be added', true, 5))
    }
  }

  return (
    <Form onSubmit={handleNewComment}>
      <InputGroup className="mb-3" >
        <Form.Control
          aria-describedby="basic-addon1"
          id="comment"
          type="text"
          value={comment}
          name="comment"
          onChange={({ target }) => {comment = target.value}}
        />
        <Button type="submit" variant="primary" id="button-addon1">add comment </Button>
      </InputGroup>
    </Form>

  )
}

export default CommentForm