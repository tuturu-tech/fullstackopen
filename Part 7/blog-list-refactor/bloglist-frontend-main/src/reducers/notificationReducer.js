/* eslint-disable linebreak-style */
const initialState = {
  message: null,
  isError: false,
  timerId: undefined
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
  case 'SET_NOTIFICATION':{
    state = action.data
    return state
  }
  case 'REMOVE_NOTIFICATION':{
    state = action.data
    return state
  }
  default:
    return state
  }
}

export const setMessage = (message, isError, timerId) => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      message,
      isError,
      timerId
    }
  }
}

export const removeMessage = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
    data: initialState
  }
}

export const setNotification = (message, isError, time) => {
  return async (dispatch, getState) => {
    const prevTimer = getState().messageObject.timerId
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    const timerId = setTimeout(() => {
      dispatch(removeMessage())
    }, time*1000)
    dispatch(setMessage(message, isError, timerId))
  }
}

export default notificationReducer