import { take, select, put, fork } from 'redux-saga/effects'
import { END } from 'redux-saga'
import ReviewHandlerActions, { ReviewHandlerTypes } from '../Redux/ReviewHandlerRedux'

export const getReviewHandler = (state) => state.reviewHandler

export const deleteImage = function * () {
  let action = yield take(ReviewHandlerTypes.DELETE_IMAGE_REQUEST)
  while (action !== END) {
    yield fork(deleteImageAsync, action)
    action = yield take(ReviewHandlerTypes.DELETE_IMAGE_REQUEST)
  }
}

export const deleteImageAsync = function * ({ index }) {
  const reviewHandler = yield select(getReviewHandler)
  let newImages = [...reviewHandler.images]
  newImages.splice(index, 1)
  yield put(ReviewHandlerActions.deleteImageSuccess({ images: newImages }))
}
