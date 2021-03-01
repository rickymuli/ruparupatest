import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  reviewProductByInvoiceRequest: ['invoice', 'sku'],
  reviewProductByInvoiceSuccess: ['data'],
  reviewProductByInvoiceFailure: ['err'],
  fetchReviewRatingBySkuRequest: ['sku'],
  fetchReviewRatingBySkuSuccess: ['data'],
  fetchReviewRatingBySkuFailure: ['err'],
  sortReviewRatingRequest: ['sortType', 'sku'],
  sortReviewRatingSuccess: ['data'],
  sortReviewRatingFailure: ['err'],
  likeReviewRequest: ['data'],
  likeReviewSuccess: ['data'],
  likeReviewFailure: ['err'],
  fetchReviewRatingCountRequest: null,
  fetchReviewRatingCountSuccess: ['data'],
  fetchReviewRatingCountFailure: ['err'],
  fetchProductReviewRequest: ['reviewed', 'limit', 'offset'],
  fetchProductReviewSuccess: ['data'],
  fetchProductReviewFailure: ['err'],
  fetchServiceReviewRequest: ['reviewed', 'limit', 'offset'],
  fetchServiceReviewSuccess: ['data'],
  fetchServiceReviewFailure: ['err'],
  fetchReviewTagsRequest: ['reviewType'],
  fetchReviewTagsSuccess: ['data'],
  fetchReviewTagsFailure: ['err'],
  insertReviewProductRequest: ['data'],
  insertReviewProductSuccess: null,
  insertReviewProductFailure: ['err'],
  insertReviewServiceRequest: ['data'],
  insertReviewServiceSuccess: null,
  insertReviewServiceFailure: ['err'],
  initSuccessInsert: null,
  initReviewData: null,
  initReviewProduct: null
})

export const ReviewRatingTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  fetchingLike: false,
  fetchCount: false,
  countData: null,
  likeData: null,
  data: null,
  dataReview: null,
  dataReviewPage: null,
  sortData: null,
  error: false,
  errorReviewData: false,
  fetchTags: false,
  tags: null,
  tagsError: null,
  insertingReview: false,
  errorInsertProductReview: null,
  successInsert: false
})

/* ------------- Reducers ------------- */
export const request = (state) => state.merge({ fetching: true, data: null })

export const requestReviewData = (state) => state.merge({ fetching: true, dataReview: null }) // This is for order status page

export const requestReview = (state) => state.merge({ fetching: true, dataReviewPage: null })

export const requestSort = (state) => state.merge({ fetching: true })

export const requestLike = (state) => state.merge({ fetchingLike: true, likeData: null })

export const requestCount = (state) => state.merge({ fetchCount: true, countData: null })

export const requestTags = (state) => state.merge({ fetchTags: true })

export const likeSuccess = (state, { data }) => {
  let tempArr = [...state.sortData.reviews]
  let tempArrMain = [...state.data.reviews]
  let selectedIndex = tempArr.findIndex(review => review.review_product_id === data.review_product_id)
  let mainIndex = tempArr.findIndex(review => review.review_product_id === data.review_product_id)
  if (mainIndex < 3) {
    let mainData = { ...tempArrMain[mainIndex] }
    if (data.action === 'like') {
      mainData.like_count = Number(mainData.like_count) + 1
      mainData.is_customer_liked = true
    } else {
      mainData.like_count = Number(mainData.like_count) - 1
      mainData.is_customer_liked = false
    }
    tempArrMain[mainIndex] = mainData
  }
  let reviewData = { ...tempArr[selectedIndex] }
  if (data.action === 'like') {
    reviewData.like_count = Number(reviewData.like_count) + 1
    reviewData.is_customer_liked = true
  } else {
    reviewData.like_count = Number(reviewData.like_count) - 1
    reviewData.is_customer_liked = false
  }
  tempArr[selectedIndex] = reviewData
  let tempSortData = { ...state.sortData }
  let tempMain = { ...state.data }
  tempSortData.reviews = tempArr
  tempMain.reviews = tempArrMain
  return state.merge({ fetchingLike: false, likeData: data, sortData: tempSortData, data: tempMain })
}

export const tagsSuccess = (state, { data }) => state.merge({ tags: data, fetchTags: false })

export const successGetReview = (state, { data }) => state.merge({ fetching: false, dataReviewPage: data })

export const successReviewData = (state, { data }) => state.merge({ fetching: false, dataReview: data })

