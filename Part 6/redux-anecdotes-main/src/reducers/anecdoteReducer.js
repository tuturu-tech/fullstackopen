import anecdotesService from "../services/anecdotes"

const getId = () => (100000 * Math.random()).toFixed(0)

export const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const anecdoteReducer = (state = [], action) => {
  switch(action.type) {
    case 'VOTE': {
      const changedAnecdote = action.data
      const id = action.data.id
      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : changedAnecdote  
      )
    }
  
    case 'NEW_ANECDOTE':
      return state.concat(action.data)
    case 'INIT_ANECDOTES':
      return action.data
    default:
      return state
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdotesService.createNew(anecdote)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const vote = (id) => {
  return async dispatch => {
    const anecdote = await anecdotesService.getOne(id)
    anecdote.votes = anecdote.votes + 1
    const votedAnecdote = await anecdotesService.update(id, anecdote)
    dispatch({
      type: 'VOTE',
      data: votedAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdotesService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    })
  }
}


export default anecdoteReducer