const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await  Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)

  })

blogsRouter.get('/:id', async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)
    response.json(blog)
})
  
blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  const body = request.body  
  const user = request.user
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes || 0
  })
    
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.json(savedBlog)
  })

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if( blog.user.toString() === user.id.toString() ) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }

})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const oldBlog = await Blog.findById(request.params.id)

  const blog = {
    title: body.title || oldBlog.title,
    author: body.author || oldBlog.author,
    url: body.url || oldBlog.url,
    likes: body.likes || oldBlog.likes
  }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true, context: 'query'})
    response.json(updatedBlog)
})

module.exports = blogsRouter