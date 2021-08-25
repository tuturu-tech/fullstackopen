import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`
export const ALL_BOOKS = gql`
query allBooks($genre: String) {
  allBooks (genre: $genre) {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const GET_GENRES = gql`
query {
  allGenres
}
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int, $genres: [String]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    published
    author {
      name
    }
    id
    genres
  }
}
`

export const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!){
  editAuthor(
    name: $name, 
    setBornTo: $born
    ) {
      name
      born  
    }
}
`

export const LOGIN = gql`
mutation login($username: String!, $password: String!){
  login(username: $username, password: $password){
    value
  }
}
`

export const FAVORITE_GENRE_BOOKS = gql`
query {
  favoriteBooks {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const CURRENT_USER = gql`
query {
  me {
    username
    favoriteGenre
  }
}
`

export const BOOK_ADDED = gql`
subscription {
  bookAdded {
    title
    author {
      name
    }
    published
    genres
  }
}
`