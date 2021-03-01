// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  productHandlerSetFilter: ['colors', 'minPrice', 'maxPrice', 'brands', 'canGoSend', 'labels', 'algolia', 'companyCode'],
  productHandlerSetFilterSuccess: null,
  productHandlerSetFilterFailure: ['err'],
  productHandlerSetSort: ['sortType'],
  productHandlerSetSortSuccess: null,
  productHandlerSetSortFailure: ['err'],
  productHandlerGetMoreItemRequest: ['from', 'companyCode'],
  productHandlerGetMoreItemFailure: ['err'],
  productHandlerGetMoreItemSuccess: null,
  productHandlerInit: null,
  productHandlerResetFrom: null,
  productHandlerReset: null
})

export const ProductHandlerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  sortType: 'matching',
  colors: [],
  brands: [],
  labels: [],
  maxPrice: '',
  minPrice: '',
  canGoSend: '',
  algolia: {},
  from: 0,
  size: 24,
  fetchFilter: false,
  filterErr: null,
  fetchSort: false,
  sortErr: null,
  getMoreErr: null
})

/* ------------- Reducers ------------- */
export const setFilter = (state, { colors, minPrice, maxPrice, brands, canGoSend, labels, algolia }) => state.merge({ colors, minPrice, maxPrice, brands, canGoSend, labels, algolia })
export const setSort = (state, { sortType }) => state.merge({ sortType, fetchSort: true, from: 0 })
export const getMore = (state, { from }) => state.merge({ getMoreErr: null, from })
export const getMoreSuccess = (state, { from }) => state
export const getMoreFailure = (state, { err }) => state.merge({ getMoreErr: err })
export const setFilterSuccess = (state) => state.merge({ fetchFilter: false })
export const setFilterFailure = (state, { err }) => state.merge({ fetchFilter: false, filterErr: err })
export const setSortSuccess = (state) => state.merge({ fetchSort: false })
export const setSortFailure = (state, { err }) => state.merge({ fetchSort: false, sortErr: err })
export const resetFrom = (state) => state.merge({ from: 0 })

// init filter
export const initStates = (state) =>
  state.merge({
    colors: [],
    brands: [],
    labels: [],
    algolia: {},
    maxPrice: '',
    minPrice: '',
    canGoSend: '',
    from: 0,
    size: 24
  })

// Reset States
export const reset = (state) =>
  state.merge({
    colors: [],
    brands: [],
    labels: [],
    algolia: {},
    maxPrice: '',
    minPrice: '',
    canGoSend: '',
    from: 0,
    size: 24,
    sortType: 'matching',
    fetchFilter: false,
    filterErr: null,
    fetchSort: false,
    sortErr: null
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.PRODUCT_HANDLER_SET_FILTER]: setFilter,
  [Types.PRODUCT_HANDLER_SET_FILTER_SUCCESS]: setFilterSuccess,
  [Types.PRODUCT_HANDLER_SET_FILTER_FAILURE]: setFilterFailure,
  [Types.PRODUCT_HANDLER_SET_SORT]: setSort,
  [Types.PRODUCT_HANDLER_SET_SORT_SUCCESS]: setSortSuccess,
  [Types.PRODUCT_HANDLER_SET_SORT_FAILURE]: setSortFailure,
  [Types.PRODUCT_HANDLER_GET_MORE_ITEM_REQUEST]: getMore,
  [Types.PRODUCT_HANDLER_GET_MORE_ITEM_SUCCESS]: getMoreSuccess,
  [Types.PRODUCT_HANDLER_GET_MORE_ITEM_FAILURE]: getMoreFailure,
  [Types.PRODUCT_HANDLER_INIT]: initStates,
  [Types.PRODUCT_HANDLER_RESET_FROM]: resetFrom,
  [Types.PRODUCT_HANDLER_RESET]: reset
})
