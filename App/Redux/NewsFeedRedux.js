// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  newsFeedRequest: null,
  newsFeedSuccess: ['data'],
  newsFeedAddNews: ['data'],
  newsFeedAddNewsSuccess: ['data'],
  newsFeedAddNewsFailure: ['err'],
  newsFeedFailure: ['err']
})

export const NewsFeedTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  allData: null,
  err: null,
  show: false
})

/* ------------- Reducers ------------- */

export const request = (state: Object) => state.merge({ fetching: true, err: null, data: null, show: false })

export const addNews = (state: Object) => state.merge({ fetching: true, err: null })

export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data: data.data,
    allData: data.sortedArr,
    err: null,
    show: data.show
  })

export const successAdd = (state, { data }) =>
  state.merge({
    fetching: false,
    allData: data,
    err: null
  })

export const failure = (state: Object, { err }: Object) =>
  state.merge({ fetching: false, err, show: false })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.NEWS_FEED_SUCCESS]: success,
  [Types.NEWS_FEED_REQUEST]: request,
  [Types.NEWS_FEED_ADD_NEWS]: addNews,
  [Types.NEWS_FEED_ADD_NEWS_SUCCESS]: successAdd,
  [Types.NEWS_FEED_FAILURE]: failure
})
