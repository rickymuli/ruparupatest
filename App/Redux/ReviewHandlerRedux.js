// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* --- Types and Action Creators --- */

const { Types, Creators } = createActions({

  saveImagesForUpload: ['imageData'],
  deleteImageRequest: ['index'],
  deleteImageSuccess: ['data'],
  deleteImageFailure: ['error'],
  saveSelectedProduct: ['data'],
  initStates: null
})

export const ReviewHandlerTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  images: [],
  selectedProduct: null,
  deletingImage: false,
  error: null
})

/* ------------- Reducers ------------- */
export const saveImages = (state, { imageData }) => state.merge({ images: imageData })

export const deleteRequest = (state) => state.merge({ deleteImage: true })

export const deleteSuccess = (state, { data }) => state.merge({ deleteImage: false, images: data.images })

export const failure = (state, { error }) => state.merge({ deleteImage: false, error })

export const saveProduct = (state, { data }) => state.merge({ selectedProduct: data })

export const init = (state) => state.merge({ images: [], deleteImage: false, error: null, selectedProduct: null })

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SAVE_IMAGES_FOR_UPLOAD]: saveImages,
  [Types.DELETE_IMAGE_REQUEST]: deleteRequest,
  [Types.DELETE_IMAGE_SUCCESS]: deleteSuccess,
  [Types.DELETE_IMAGE_FAILURE]: failure,
  [Types.SAVE_SELECTED_PRODUCT]: saveProduct,
  [Types.INIT_STATES]: init
})
