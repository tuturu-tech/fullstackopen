/* eslint-disable linebreak-style */
import React from 'react'
import { Table } from 'react-bootstrap'
import { Link
} from 'react-router-dom'

import Notification from './Notification'

const Users = ({ users }) => {

  if(!users){
    return null
  }

  return (
    <div>
      <h1>Users</h1>
      <Notification/>
      <Table striped bordered>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
          {users.map(user => {
            if(!user.name){
              return(
                <tr key={user.id}>
                  <th style={{ fontWeight: 'regular' }}><Link to={`/users/${user.id}`}>anonymous user</Link></th>
                  <th>{user.blogs.length}</th>
                </tr>
              )
            }
            return(
              <tr key={user.id}>
                <th><Link to={`/users/${user.id}`}>{user.name}</Link></th>
                <th>{user.blogs.length}</th>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}

export default Users