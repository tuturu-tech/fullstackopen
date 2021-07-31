const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
    user: "60d77f06caccfa36182d3501"
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
    user: "60d77f06caccfa36182d3501"
  }
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()

  const user = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(user)

  token = response.body.token
})

test('blogs are returned as json', async () => {
  
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('a valid blog post can be added', async () => {
  
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'FSO',
    url: 'testUrl',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set("authorization", "bearer " + token)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map( r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain(
    'async/await simplifies making async calls'
  )
})

test('when likes is missing, default to 0', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'FSO',
    url: 'testUrl',
  }
  
  await api
    .post('/api/blogs')
    .set("authorization", "bearer " + token)
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const newestBlogLocation = response.body.length -1
  expect(response.body[newestBlogLocation].likes).toEqual(0)  
})

test('if title and url are missing, return 400 Bad Request', async () => {
  const newBlog = {
    author: 'FSO',
  }

  await api
    .post('/api/blogs')
    .set("authorization", "bearer " + token)
    .send(newBlog)
    .expect(400)
})

test('a blog post can be deleted', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  const blogToDelete = blogsAtStart.body[0]

  console.log(`/api/blogs/${blogToDelete.id}`)
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("authorization", "bearer " + token)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)

  const titles = blogsAtEnd.body.map( r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('a blog post can be updated', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  
  const updatedBlog = {
    likes: 15
  }

  await api
    .put(`/api/blogs/${blogsAtStart.body[0].id}`)
    .send(updatedBlog)
    .expect(200)

  const response = await api.get('/api/blogs')

  expect(response.body[0].likes).toEqual(15)
})

test('get a single blog', async () => {
  const blogsAtStart = await api.get('/api/blogs')
  console.log(blogsAtStart.body[0].id)
  const singleBlog = await api.get(`/${blogsAtStart.body[0].id}`)
  console.log(singleBlog.body)
})

test('adding a blog fails without authentication', async () => {
  const blogsAtStart = await api.get('/api/blogs')

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'FSO',
    url: 'testUrl',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await api.get('/api/blogs')

  expect(blogsAtEnd.body).toHaveLength(blogsAtStart.body.length)

})

afterAll(() => {
  mongoose.connection.close()
})