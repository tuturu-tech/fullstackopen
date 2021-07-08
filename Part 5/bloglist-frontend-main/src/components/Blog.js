import React, { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, user, setIsError, setEventMessage, handleLikesTest }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [updated, setUpdated] = useState(false)


  const showWhenVisible = { display: showDetails ? '' : 'none' }
  const showIfRightUser = { display: user.id === blog.user.id || user.username === blog.user.username ? '' : 'none' }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const showOrHide = () => {
    return showDetails ? 'hide' : 'view'
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLikes = async () => {
    const newBlog = blog
    newBlog.likes = blog.likes + 1

    try {
      await blogService.update(blog.id, newBlog)
      setUpdated(!updated)
    }
    catch(exception) {
      setIsError(true)
      setEventMessage('Couldn\'t add a like')
      setTimeout(() => {
        setEventMessage(null)
        setIsError(false)
      }, 5000)
    }

  }

  const handleDelete = async () => {
    /*if (window.confirm(`Delete ${event.target.name} ?`)) {
      numbersService
        .remove(event.target.id)
        .then(() => {
          setPersons(persons.filter(n => String(n.id) !== event.target.id))
        })
        .catch(error => {
          setIsError(true)
          setEventMessage(`Information of ${event.target.name} has already been removed from server`)
          setPersons(persons.filter(n => String(n.id) !== event.target.id))
          setTimeout(() => {
            setEventMessage(null)
            setIsError(false)
          }, 5000)
        })
    }*/

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(n => String(n.id) !== blog.id))
      } catch(exception){
        setIsError(true)
        setEventMessage('Blog is already deleted')
        setTimeout(() => {
          setEventMessage(null)
          setIsError(false)
        }, 5000)
      }

    }
  }


  return(
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>{showOrHide()}</button>
      <div style={showWhenVisible} className='details'>

        <br/>{blog.url}
        <br/>Likes {blog.likes} <button id="likeButton" onClick={handleLikesTest ? handleLikesTest : handleLikes}>likes</button>
        <br/>{blog.user.username}
        <br/><button style={showIfRightUser} id={blog.id} author={blog.author} title={blog.title} onClick={handleDelete}>remove</button>
      </div>
    </div>
  )

}



export default Blog