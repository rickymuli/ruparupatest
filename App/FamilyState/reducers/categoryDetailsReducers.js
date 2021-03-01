export const initialStates = {
  fetching: false,
  data: null,
  err: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        fetching: true,
        err: null,
        data: null
      }
    case 'success':
      return {
        ...state,
        fetching: false,
        data: action.data,
        err: null
      }
    case 'failure':
      return {
        ...state,
        fetching: false,
        data: null,
        err: action.data
      }
    default: return state
  }
}
