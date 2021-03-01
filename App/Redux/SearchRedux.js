// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  searchServer: ['data'],
  searchRequest: ['data'],
  searchSuccess: ['data'],
  searchFailure: null,
  searchInit: null,
  searchByKeywordRequest: ['keyword'], // type:'SEARCH_BY_KEYWORD_REQUEST', keyword: 'asd'
  searchByKeywordSuccess: ['payload'],
  searchByKeywordFailure: ['err'],
  searchByKeywordInit: null,
  searchByKeywordAndUrlKeyRequest: ['keyword', 'urlKey'],
  searchByKeywordAndUrlKeySuccess: ['payload'],
  searchByKeywordAndUrlKeyFailure: ['err'],
  searchPageRedirectRequest: ['keyword'],
  searchPageRedirectSuccess: ['payload'],
  searchPageRedirectFailure: ['err'],
  searchPageRedirectInit: null
})

export const SearchTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingPageRedirect: false,
  payload: null,
  data: null,
  pageRedirect: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { data }: Object) => state
// we're attempting to fetch
export const request = (state: Object) => state.merge({ fetching: true, err: null })

export const searchPageRedirectRequest = (state: Object) => state.merge({ fetchingPageRedirect: true, pageRedirect: null })

/*
  we've successfully fetch data
  data: {
    filter: {minimumPrice, maxiumPrice, merk, color},
    sort: lowestPrice, highestPrice, newArrival, lowestDiscount, highestDiscount : choose one of them
  }
*/
export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data,
    err: null
  })

// we've had a problem fetch data
export const failure = (state: Object, { err }: Object) =>
  state.merge({ fetching: false, err })

export const init = (state) =>
  state.merge({ payload: null, err: null })

export const searchPageRedirectFailure = (state: Object) =>
  state.merge({ fetchingPageRedirect: false })

export const searchByKeywordSuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    payload
  })

export const searchByKeywordAndUrlKeySuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetching: false,
    payload
  })

export const searchPageRedirectSuccess = (state: Object, { payload }: Object) =>
  state.merge({
    fetchingPageRedirect: false,
    pageRedirect: payload
  })

export const searchPageRedirectInit = (state: Object) =>
  state.merge({
    fetchingPageRedirect: false,
    pageRedirect: null
  })

export const searchByKeywordInit = (state) => {
  return state.merge({
    fetching: false,
    payload: null
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SEARCH_SERVER]: server,
  [Types.SEARCH_SUCCESS]: success,
  [Types.SEARCH_REQUEST]: request,
  [Types.SEARCH_FAILURE]: failure,
  [Types.SEARCH_INIT]: init,
  [Types.SEARCH_BY_KEYWORD_REQUEST]: request,
  [Types.SEARCH_BY_KEYWORD_SUCCESS]: searchByKeywordSuccess,
  [Types.SEARCH_BY_KEYWORD_FAILURE]: failure,
  [Types.SEARCH_BY_KEYWORD_INIT]: searchByKeywordInit,
  [Types.SEARCH_BY_KEYWORD_AND_URL_KEY_REQUEST]: request,
  [Types.SEARCH_BY_KEYWORD_AND_URL_KEY_SUCCESS]: searchByKeywordAndUrlKeySuccess,
  [Types.SEARCH_BY_KEYWORD_AND_URL_KEY_FAILURE]: failure,
  [Types.SEARCH_PAGE_REDIRECT_REQUEST]: searchPageRedirectRequest,
  [Types.SEARCH_PAGE_REDIRECT_SUCCESS]: searchPageRedirectSuccess,
  [Types.SEARCH_PAGE_REDIRECT_FAILURE]: searchPageRedirectFailure,
  [Types.SEARCH_PAGE_REDIRECT_INIT]: searchPageRedirectInit
})
