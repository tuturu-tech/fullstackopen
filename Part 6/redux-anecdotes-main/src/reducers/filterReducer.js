const initialState = ""

const filterReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'FILTER_WITH': {
      state = action.data
      return state
    } 
    default:
      return state
  }
  
}

export const setFilter = (filter) => {
  return {
    type: 'FILTER_WITH',
    data: filter
  }
}

export default filterReducer