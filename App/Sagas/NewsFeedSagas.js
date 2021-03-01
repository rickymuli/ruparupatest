import { take, fork, put } from 'redux-saga/effects'
import NewsFeedActions, { NewsFeedTypes } from '../Redux/NewsFeedRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import firebase from '@react-native-firebase/app'
import { END } from 'redux-saga'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import dayjs from 'dayjs'

export function * getNewsFeedRequest () {
  let action = yield take(NewsFeedTypes.NEWS_FEED_REQUEST)
  while (action !== END) {
    yield fork(getNewsFeed, action)
    action = yield take(NewsFeedTypes.NEWS_FEED_REQUEST)
  }
}

function * getNewsFeed () {
  try {
    const snapshot = null // yield firebase.firestore().collection('feed').doc('1').get()
    const data = snapshot// snapshot.data()
    const storageData = yield AsyncStorage.getItem('newsfeed')
    let orderStatusData = yield AsyncStorage.getItem('newsfeed-order-status')
    if (isEmpty(orderStatusData)) {
      orderStatusData = '[]'
    }
    let currData = data
    currData.createdDate = dayjs(data.start_date, 'YYYY-MM-DD HH:mm', false).format('LLL')
    // let sortedArr = JSON.parse(orderStatusData).concat(currData).sort((a, b) => (a.createdDate > b.createdDate) ? -1 : ((b.createdDate > a.createdDate) ? 1 : 0))
    let sortedArr = JSON.parse(orderStatusData).concat(currData).sort(function compare (a, b) {
      var dateA = new Date(a.createdDate)
      var dateB = new Date(b.createdDate)
      return dateB - dateA
    })
    if (!isEmpty(data)) {
      if (!isEqual(data, JSON.parse(storageData))) {
        if (dayjs() >= dayjs(data.start_date) && dayjs() <= dayjs(data.end_date)) {
          yield AsyncStorage.setItem('newsfeed', JSON.stringify(data))
          yield AsyncStorage.setItem('newsfeed-mainnews', JSON.stringify(currData))
          yield put(NewsFeedActions.newsFeedSuccess({ data, sortedArr, show: true }))
        } else {
          yield put(NewsFeedActions.newsFeedSuccess({ show: false, sortedArr }))
        }
      } else {
        yield put(NewsFeedActions.newsFeedSuccess({ data, sortedArr, show: false }))
      }
    }
  } catch (error) {
    yield put(NewsFeedActions.newsFeedFailure({ err: error }))
  }
}

export function * addNewsFeedRequest () {
  let action = yield take(NewsFeedTypes.NEWS_FEED_ADD_NEWS)
  while (action !== END) {
    yield fork(addNewsFeed, action)
    action = yield take(NewsFeedTypes.NEWS_FEED_ADD_NEWS)
  }
}

function * addNewsFeed ({ data }) {
  try {
    let mainNews = yield AsyncStorage.getItem('newsfeed-mainnews')
    let orderStatusData = yield AsyncStorage.getItem('newsfeed-order-status')
    let newData = []
    let sortedArr
    if (data.pageType === 'status-order') {
      if (!isEmpty(orderStatusData)) {
        newData = [...JSON.parse(orderStatusData), data]
      } else {
        newData.push(data)
      }
      yield AsyncStorage.setItem('newsfeed-order-status', JSON.stringify(newData))
      if (mainNews && mainNews.length > 1) {
        sortedArr = newData.concat(JSON.parse(mainNews)).sort((a, b) => (a.createdDate > b.createdDate) ? -1 : ((b.createdDate > a.createdDate) ? 1 : 0))
      } else {
        sortedArr = newData.concat(JSON.parse(mainNews))
      }
    } else {
      if (!isEmpty(mainNews)) {
        newData = [...JSON.parse(mainNews), data]
      } else {
        newData.push(data)
      }
      yield AsyncStorage.setItem('newsfeed-mainnews', JSON.stringify(newData))
      if (orderStatusData && orderStatusData.length > 1) {
        sortedArr = newData.concat(JSON.parse(orderStatusData)).sort((a, b) => (a.createdDate > b.createdDate) ? -1 : ((b.createdDate > a.createdDate) ? 1 : 0))
      } else {
        sortedArr = newData.concat(JSON.parse(orderStatusData))
      }
    }
    yield put(NewsFeedActions.newsFeedAddNewsSuccess({ data: sortedArr }))
  } catch (error) {
    yield put(NewsFeedActions.newsFeedAddNewsFailure({ err: error }))
  }
}
