import AsyncStorage from '@react-native-async-storage/async-storage'

const getToken = async () => {
  try {
    let token = await AsyncStorage.getItem('access_token')
    return token
  } catch (error) {
    return error
  }
}

const getAlgoliaAnonymousToken = async () => {
  try {
    let token = await AsyncStorage.getItem('algolia_anonymous_token')
    return token
  } catch (error) {
    return error
  }
}

const getProductLastSeen = async () => {
  try {
    let value = await AsyncStorage.getItem('product_last_seen')
    return JSON.parse(value)
  } catch (error) {
    return false
  }
}

const getBankInstallment = async () => {
  try {
    let value = await AsyncStorage.getItem('bank_installment')
    return JSON.parse(value)
  } catch (error) {
    return false
  }
}

const getStoreData = async () => {
  try {
    let value = await AsyncStorage.getItem('store_new_retail_data')
    return JSON.parse(value)
  } catch (error) {
    return false
  }
}

const getCartId = async () => {
  try {
    let value = await AsyncStorage.getItem('cart_id')
    return value
  } catch (error) {
    return false
  }
}

const getStoreNewRetailData = async () => {
  try {
    let value = await AsyncStorage.getItem('store_new_retail_data')
    return JSON.parse(value) || {}
  } catch (error) {
    return false
  }
}

export default { getProductLastSeen, getStoreData, getToken, getCartId, getBankInstallment, getStoreNewRetailData, getAlgoliaAnonymousToken }
