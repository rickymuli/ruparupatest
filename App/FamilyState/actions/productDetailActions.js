import api from '../ApiContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import isEmpty from 'lodash/isEmpty'

const getStoreNewRetail = async () => {
  const storeNewRetailData = await AsyncStorage.getItem('store_new_retail_data')
  return (!isEmpty(storeNewRetailData) && !isEmpty(storeNewRetailData.store_code)) ? storeNewRetailData.store_code : ''
}

export const actions = (props) => {
  const { dispatch } = props
  return {
    getProductDetail: async (urlKey, storeCodeNewRetail = '', isScanned = 0) => {
      dispatch({ type: 'request' })
      try {
        const res = await api.productDetailPage.getProductDetail(urlKey, storeCodeNewRetail, isScanned)
        if (res.status === 200) {
          if (isEmpty(res.data.error)) {
            dispatch({ type: 'success', data: res.data.data })
          } else dispatch({ type: 'failure', error: res.data.message })
        }
      } catch (e) {
        dispatch({ type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      }
    },
    getProductStock: async (sku, isScanned = false) => {
      dispatch({ type: 'stockRequest' })
      try {
        const storeNewRetailCode = await getStoreNewRetail()
        const res = await api.productDetailPage.getProductStock(sku, isScanned, storeNewRetailCode)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ type: 'stockSuccess', data: res.data.data })
          } else {
            dispatch({ type: 'stockFailure', error: res.data.message })
          }
        }
      } catch (e) {
        dispatch({ type: 'stockFailure', error: 'Terjadi Kesalahan Koneksi' })
      }
    },
    getMaxStock: async (sku, district, isScanned = 0) => {
      dispatch({ type: 'maxStockRequest' })
      try {
        const storeNewRetailCode = await getStoreNewRetail()
        const res = await api.productDetailPage.getMaxStock(sku, district, storeNewRetailCode, isScanned)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ type: 'maxStockSuccess', data: res.data.data })
          } else {
            dispatch({ type: 'maxStockFailure', error: res.data.message })
          }
        }
      } catch (e) {
        dispatch({ type: 'maxStockFailure', error: 'Terjadi Kesalahan Koneksi' })
      }
    },
    getProductCanDelivery: async (sku, district, qty, storeCodeNewRetail = '', isScanned = 0) => {
      dispatch({ type: 'canDeliveryRequest' })
      try {
        const storeNewRetailCode = await getStoreNewRetail()
        const res = await api.productDetailPage.getProductCanDelivery(sku, district, qty, storeNewRetailCode, isScanned)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ type: 'canDeliverySuccess', data: res.data.data })
          } else {
            dispatch({ type: 'canDeliveryFailure', error: res.data.message })
          }
        }
      } catch (e) {
        dispatch({ type: 'canDeliveryFailure', error: 'Terjadi Kesalahan Koneksi' })
      }
    },
    // getRelatedProducts: async () => {
    //   dispatch({ type: 'relatedProductsRequest' })
    //   try {

    //   } catch (e) {

    //   }
    // },
    // getPromoVoucherDetail: async () => {
    //   dispatch({ type: 'promoVoucherRequest' })
    //   try {

    //   } catch (e) {

    //   }
    // },
    getVoucherRemaining: async (voucherCode) => {
      dispatch({ type: 'voucherRemainingRequest' })
      try {
        const res = await api.productDetailPage.remainingVoucher(voucherCode)
        if (res.status === 200) {
          dispatch({ type: 'voucherRemainingFailure', error: res.data.message })
        } else {
          dispatch({ type: 'voucherRemainingSuccess', data: res.data.data })
        }
      } catch (e) {

      }
    },
    initProductDetailPage: () => dispatch({ type: 'initPdp' })
  }
}
export default actions
