/* eslint-disable linebreak-style */
import loginService from '../services/login'
import blogService from '../services/blogs'

const loginReducer = (state={}, action) => {
  switch(action.type){
  case 'LOGIN':{
    return action.data
  }
  case 'LOGOUT':{
    return action.data
  }
  case 'ALREADY_LOGGED_IN':{
    return action.data
  }
  default:
    return state
  }
}

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login( { username, password })

    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    dispatch({
      type: 'LOGIN',
      data: user
    })
  }
}

export const logout = () => {
  return async dispatch => {
    window.localStorage.removeItem('loggedBlogappUser')
    const user = null
    dispatch({
      type: 'LOGOUT',
      data: user
    })
  }
}

export const alreadyLogged = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      dispatch({
        type: 'ALREADY_LOGGED_IN',
        data: user
      })
    } else {
      dispatch({
        type: 'ALREADY_LOGGED_IN',
        data: null
      })
    }
  }
}

export default loginReducer