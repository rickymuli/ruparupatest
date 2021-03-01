// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  tahuRequest: ['data'],
  tahuSuccess: ['payload'],
  tahuFailed: ['payload'],
  tahuStaticInit: null,
  tahuStaticRequest: ['data'],
  tahuStaticSuccess: ['payload'],
  tahuStaticFailed: ['payload'],
  tahuCmsBlockRequest: ['identifier', 'companyCode'],
  tahuCmsBlockSuccess: ['data'],
  tahuCmsBlockFailure: ['err'],
  cmsBlockInit: null,
  exploreByTrendingRequest: null,
  exploreByTrendingSuccess: ['data'],
  exploreByTrendingFailure: ['err'],
  exploreByCategoryRequest: null,
  exploreByCategorySuccess: ['data'],
  exploreByCategoryFailure: ['err']
})

export const TahuTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: true,
  error: null,
  data: null,
  fetchingStatic: true,
  errorStatic: null,
  dataStatic: null,
  dataCmsBlock: null,
  fetchingCmsBlock: false,
  errorCmsBlock: null,
  fetchingExploreByTrending: false,
  dataExploreByTrending: null,
  errorExploreByTrending: null,
  fetchingExploreByCategory: false,
  dataExploreByCategory: null,
  errorExploreByCategory: null
})

/* ------------- Reducers ------------- */

// we've successfully fetched
export const request = (state = INITIAL_STATE) => state.merge({ fetching: true })

export const success = (state = INITIAL_STATE, action) =>
  state.merge({
    fetching: false,
    data: action.payload
  })

export const failed = (state = INITIAL_STATE, action) =>
  state.merge({
    fetching: false,
    error: action.payload
  })

export const tahuStaticInit = (state = INITIAL_STATE) => state.merge({
  dataStatic: null
})

export const tahuStaticRequest = (state = INITIAL_STATE) => state.merge({ fetchingStatic: true })

export const tahuStaticSuccess = (state = INITIAL_STATE, action) =>
  state.merge({
    fetchingStatic: false,
    dataStatic: action.payload
  })

export const tahuStaticFailed = (state = INITIAL_STATE, action) =>
  state.merge({
    fetchingStatic: false,
    errorStatic: action.payload
  })

export const cmsBlockRequest = (state) =>
  state.merge({
    fetchingCmsBlock: true
  })

export const cmsBlockSuccess = (state, { data }) =>
  state.merge({
    dataCmsBlock: data,
    fetchingCmsBlock: false
  })

export const cmsBlockFailure = (state, { err }) =>
  state.merge({
    fetchingCmsBlock: false,
    errorCmsBlock: err
  })

export const exploreByTrendingRequest = (state) =>
  state.merge({
    fetchingExploreByTrending: true
  })

export const exploreByTrendingSuccess = (state, { data }) =>
  state.merge({
    fetchingExploreByTrending: false,
    dataExploreByTrending: data
  })

export const exploreByTrendingFailure = (state, { err }) =>
  state.merge({
    fetchingExploreByTrending: false,
    errorExploreByTrending: err
  })

export const initCmsBlock = (state) =>
  state.merge({
    errorCmsBlock: null,
    dataCmsBlock: null
  })

export const exploreByCategoryRequest = (state) =>
  state.merge({
    fetchingExploreByCategory: true,
    dataExploreByCategory: null,
    errorExploreByCategory: null
  })

export const exploreByCategorySuccess = (state, { data }) =>
  state.merge({
    fetchingExploreByCategory: false,
    dataExploreByCategory: data
  })

export const exploreByCategoryFailure = (state, { err }) =>
  state.merge({
    fetchingExploreByCategory: false,
    errorExploreByCategory: err
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.TAHU_REQUEST]: request,
  [Types.TAHU_SUCCESS]: success,
  [Types.TAHU_FAILED]: failed,
  [Types.TAHU_STATIC_REQUEST]: tahuStaticRequest,
  [Types.TAHU_STATIC_SUCCESS]: tahuStaticSuccess,
  [Types.TAHU_STATIC_FAILED]: tahuStaticFailed,
  [Types.TAHU_STATIC_INIT]: tahuStaticInit,
  [Types.CMS_BLOCK_INIT]: initCmsBlock,
  [Types.TAHU_CMS_BLOCK_REQUEST]: cmsBlockRequest,
  [Types.TAHU_CMS_BLOCK_SUCCESS]: cmsBlockSuccess,
  [Types.TAHU_CMS_BLOCK_FAILURE]: cmsBlockFailure,
  [Types.EXPLORE_BY_TRENDING_REQUEST]: exploreByTrendingRequest,
  [Types.EXPLORE_BY_TRENDING_SUCCESS]: exploreByTrendingSuccess,
  [Types.EXPLORE_BY_TRENDING_FAILURE]: exploreByTrendingFailure,
  [Types.EXPLORE_BY_CATEGORY_REQUEST]: exploreByCategoryRequest,
  [Types.EXPLORE_BY_CATEGORY_SUCCESS]: exploreByCategorySuccess,
  [Types.EXPLORE_BY_CATEGORY_FAILURE]: exploreByCategoryFailure
})
