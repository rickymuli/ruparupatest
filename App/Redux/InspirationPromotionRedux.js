// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  inspirationPromoRequest: ['storeCode', 'inspirationType'],
  inspirationPromoSuccess: ['data'],
  inspirationPromoFailure: null
})

export const InspirationPromotionTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const request = (state: Object) =>
  state.merge({
    fetching: true,
    err: null
  })

export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data
  })

// we've had a problem fetch data
export const failure = (state: Object) =>
  state.merge({ fetching: false })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.INSPIRATION_PROMO_REQUEST]: request,
  [Types.INSPIRATION_PROMO_SUCCESS]: success,
  [Types.INSPIRATION_PROMO_FAILURE]: failure
})
