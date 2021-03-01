
export const initialStates = {
  fetching: true,
  error: null,
  data: null,
  fetchingStatic: true,
  errorStatic: null,
  dataStatic: null,
  dataCmsBlock: null,
  dataCmsBlockPersistent: null,
  fetchingCmsBlock: false,
  errorCmsBlock: null,
  fetchingExploreByTrending: false,
  dataExploreByTrending: null,
  errorExploreByTrending: null,
  fetchingExploreByCategory: false,
  dataExploreByCategory: null,
  errorExploreByCategory: null
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'cmsBlockRequest':
      return {
        ...state,
        fetchingCmsBlock: true,
        errorCmsBlock: null
      }
    case 'cmsBlockSuccess':
      return {
        ...state,
        dataCmsBlock: action.data,
        errorCmsBlock: null,
        fetchingCmsBlock: false
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