export const sortSuccess = (state, { data }) =>
  state.merge({
    fetching: false,
    sortData: data
  })

export const countSuccess = (state, { data }) =>
  state.merge({
    fetchCount: false,
    countData: data
  })

export const success = (state, { data }) =>
  state.merge({
    fetching: false,
    data,
    sortData: data
  })

export const likeFailure = (state, { err }) =>
  state.merge({
    fetchingLike: false,
    error: err
  })

export const failure = (state, { err }) =>
  state.merge({ fetching: false, error: err })

export const countFailure = (state, { err }) =>
  state.merge({
    error: err,
    fetchCount: false
  })

export const tagsFailure = (state, { err }) =>
  state.merge({
    tagsError: err,
    fetchTags: false
  })

export const failureReviewData = (state, { err }) => state.merge({ fetching: false, errorReviewData: err })

export const productReviewInsert = (state) => state.merge({ insertingReview: true, successInsert: false })

export const productReviewSuccess = (state) => state.merge({ insertingReview: false, errorInsertProductReview: null, successInsert: true })

export const productReviewFailure = (state, { err }) => state.merge({ insertingReview: false, errorInsertProductReview: err, successInsert: false })

export const initInsert = (state) => state.merge({ insertingReview: false, errorInsertProductReview: null, successInsert: false })

export const initData = (state) => state.merge({ dataReviewPage: null, dataReview: null })

export const init = (state) => state.merge({ data: null })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.REVIEW_PRODUCT_BY_INVOICE_REQUEST]: requestReviewData,
  [Types.REVIEW_PRODUCT_BY_INVOICE_SUCCESS]: successReviewData,
  [Types.REVIEW_PRODUCT_BY_INVOICE_FAILURE]: failureReviewData,
  [Types.FETCH_REVIEW_RATING_BY_SKU_SUCCESS]: success,
  [Types.FETCH_REVIEW_RATING_BY_SKU_REQUEST]: request,
  [Types.FETCH_REVIEW_RATING_BY_SKU_FAILURE]: failure,
  [Types.SORT_REVIEW_RATING_REQUEST]: requestSort,
  [Types.SORT_REVIEW_RATING_SUCCESS]: sortSuccess,
  [Types.SORT_REVIEW_RATING_FAILURE]: failure,
  [Types.LIKE_REVIEW_REQUEST]: requestLike,
  [Types.LIKE_REVIEW_SUCCESS]: likeSuccess,
  [Types.LIKE_REVIEW_FAILURE]: likeFailure,
  [Types.FETCH_REVIEW_RATING_COUNT_REQUEST]: requestCount,
  [Types.FETCH_REVIEW_RATING_COUNT_SUCCESS]: countSuccess,
  [Types.FETCH_REVIEW_RATING_COUNT_FAILURE]: countFailure,
  [Types.FETCH_PRODUCT_REVIEW_REQUEST]: requestReview,
  [Types.FETCH_PRODUCT_REVIEW_SUCCESS]: successGetReview,
  [Types.FETCH_PRODUCT_REVIEW_FAILURE]: failure,
  [Types.FETCH_SERVICE_REVIEW_REQUEST]: requestReview,
  [Types.FETCH_SERVICE_REVIEW_SUCCESS]: successGetReview,
  [Types.FETCH_SERVICE_REVIEW_FAILURE]: failure,
  [Types.FETCH_REVIEW_TAGS_REQUEST]: requestTags,
  [Types.FETCH_REVIEW_TAGS_SUCCESS]: tagsSuccess,
  [Types.FETCH_REVIEW_TAGS_FAILURE]: tagsFailure,
  [Types.INSERT_REVIEW_PRODUCT_REQUEST]: productReviewInsert,
  [Types.INSERT_REVIEW_PRODUCT_SUCCESS]: productReviewSuccess,
  [Types.INSERT_REVIEW_PRODUCT_FAILURE]: productReviewFailure,
  [Types.INSERT_REVIEW_SERVICE_REQUEST]: productReviewInsert,
  [Types.INSERT_REVIEW_SERVICE_SUCCESS]: productReviewSuccess,
  [Types.INSERT_REVIEW_SERVICE_FAILURE]: productReviewFailure,
  [Types.INIT_SUCCESS_INSERT]: initInsert,
  [Types.INIT_REVIEW_DATA]: initData,
  [Types.INIT_REVIEW_PRODUCT]: init
})
