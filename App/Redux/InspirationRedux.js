// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  inspirationServer: ['storeCode', 'companyCode'],
  inspirationSuccess: ['data'],
  inspirationFailure: ['err'],
  inspirationInit: null
})

export const InspirationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { category }: Object) => state

export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data
  })

// we've had a problem fetch data
export const failure = (state: Object) =>
  state.merge({ fetching: false })

export const init = (state) =>
  state.merge({
    data: null,
    err: null
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.INSPIRATION_SERVER]: server,
  [Types.INSPIRATION_SUCCESS]: success,
  [Types.INSPIRATION_FAILURE]: failure,
  [Types.INSPIRATION_INIT]: init
})
