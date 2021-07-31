import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = ({ blogs }) => {

  blogs.sort((a,b) => b.likes - a.likes)

  return(
    <div>
      <Table striped>
        <tbody>
          {blogs.map(blog => {
            return(
              <tr key={blog.id}>
                <td>
                  <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
                </td>
              </tr>
            )
          })
          }
        </tbody>

      </Table>

    </div>
  )
}



export default Blogs