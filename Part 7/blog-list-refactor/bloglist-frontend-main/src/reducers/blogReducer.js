/* eslint-disable linebreak-style */
import blogService from '../services/blogs'

const blogReducer = (state=[], action) => {
  switch(action.type) {
  case 'NEW_BLOG': {
    return state.concat(action.data)
  }
  case 'LIKE': {
    const changedBlog = action.data
    const id = action.data.id
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog
    )
  }
  case 'INIT_BLOGS': {
    return action.data
  }
  case 'DELETE_BLOG': {
    return state.filter(n => String(n.id) !== action.data)
  }
  case 'ADD_COMMENT': {
    const changedBlog = action.data
    const id = action.data.id
    return state.map(blog =>
      blog.id !== id ? blog : changedBlog
    )
  }
  default:
    return state
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.create(blog)

    dispatch({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'DELETE_BLOG',
      data: id
    })
  }
}

export const like = (id) => {
  return async dispatch => {
    const blog = await blogService.getOne({ id })
    blog.likes = blog.likes + 1

    const updatedBlog = await blogService.update(id, blog)
    dispatch({
      type: 'LIKE',
      data: updatedBlog
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {

    const updatedBlog = await blogService.addComment(id, { newComment: comment })

    dispatch({
      type: 'ADD_COMMENT',
      data: updatedBlog
    })
  }
}



export default blogReducer

