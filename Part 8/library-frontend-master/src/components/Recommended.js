import { useQuery } from '@apollo/client'
import React from 'react'
import { CURRENT_USER, FAVORITE_GENRE_BOOKS } from '../queries'

const Recommended = (props) => {
  const result = useQuery(FAVORITE_GENRE_BOOKS)
  const userResult = useQuery(CURRENT_USER)

  
  if (result.loading || userResult.loading){
    return <div>loading...</div>
  }

  const books = result.data.favoriteBooks
  const user = userResult.data.me

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>
      <p>books in your favorite genre <strong>{user.favoriteGenre}</strong> </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(book =>
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author ? book.author.name : "unknown"}</td>
              <td>{book.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended