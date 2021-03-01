// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import uniq from 'lodash/uniq'
import without from 'lodash/without'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  prevSearchAdd: ['data'],
  prevSearchRemove: ['data'],
  prevSearchReset: null
})

export const SearchHistoryTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  data: []
})

/* ------------- Reducers ------------- */
export const prevSearchAdd = (state, { data }) => ({ data: uniq([data, ...state.data]) })

export const prevSearchRemove = (state, { data }) => ({ data: without(state.data, data) })

export const prevSearchReset = (state) => ({ data: [] })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.PREV_SEARCH_ADD]: prevSearchAdd,
  [Types.PREV_SEARCH_REMOVE]: prevSearchRemove,
  [Types.PREV_SEARCH_RESET]: prevSearchReset
})
