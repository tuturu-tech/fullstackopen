import { useMutation } from '@apollo/client'
import React, {useState} from 'react'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const AuthorForm = ({ authors }) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })

  const submit = async (event) => {
    event.preventDefault()

    editAuthor({ variables: {name, born}})

    setName('')
    setBorn('')
  }

  return(
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={({ target }) => {setName(target.value) }}>
            <option value=''>Choose an author</option>
            {authors.map((author) => {return(<option key={author.name} value={author.name}>{author.name}</option>)})}
          </select>
        </div>
        <div>
          born
          <input
            type='number'
            value={born}
            onChange={({ target }) => {setBorn(parseInt(target.value, 10))}}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )

}

export default AuthorForm