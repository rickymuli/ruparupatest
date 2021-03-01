import { baseListen } from './BaseSagas'
import { Platform } from 'react-native'
import ReturnRefundHandlerActions, { ReturnRefundHandlerTypes } from '../Redux/ReturnRefundHandlerRedux'
import { put, call } from 'redux-saga/effects'
import RNFS from 'react-native-fs'
import isEmpty from 'lodash/isEmpty'

export function * uploadImage (api) {
  yield baseListen(ReturnRefundHandlerTypes.SET_IMAGE_FOR_UPLOAD, uploadImageApi, api)
}

function * uploadImageApi (api, { data }) {
  let imageDest = '' // For ios
  let imageData = {}
  let result = {}
  let image = data.output[0]
  let imageValid = true
  if (Platform.OS === 'ios' && image.uri.substring(0, 3) === 'ph:') {
    let regex = /(.{36})\//i
    let result = image.uri.match(regex)
    let photoPath = `assets-library://asset/asset.JPG?id=${result[0]}&ext=JPG`
    try {
      const dest = `${RNFS.TemporaryDirectoryPath}${Math.random().toString(36).substring(7)}.jpg`
      imageDest = yield RNFS.copyAssetsFileIOS(photoPath, dest, 500, 500, 1.0, 1.0, 'contain')
      imageData = yield RNFS.stat(imageDest)
    } catch (err) {
      yield put(ReturnRefundHandlerActions.setImageForUploadFailure(err))
      if (__DEV__) {
        console.log('Error: ', err)
      }
    }
  } else {
    imageDest = image.uri
    imageData = yield RNFS.stat(image.uri)
  }
  if (imageData.size >= 2000000) {
    yield put(ReturnRefundHandlerActions.setImageForUploadFailure('Gambar anda memiliki ukuran lebih dari 2MB'))
    imageValid = false
  } else {
    try {
      let imageSplit = image.uri.split('/')
      let imageName = imageSplit[imageSplit.length - 1].split('.')
      let imageFormat = imageName[imageName.length - 1]
      let imageBase64 = yield RNFS.readFile(imageDest, 'base64')
      result = {
        image: `data:image/${imageFormat};base64,${imageBase64}`
      }
      yield RNFS.unlink(imageDest) // This works like linux rm -rf. Delete temporary file as soon as you finished creating the result object
    } catch (error) {
      yield put(ReturnRefundHandlerActions.setImageForUploadFailure(error))
      if (__DEV__) {
        console.log('Read file error', error)
      }
    }
  }
  if (imageValid) {
    const res = yield call(api.uploadImage, result, 'TestingReturn', 'imgReturn')
    if (res.ok) {
      if (!isEmpty(res.data) && !isEmpty(res.data.error)) {
        yield put(ReturnRefundHandlerActions.setImageForUploadFailure(res.data.message))
      } else {
        data.output = res.data.data
        yield put(ReturnRefundHandlerActions.setImageForUploadSuccess(data))
      }
    } else {
      yield put(ReturnRefundHandlerActions.setImageForUploadFailure(res.problem))
    }
  }
}
