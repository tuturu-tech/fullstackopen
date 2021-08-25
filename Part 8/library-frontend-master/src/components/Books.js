import { useLazyQuery, useQuery } from '@apollo/client'
import React, {useEffect} from 'react'
import { ALL_BOOKS, GET_GENRES } from '../queries'


const Books = (props) => {
  const resultGenres = useQuery(GET_GENRES)

  const [getBooks, resultBooks] = useLazyQuery(ALL_BOOKS)

  useEffect(() => {
    getBooks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  if (!props.show) {
    return null
  }

  if (resultGenres.loading || resultBooks.loading){
    return <div>loading...</div>
  }

  const books = resultBooks.data.allBooks
  const genres = resultGenres.data.allGenres

  return (
    <div>
      <h2>books</h2>

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
      <div>
      <h2>Filter books by genre</h2>
      {genres.map(genre => {
        return (<button key={genre} onClick={() => getBooks({ variables: {genre: genre}})}>{genre}</button>)
        })}
      <button onClick={() => getBooks()}>all genres</button>
    </div>
    </div>
  )
}

export default Books