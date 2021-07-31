/* eslint-disable linebreak-style */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('Event handler is called with the right details', () => {
    const createBlog = jest.fn()

    const component = render(
      <BlogForm createBlog={createBlog} />
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const form = component.container.querySelector('form')

    fireEvent.change(title, {
      target: { value: 'testing form title' }
    })
    fireEvent.change(author, {
      target: { value: 'testing form author' }
    })
    fireEvent.change(url, {
      target: { value: 'testing form url' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing form title')
    expect(createBlog.mock.calls[0][0].author).toBe('testing form author')
    expect(createBlog.mock.calls[0][0].url).toBe('testing form url')
  })
})