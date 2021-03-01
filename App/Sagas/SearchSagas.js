import { take, fork, put, select, call, cancel } from 'redux-saga/effects'
import { END, delay } from 'redux-saga'
import SearchActions, { SearchTypes } from '../Redux/SearchRedux'
import { baseListen, baseFetchNoToken } from './BaseSagas'
// import Cookies from 'cookies-js'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import map from 'lodash/map'

export const getSearchParameter = (state) => state.search

export const searchParameterServer = function * (api) {
  let action = yield take(SearchTypes.SEARCH_SERVER)
  while (action !== END) {
    yield fork(updateSearchParameterServer, api, action)
    action = yield take(SearchTypes.SEARCH_SERVER)
  }
}

export function * updateSearchParameterServer (api, { data }) {
  yield put(SearchActions.searchSuccess(data))
}

export const searchParameter = function * (api) {
  let action = yield take(SearchTypes.SEARCH_REQUEST)
  let task
  while (action !== END) {
    if (task) {
      yield cancel(task)
    }
    task = yield fork(updateSearchParameter, api, action)
    action = yield take(SearchTypes.SEARCH_REQUEST)
  }
}

export function * updateSearchParameter (api, { data }) {
  // yield delay(500)
  const state = yield select(getSearchParameter)
  let params = yield { ...state.data, ...data }
  if (params) {
    yield delay(0.001)
    yield put(SearchActions.searchSuccess(params))
  } else {
    yield put(SearchActions.searchFailure())
  }
}

export const searchProductByKeyword = function * (api, getStoreNewRetail, getAlgoliaUserToken) {
  let action = yield take(SearchTypes.SEARCH_BY_KEYWORD_REQUEST)
  let task
  while (action !== END) {
    if (task) {
      yield cancel(task)
    }
    task = yield fork(searchProductByKeywordAPI, api, getStoreNewRetail, getAlgoliaUserToken, action)
    action = yield take(SearchTypes.SEARCH_BY_KEYWORD_REQUEST)
  }
}

// attempts to fetch product
export function * searchProductByKeywordAPI (api, getStoreNewRetail, getAlgoliaUserToken, { keyword }) {
  // yield delay(20)
  // let parsedStoreData = {}
  let storeCode = ''
  const storeNewRetail = yield call(getStoreNewRetail)
  const algoliaUserToken = yield call(getAlgoliaUserToken)
  // parsedStoreData = JSON.parse(storeData.data)

  // No Cookie Js for React Native
  //   if (storeData) {
  //   } else {
  //     // check cookie
  //     const cookiesStoreData = yield Cookies.get('store_data')
  //     if (cookiesStoreData) {
  //       parsedStoreData = JSON.parse(cookiesStoreData)
  //     }
  // }
  if (!isEmpty(storeNewRetail)) {
    storeCode = storeNewRetail.store_code
  }

  const response = yield call(api.searchProductByKeyword, keyword, storeCode, algoliaUserToken)
  // let categoriesRelated = []
  // let arrLength = []
  if (response.ok) {
    const res = get(response, 'data.data')
    let data = {
      total: 0,
      products: [],
      categories: [],
      categoriesRelated: [],
      autoSuggestion: [],
      suggestKeyword: keyword
    }
    map(res.prd, item => { data.products.push({ name: item.name, url_key: item.url_key, variants: [{ sku: item.sku }], algoliaHit: { ...item, __queryID: res.queryId } }) })
    map(res.facets, (item, index) => { data.categories.push({ name: item, url: res.url[index] }) })
    data.autoSuggestion = map(res.sug, 'query')
    // if (response.data.data.prd.length <= response.data.data.sug.length) {
    //   arrLength = response.data.data.prd
    // } else {
    //   arrLength = response.data.data.sug
    // }
    // let a = 0
    // let url = ''
    // if (response.data.data.url) {
    //   for (let i = 0; i < arrLength.length; i++) {
    //     // console.log('PRD DATA', response.data.data.sug[a].query)
    //     let name = ''
    //     if (!isEmpty(response.data.data.sug)) {
    //       name = response.data.data.sug[i].query
    //     } else {
    //       name = response.data.data.prd[i].bread_crumb3_odi.name
    //     }
    //     url = response.data.data.url[i]
    //     data.categoriesRelated.push(
    //       {
    //         url_key: response.data.data.prd[a].bread_crumb3_odi.url,
    //         name: name,
    //         facets: response.data.data.facets[a],
    //         url: url
    //       }
    //     )
    //     a++
    //   }
    // }
    yield put(SearchActions.searchByKeywordSuccess(data))
  } else {
    yield put(SearchActions.searchByKeywordFailure('Oops, Terjadi kesalahan koneksi'))
  }
}

// not using anymore
export const searchProductByKeywordAndUrlKey = function * (api) {
  let action = yield take(SearchTypes.SEARCH_BY_KEYWORD_AND_URL_KEY_REQUEST)
  let task
  while (action !== END) {
    if (task) {
      yield cancel(task)
    }
    task = yield fork(searchProductByKeywordAndUrlKeyAPI, api, action)
    action = yield take(SearchTypes.SEARCH_BY_KEYWORD_AND_URL_KEY_REQUEST)
  }
}

// attempts to fetch product
export function * searchProductByKeywordAndUrlKeyAPI (api, { keyword, urlKey }) {
  const response = yield call(api.searchProductByKeywordAndUrlKey, keyword, urlKey)
  if (response.ok) {
    yield put(SearchActions.searchByKeywordAndUrlKeySuccess(response.data))
  } else {
    yield put(SearchActions.searchByKeywordAndUrlKeyFailure())
  }
}

export function * getSearchPageRedirect (api) {
  yield baseListen(SearchTypes.SEARCH_PAGE_REDIRECT_REQUEST,
    fetchSearchPageRedirectAPI,
    api)
}

export function * fetchSearchPageRedirectAPI (api, data) {
  yield baseFetchNoToken(api.searchPageRedirect,
    data.keyword,
    SearchActions.searchPageRedirectSuccess,
    SearchActions.searchPageRedirectFailure)
}
