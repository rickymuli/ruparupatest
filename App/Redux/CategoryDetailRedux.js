// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  categoryDetailRequest: ['urlKey'],
  categoryDetailWithProductRequest: ['urlKey', 'searchKeyword', 'companyCode', 'boostEmarsys'],
  categoryDetailWithProductSuccess: ['data'],
  categoryDetailWithProductFailure: ['err'],
  categoryDetailSuccess: ['data'],
  categoryDetailServer: ['urlKey'],
  categoryDetailFailure: ['err'],
  categoryDetailInit: null
})

export const CategoryDetailTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  data: null,
  searchKeyword: '',
  err: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const server = (state: Object, { data }: Object) => state
// we're attempting to login
export const request = (state: Object) => state.merge({ fetching: true, err: null, data: null })

export const requestWithProduct = (state, { urlKey, searchKeyword }) => state.merge({ fetching: true, err: null, data: null, searchKeyword })

// we've successfully logged in
export const success = (state: Object, { data }: Object) =>
  state.merge({
    fetching: false,
    data,
    err: null
  })

// we've had a problem logging in
export const failure = (state: Object, { err }: Object) =>
  state.merge({ fetching: false, err })

export const init = (state: Object) =>
  state.merge({ fetching: false, data: null, err: null })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.CATEGORY_DETAIL_SUCCESS]: success,
  [Types.CATEGORY_DETAIL_SERVER]: server,
  [Types.CATEGORY_DETAIL_WITH_PRODUCT_REQUEST]: requestWithProduct,
  [Types.CATEGORY_DETAIL_WITH_PRODUCT_SUCCESS]: success,
  [Types.CATEGORY_DETAIL_WITH_PRODUCT_FAILURE]: failure,
  [Types.CATEGORY_DETAIL_REQUEST]: request,
  [Types.CATEGORY_DETAIL_FAILURE]: failure,
  [Types.CATEGORY_DETAIL_INIT]: init
})
