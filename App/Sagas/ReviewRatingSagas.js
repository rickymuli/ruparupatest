import ReviewRatingActions, { ReviewRatingTypes } from '../Redux/ReviewRatingRedux'
import { baseListen, baseFetchToken, baseFetchNoToken } from './BaseSagas'
import { call, put, take, fork, cancel } from 'redux-saga/effects'
import AuthActions from '../Redux/AuthRedux'
import ReviewHandlerActions from '../Redux/ReviewHandlerRedux'
import has from 'lodash/has'
import RNFS from 'react-native-fs'
import { Platform } from 'react-native'

export function * fetchReviewRating (api, token) {
  yield baseListen(ReviewRatingTypes.FETCH_REVIEW_RATING_BY_SKU_REQUEST, fetchReviewRatingApi, api, token)
}

export function * fetchReviewRatingApi (api, getToken, data) {
  try {
    const token = yield call(getToken)
    const res = yield call(api.getReviewRatingBySku, token, data)
    if (res.ok) {
      if (res.data.error) {
        yield put(ReviewRatingActions.fetchReviewRatingBySkuFailure(res.data.error))
      } else {
        yield put(ReviewRatingActions.fetchReviewRatingBySkuSuccess(res.data.data))
      }
    }
  } catch (err) {
    yield put(ReviewRatingActions.fetchReviewRatingBySkuFailure(err))
  }
}

export function * sortReviewRating (api) {
  yield baseListen(ReviewRatingTypes.SORT_REVIEW_RATING_REQUEST, sortReviewRatingApi, api)
}

export function * sortReviewRatingApi (api, { sortType, sku }) {
  let filterType, star
  if (sortType === 'have_images') {
    filterType = sortType
    star = ''
  } else if (sortType !== '' && sortType !== 'have_images') {
    star = sortType
    filterType = ''
  } else {
    filterType = ''
    star = ''
  }
  let response = yield call(api.getSortReviewRating, { sku, filterType, star })
  if (response.ok) {
    if (response.data.error) {
      yield put(ReviewRatingActions.sortReviewRatingFailure(response.data.message))
    } else {
      yield put(ReviewRatingActions.sortReviewRatingSuccess(response.data.data))
    }
  } else {
    yield put(ReviewRatingActions.sortReviewRatingFailure())
  }
}

export function * likeReview (api, token) {
  // takeLatest sagas effect low level
  let lastTask
  while (true) {
    const action = yield take(ReviewRatingTypes.LIKE_REVIEW_REQUEST)
    if (lastTask) {
      yield cancel(lastTask)
    }
    lastTask = yield fork(likeReviewApi, api, token, action)
  }
}

export function * likeReviewApi (api, getToken, { data }) {
  try {
    const token = yield call(getToken)
    const res = yield call(api.likeUnlikeProductReview, data, token)
    if (res.ok) {
      if (res.data.error) {
        yield put(ReviewRatingActions.likeReviewFailure('Failed on like / unlike review'))
      } else {
        yield put(ReviewRatingActions.likeReviewSuccess(data))
      }
    }
  } catch (error) {
    yield put(ReviewRatingActions.likeReviewFailure('Failed on like / unlike review'))
  }
}

export function * countReview (api, token) {
  yield baseListen(ReviewRatingTypes.FETCH_REVIEW_RATING_COUNT_REQUEST, countReviewApi, api, token)
}

export function * countReviewApi (api, getToken) {
  yield baseFetchToken(api.getReviewCount, null, getToken, ReviewRatingActions.fetchReviewRatingCountSuccess, ReviewRatingActions.fetchReviewRatingCountFailure)
}

export function * fetchProductReview (api, token) {
  yield baseListen(ReviewRatingTypes.FETCH_PRODUCT_REVIEW_REQUEST, fetchProductReviewApi, api, token)
}

export function * fetchProductReviewApi (api, getToken, { reviewed, limit, offset }) {
  const token = yield call(getToken)
  if (!token) {
    yield put(AuthActions.authLogout())
  } else {
    const res = yield call(api.getUserProductReview, token, { reviewed, limit, offset })
    if (!res.ok) {
      if (res.data && res.data.error) {
        yield put(ReviewRatingActions.fetchProductReviewFailure(res.data.message))
      } else {
        yield put(ReviewRatingActions.fetchProductReviewFailure('Terjadi kesalahan koneksi'))
      }
    } else {
      if (!res.data.error) {
        yield put(ReviewRatingActions.fetchProductReviewSuccess({ ...res.data.data, for: (reviewed === 0) ? 'product' : 'history' }))
      } else {
        yield put(ReviewRatingActions.fetchProductReviewFailure(res.data.message))
      }
    }
  }
}

export function * fetchReviewTags (api) {
  yield baseListen(ReviewRatingTypes.FETCH_REVIEW_TAGS_REQUEST, fetchReviewTagsApi, api)
}

export function * fetchReviewTagsApi (api, { reviewType }) {
  yield baseFetchNoToken(
    api.getReviewTags,
    { reviewType },
    ReviewRatingActions.fetchReviewTagsSuccess,
    ReviewRatingActions.fetchReviewTagsFailure
  )
}

export function * insertProductReview (api, token) {
  yield baseListen(ReviewRatingTypes.INSERT_REVIEW_PRODUCT_REQUEST, insertProductReviewApi, api, token)
}

