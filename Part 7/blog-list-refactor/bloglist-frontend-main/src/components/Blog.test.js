/* eslint-disable linebreak-style */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'



describe('<Blog />', () => {
  let component
  const handleTesting = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Test blog',
      author: 'Tuturu',
      url: 'blog.com',
      likes: 10,
      user: {
        id: 123,
        username: 'tuturu'
      }
    }

    const user = {
      id: 123,
      username: 'tuturu'
    }

    component = render(
      <Blog blog={blog} user={user} handleLikesTest={handleTesting} />
    )
  })

  test('renders title and author', () => {
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Test blog'
    )
    expect(div).toHaveTextContent(
      'Tuturu'
    )
  })

  test('doesn\'t render url and likes', () => {
    const div = component.container.querySelector('.details')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking the button shows details', () => {
    const div = component.container.querySelector('.details')
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(div).not.toHaveStyle('display: none')
    expect(div).toHaveTextContent('blog.com')
    expect(div).toHaveTextContent('Likes 10')
  })

  test('event handler triggers correct amount of times when clicking the like button', () => {

    const button = component.getByText('likes')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(handleTesting.mock.calls).toHaveLength(2)

  })
})
