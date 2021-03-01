// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */

const { Types, Creators } = createActions({
  setProductForReturn: ['products', 'invoices', 'address'],
  setReasonForReturn: ['data'],
  setImageForUpload: ['data'],
  setImageForUploadSuccess: ['imageData'],
  setImageForUploadFailure: ['err'],
  initImage: null
})

export const ReturnRefundHandlerTypes = Types
export default Creators

/* --- Initial State --- */

export const INITIAL_STATE = Immutable({
  fetchingImageUrl: false,
  products: [],
  invoices: [],
  address: null,
  alasan: [],
  images: null,
  errImageUpload: null
})

/* --- Reducers --- */

export const setProduct = (state, { products, invoices, address }) => state.merge({
  products, invoices, address
})

export const setReason = (state, { data }) => state.merge({
  alasan: data
})

export const setImageForUpload = (state, { data }) => state.merge({
  fetchingImageUrl: true,
  errImageUpload: null
})

export const setInvoice = (state, { data }) => state.merge({
  invoiceData: data
})

export const successImageUpload = (state, { imageData }) => {
  return state.merge({
    images: imageData,
    fetchingImageUrl: false
  })
}

export const failureImageUpload = (state, { err }) => state.merge({
  errImageUpload: err,
  fetchingImageUrl: false
})

export const initImage = (state) => state.merge({
  images: null
})

/* --- Hookup Reducers to Types --- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PRODUCT_FOR_RETURN]: setProduct,
  [Types.SET_REASON_FOR_RETURN]: setReason,
  [Types.SET_IMAGE_FOR_UPLOAD]: setImageForUpload,
  [Types.SET_IMAGE_FOR_UPLOAD_SUCCESS]: successImageUpload,
  [Types.SET_IMAGE_FOR_UPLOAD_FAILURE]: failureImageUpload,
  [Types.INIT_IMAGE]: initImage
})
