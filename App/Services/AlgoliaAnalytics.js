import AlgoliaAnalytics from 'search-insights/lib/insights'
import AsyncStorage from '@react-native-async-storage/async-storage'
import isNull from 'lodash/isNull'
import GetLocalData from './GetLocalData'
import config from '../../config.js'

const aa = new AlgoliaAnalytics({
  requestFn (url, data) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
})

const createUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const anonymousAlgolia = async () => {
  let algoliaAnonymousToken = await GetLocalData.getAlgoliaAnonymousToken()

  if (isNull(algoliaAnonymousToken)) {
    algoliaAnonymousToken = createUUID()
    await AsyncStorage.setItem('algolia_anonymous_token', algoliaAnonymousToken)
  }

  return `anonymous-${algoliaAnonymousToken}`
}

export const algoliaInitClientInstance = async () => {
  aa.init({
    appId: config.apiIndexAlgolia,
    apiKey: config.apiKeyAlgolia
  })
  let userToken = await anonymousAlgolia()
  // let userToken = await GetLocalData.getToken()
  // if (!userToken) {
  //   userToken = await anonymousAlgolia()
  // } else {
  //   userToken = `user-${userToken}`
  // }

  aa.setUserToken(userToken)
}

export const trackAlgoliaClick = (hit) => {
  // pdp view from algolia searchbar result & pdp view from pcp algolia's instant search
  aa.clickedObjectIDsAfterSearch({
    userToken: aa._userToken,
    index: hit.index,
    eventName: hit.event,
    queryID: hit.__queryID,
    objectIDs: [hit.objectID],
    positions: [hit.__position]
  })
}

export const trackAlgoliaConvert = (hit) => {
  // add to cart in pdp, if item is from pcp algolia's instant search
  aa.convertedObjectIDsAfterSearch({
    userToken: aa._userToken,
    index: hit.index,
    eventName: 'product_detail',
    queryID: hit.__queryID,
    objectIDs: [hit.objectID]
  })
}

export const algoliaObjectHelper = (item) => {
  // to render ItemCard inside Flatlist
  return {
    name: item.name,
    is_in_stock: item.is_in_stock.ODI,
    brand: item.brand,
    variants: [{
      images: item.images,
      can_gosend: item.can_gosend,
      label: item.label.ODI,
      sku: item.sku,
      prices: [{
        price: item.default_price,
        special_price: (item.selling_price === item.default_price) ? 0 : item.selling_price
      }]
    }],
    url_key: item.url_key,
    multivariants: {}
  }
}
