/* eslint-disable linebreak-style */
import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({})
  let newTitle, newAuthor, newUrl

  const handleNewBlog = async (event) => {
    event.preventDefault()
    createBlog(newBlog)

    setNewBlog({})
  }

  return(
    <div className="blogFormDiv">
      <h2>create a new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <div>
                    title:
            <input
              id="title"
              type="text"
              value={newTitle}
              name="Title"
              onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            />
          </div>
          <div>
                    author:
            <input
              id="author"
              type="text"
              value={newAuthor}
              name="Title"
              onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
            />
          </div>
          <div>
                    url:
            <input
              id="url"
              type="text"
              value={newUrl}
              name="Title"
              onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            />
          </div>
        </div>
        <button type="submit" id="newBlogButton">create</button>
      </form>
    </div>
  )
}

export default BlogForm
