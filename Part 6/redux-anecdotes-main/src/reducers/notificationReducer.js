
const initialState = {
  message: '',
  timerId: undefined
}

const notificationReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION': {
      state = action.data
      return state
    }
    case 'REMOVE_NOTIFICATION': {
      state = action.data
      return state
    }
    default:
      return state
  }
  
}

export const setMessage = (message, timerId) => {
  return {
    type: 'SET_NOTIFICATION',
    data: {
      message,
      timerId,
    }
  }
}

export const removeMessage = () => {
    return {
      type: 'REMOVE_NOTIFICATION',
      data: initialState
    }
}

export const setNotification = (message, time) => {
  return async (dispatch, getState) => {
    const prevTimer = getState().messageObject.timerId
    if (prevTimer) {
      clearTimeout(prevTimer)
    }
    const timerId = setTimeout(() => {
      dispatch(removeMessage())
    }, time*1000)
    dispatch(setMessage(message, timerId))
  }
}

export default notificationReducer