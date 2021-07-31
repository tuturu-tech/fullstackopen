/* eslint-disable linebreak-style */
import React from 'react'
import Notification from './Notification'
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap'


const User = ({ user }) => {

  if (!user) {
    return null
  }

  return (
    <div>
      <Notification/>
      <h2>{user.name}</h2>
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title style={{ margin: 0 }}>added blogs:</Card.Title>
        </Card.Body>
        <ListGroup className="list-group-flush">
          {user.blogs.map(blog => {
            return (
              <ListGroupItem key={blog.id} style={{ textAlign: 'center' }}>{blog.title}</ListGroupItem>
            )
          })}
        </ListGroup>
      </Card>
    </div>
  )
}

export default User
