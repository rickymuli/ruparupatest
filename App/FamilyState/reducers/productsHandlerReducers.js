export const initialStates = {
  sortType: 'matching',
  colors: [],
  brands: [],
  labels: [],
  maxPrice: '',
  minPrice: '',
  canGoSend: '',
  from: 0,
  size: 24,
  keyword: '',
  fetchFilter: false,
  filterErr: null,
  fetchSort: false,
  sortErr: null,
  getMoreErr: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'request':
      return {
        ...state,
        fetchFilter: true,
        filterErr: null
      }
    case 'success':
      return {
        ...state,
        fetchFilter: false,
        filterErr: null,
        ...action.data
      }
    case 'failure':
      return {
        ...state,
        fetchFilter: false,
        err: action.data
      }
    case 'reset':
      return initialStates
    default: return state
  }
}