export function * insertProductReviewApi (api, getToken, { data }) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      let newData = { ...data }
      let imageValid = true
      if (has(data, 'images')) {
        let newImage = []
        let imageDest = '' // For ios
        for (let image of data.images) {
          let imageData = {}
          if (Platform.OS === 'ios' && image.uri.substring(0, 3) === 'ph:') {
            let regex = /(.{36})\//i
            let result = image.uri.match(regex)
            let photoPath = `assets-library://asset/asset.JPG?id=${result[0]}&ext=JPG`
            try {
              const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.jpg`
              imageDest = yield RNFS.copyAssetsFileIOS(photoPath, dest, 500, 500, 1.0, 1.0, 'contain')
              imageData = yield RNFS.stat(imageDest)
            } catch (err) {
              if (__DEV__) {
                console.log('Error: ', err)
              }
            }
            // yield RNFS.unlink(imageDest)
          } else {
            imageDest = image.uri
            imageData = yield RNFS.stat(image.uri)
          }
          if (imageData.size >= 2000000) {
            yield put(ReviewRatingActions.insertReviewProductFailure('Salah 1 gambar anda memiliki ukuran lebih dari 2MB'))
            imageValid = false
            break
          } else {
            try {
              let imageSplit = image.uri.split('/')
              let imageName = imageSplit[imageSplit.length - 1].split('.')
              let imageFormat = imageName[imageName.length - 1]
              let imageBase64 = yield RNFS.readFile(imageDest, 'base64')
              newImage.push(`data:image/${imageFormat};base64,${imageBase64}`)
            } catch (error) {
              if (__DEV__) {
                console.log('Read file error', error)
              }
            }
          }
        }
        newData.images = newImage
        data.images = newImage
      }
      if (imageValid) {
        const res = yield call(api.postProductReview, token, newData)
        if (!res.ok) {
          if (res.data && res.data.error) {
            yield put(ReviewRatingActions.insertReviewProductFailure(res.data.message))
          } else {
            yield put(ReviewRatingActions.insertReviewProductFailure('Terjadi kesalahan koneksi'))
          }
        } else {
          if (!res.data.error) {
            yield put(ReviewHandlerActions.initStates())
            yield put(ReviewRatingActions.fetchProductReviewRequest(0, 10, 0))
            yield put(ReviewRatingActions.insertReviewProductSuccess(res.data.data))
          } else {
            yield put(ReviewRatingActions.insertReviewProductFailure(res.data.message))
          }
        }
      }
    }
  } catch (e) {
    yield put(ReviewRatingActions.insertReviewProductFailure())
  }
}

export function * fetchServiceReview (api, token) {
  yield baseListen(ReviewRatingTypes.FETCH_SERVICE_REVIEW_REQUEST, fetchServiceReviewApi, api, token)
}

export function * fetchServiceReviewApi (api, getToken, { reviewed, limit, offset }) {
  const token = yield call(getToken)
  if (!token) {
    yield put(AuthActions.authLogout())
  } else {
    const res = yield call(api.getServiceReview, token, { reviewed, limit, offset })
    if (!res.ok) {
      if (res.data && res.data.error) {
        yield put(ReviewRatingActions.fetchServiceReviewFailure(res.data.message))
      } else {
        yield put(ReviewRatingActions.fetchServiceReviewFailure('Terjadi kesalahan koneksi'))
      }
    } else {
      if (!res.data.error) {
        yield put(ReviewRatingActions.fetchServiceReviewSuccess({ ...res.data.data, for: 'service' }))
      } else {
        yield put(ReviewRatingActions.fetchServiceReviewFailure(res.data.message))
      }
    }
  }
}

export function * fetchProductReviewByInvoice (api, token) {
  yield baseListen(ReviewRatingTypes.REVIEW_PRODUCT_BY_INVOICE_REQUEST, fetchProductReviewByInvoiceApi, api, token)
}

function * fetchProductReviewByInvoiceApi (api, getToken, { invoiceNo, sku }) {
  yield baseFetchToken(api.getReviewByInvoice, { invoiceNo, sku }, getToken, ReviewRatingActions.reviewProductByInvoiceSuccess, ReviewRatingActions.reviewProductByInvoiceFailure)
}

export function * insertServiceReview (api, token) {
  yield baseListen(ReviewRatingTypes.INSERT_REVIEW_SERVICE_REQUEST, insertServiceReviewApi, api, token)
}

export function * insertServiceReviewApi (api, getToken, { data }) {
  try {
    const token = yield call(getToken)
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      const res = yield call(api.postServiceReview, token, data)
      if (!res.ok) {
        if (res.data && res.data.error) {
          yield put(ReviewRatingActions.insertReviewServiceFailure(res.data.message))
        } else {
          yield put(ReviewRatingActions.insertReviewServiceFailure('Terjadi kesalahan koneksi'))
        }
      } else {
        if (!res.data.error) {
          yield put(ReviewHandlerActions.initStates())
          yield put(ReviewRatingActions.fetchServiceReviewRequest(0, 10, 0))
          yield put(ReviewRatingActions.insertReviewServiceSuccess(res.data.data))
        } else {
          yield put(ReviewRatingActions.insertReviewServiceFailure(res.data.message))
        }
      }
    }
  } catch (e) {
    yield put(ReviewRatingActions.insertReviewServiceFailure())
  }
}
