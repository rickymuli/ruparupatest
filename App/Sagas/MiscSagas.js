import { baseListen, baseFetchNoToken } from './BaseSagas'
import { put, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import MiscActions, { MiscTypes } from '../Redux/MiscRedux'
import StoreDataActions, { StoreDataTypes } from '../Redux/StoreDataRedux'
import NewsletterActions, { NewsletterTypes } from '../Redux/NewsletterRedux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import isEmpty from 'lodash/isEmpty'
import gt from 'lodash/gt'

export function * getExploreByCategory (api) {
  yield baseListen(MiscTypes.MISC_GET_EXPLORE_BY_CATEGORY,
    fetchExploreByCategory,
    api)
}

export function * fetchExploreByCategory (api, data) {
  yield baseFetchNoToken(api.getCmsBlockDetail,
    data.identifier,
    MiscActions.miscGetExploreByCategorySuccess,
    MiscActions.miscGetExploreByCategoryFailure)
}

export function * getStoreData (api, token) {
  yield baseListen(StoreDataTypes.STORE_DATA_REQUEST,
    fetchStoreData,
    api, token)
}

export function * fetchStoreData (api, token, { data }) {
  try {
    token = yield call(token)

    const res = yield call(api.getStoreData, data, token)
    if (!res.ok) {
      yield put(StoreDataActions.storeDataFailure('Terjadi kesalahan, ulangi beberapa saat lagi'))
    } else {
      if (_(res.data.error).keys().isEmpty() && res.data.data.is_valid) {
        var dt = new Date()
        dt.setHours(dt.getHours() + 2)
        // dt.setMinutes(dt.getMinutes() + 5)
        let storeData = res.data.data
        storeData.time_expire = dt
        yield AsyncStorage.setItem('store_new_retail_data', JSON.stringify(storeData))
        yield put(StoreDataActions.storeDataSuccess(res.data.data))
      } else {
        yield put(StoreDataActions.storeDataFailure(res.data.message))
      }
    }
  } catch (err) {
    yield put(StoreDataActions.storeDataFailure('Terjadi Kesalahn Koneksi'))
  }
}

export function * getBankInstallmentServer (api) {
  yield baseListen(MiscTypes.MISC_BANK_INSTALLMENT_SERVER,
    fetchBankInstallmentAPI,
    api)
}

export function * getBankInstallment (api) {
  yield baseListen(MiscTypes.MISC_BANK_INSTALLMENT_REQUEST,
    fetchBankInstallmentAPI,
    api)
}

export function * fetchBankInstallmentAPI (api, data) {
  const BANK_INSTALLMENT = yield AsyncStorage.getItem('BANK_INSTALLMENT')
  const expBankInstalment = yield AsyncStorage.getItem('expBankInstalment')
  if (!isEmpty(BANK_INSTALLMENT) && expBankInstalment && gt(new Date(expBankInstalment), new Date())) {
    yield put(MiscActions.miscBankInstallmentSuccess(JSON.parse(BANK_INSTALLMENT)))
  } else {
    try {
      const res = yield call(api.getBankInstallment, data)
      if (!res.ok) throw new Error('Terjadi kesalahan, ulangi beberapa saat lagi')
      else {
        if (!res.data.error) {
          let date = new Date()
          date.setDate(date.getDate() + 7)
          let newData = res.data.data.filter((o) => !isEmpty(o.tenor))
          AsyncStorage.setItem('expBankInstalment', JSON.stringify(date))
          AsyncStorage.setItem('BANK_INSTALLMENT', JSON.stringify(newData))
          yield put(MiscActions.miscBankInstallmentSuccess(newData))
        } else throw res.data.message || 'terjadi kesalahan koneksi'
      }
    } catch (err) {
      if (!isEmpty(BANK_INSTALLMENT)) yield put(MiscActions.miscBankInstallmentSuccess(JSON.parse(BANK_INSTALLMENT)))
      else yield put(MiscActions.miscBankInstallmentFailure(err))
    }
  }
}

export function * provinceData (api) {
  yield baseListen(MiscTypes.MISC_PROVINCE_REQUEST,
    fetchMiscProvinceAPI,
    api)
}

export function * cityData (api) {
  yield baseListen(MiscTypes.MISC_CITY_REQUEST,
    fetchMiscCityAPI,
    api)
}

export function * kecamatanData (api) {
  yield baseListen(MiscTypes.MISC_KECAMATAN_REQUEST,
    fetchMiscKecamatanAPI,
    api)
}

export function * fetchMiscProvinceAPI (api, data) {
  yield baseFetchNoToken(api.getProvince,
    data,
    MiscActions.miscProvinceSuccess,
    MiscActions.miscProvinceFailure)
}

export function * fetchMiscCityAPI (api, data) {
  yield baseFetchNoToken(api.getCity,
    data.id,
    MiscActions.miscCitySuccess,
    MiscActions.miscCityFailure)
}

export function * fetchMiscKecamatanAPI (api, data) {
  yield baseFetchNoToken(api.getKecamatan,
    data.id,
    MiscActions.miscKecamatanSuccess,
    MiscActions.miscKecamatanFailure)
}

export function * newsletterSubscribe (api) {
  yield baseListen(NewsletterTypes.NEWSLETTER_REQUEST,
    newsletterSubscribeAPI,
    api)
}

export function * newsletterSubscribeAPI (api, { data }) {
  if (data.email_address) {
    yield baseFetchNoToken(api.newsletterSubscribe,
      data,
      NewsletterActions.newsletterSuccess,
      NewsletterActions.newsletterFailure)
  } else {
    yield delay(0.001)
    const message = 'Periksa kembali email Anda.'
    yield put(NewsletterActions.newsletterFailure(message))
  }
}

export function * getExpressDelivery (api) {
  yield baseListen(MiscTypes.MISC_EXPRESS_DELIVERY_REQUEST,
    fetchExpressDeliveryAPI,
    api)
}

export function * fetchExpressDeliveryAPI (api, data) {
  // check if kecamatan support gosend
  const expressDelivery = yield call(api.getExpressDelivery, data.id)
  if (expressDelivery.data && !expressDelivery.data.error && expressDelivery.data.data) {
    // yield Cookies.set(config.expressDeliveryCookies, JSON.stringify({same_day: expressDelivery.data.data.same_day, instant_delivery: expressDelivery.data.data.instant_delivery}), { expires: 600 })
    yield put(MiscActions.miscExpressDeliverySuccess(expressDelivery.data.data))
  } else {
    yield put(MiscActions.miscExpressDeliveryFailure())
  }
}

export function * getVerifyMarketplaceAcquisition (api) {
  yield baseListen(MiscTypes.MISC_VERIFY_MARKETPLACE_ACQUISITION_REQUEST,
    fetchVerifyMarketplaceAcquisitionAPI,
    api)
}

export function * fetchVerifyMarketplaceAcquisitionAPI (api, { data }) {
  // check shopee / tokopedia sms voucher validity
  const verifyMarketplaceAcquisition = yield call(api.getVerifyMarketplaceAcquisition, data)
  if (verifyMarketplaceAcquisition.data && !verifyMarketplaceAcquisition.data.error && verifyMarketplaceAcquisition.data.data) {
    yield put(MiscActions.miscVerifyMarketplaceAcquisitionSuccess(verifyMarketplaceAcquisition.data.data))
  } else {
    yield put(MiscActions.miscVerifyMarketplaceAcquisitionFailure())
  }
}

export function * getFavoriteCategory (api) {
  yield baseListen(MiscTypes.MISC_GET_FAVORITE_CATEGORY,
    fetchFavoriteCategory,
    api)
}

export function * fetchFavoriteCategory (api, data) {
  yield baseFetchNoToken(api.getCmsBlockDetail,
    data.identifier,
    MiscActions.miscGetFavoriteCategorySuccess,
    MiscActions.miscGetFavoriteCategoryFailure)
}

export function * getVerifyStatic (api) {
  yield baseListen(MiscTypes.MISC_VERIFY_STATIC_REQUEST,
    fetchVerifyStatic,
    api
  )
}

export function * fetchVerifyStatic (api, { data }) {
  yield baseFetchNoToken(api.getStaticDetail,
    data,
    MiscActions.miscVerifyStaticSuccess,
    MiscActions.miscVerifyStaticFailure
  )
}

export function * getVerifyStaticTahu (api) {
  yield baseListen(MiscTypes.MISC_VERIFY_STATIC_TAHU_REQUEST,
    fetchVerifyStaticTahu,
    api
  )
}

export function * fetchVerifyStaticTahu (api, data) {
  yield baseFetchNoToken(api.getStaticDetail,
    data.data,
    MiscActions.miscVerifyStaticTahuSuccess,
    MiscActions.miscVerifyStaticFailure
  )
}

export function * getSubcategory (api) {
  yield baseListen(MiscTypes.MISC_SUBCATEGORY_REQUEST,
    fetchSubcategoryAPI,
    api)
}

export function * fetchSubcategoryAPI (api, data) {
  yield baseFetchNoToken(api.getCmsBlockDetail,
    data.identifier,
    MiscActions.miscSubcategorySuccess,
    MiscActions.miscSubcategoryFailure)
}

export function * getExploreByTrending (api) {
  yield baseListen(MiscTypes.MISC_GET_EXPLORE_BY_TRENDING,
    fetchExploreByTrending,
    api)
}

export function * fetchExploreByTrending (api, data) {
  yield baseFetchNoToken(api.getCmsBlockDetail,
    data.identifier,
    MiscActions.miscGetExploreByTrendingSuccess,
    MiscActions.miscGetExploreByTrendingFailure)
}

export function * getPromoBank (api) {
  yield baseListen(MiscTypes.MISC_PROMO_BANK_REQUEST,
    fetchPromoBankAPI,
    api)
}

export function * fetchPromoBankAPI (api, data) {
  yield baseFetchNoToken(api.getCmsBlockDetail,
    data.identifier,
    MiscActions.miscPromoBankSuccess,
    MiscActions.miscPromoBankFailure)
}

export function * getPromoBanner (api) {
  yield baseListen(MiscTypes.MISC_PROMO_BANNER_REQUEST,
    fetchPromoBannerAPI,
    api)
}

export function * fetchPromoBannerAPI (api) {
  const res = yield call(api.getPromoBanner)
  if (!res.ok) {
    yield put(MiscActions.miscPromoBannerFailure('Terjadi kesalahan koneksi'))
  } else {
    if (isEmpty(res.data.error)) {
      yield put(MiscActions.miscPromoBannerSuccess(res.data.data))
    } else {
      yield put(MiscActions.miscPromoBannerFailure(res.data.message))
    }
  }
}

export function * getCustom (api) {
  yield baseListen(MiscTypes.MISC_GET_CUSTOM_REQUEST,
    fetchGetCustomAPI,
    api)
}

export function * fetchGetCustomAPI (api, { data }) {
  const res = yield call(api.getCustom, data)
  if (!res.ok) {
    yield put(MiscActions.miscGetCustomFailure('Terjadi kesalahan koneksi'))
  } else {
    if (isEmpty(res.data.error)) {
      yield put(MiscActions.miscGetCustomSuccess(res.data.data))
    } else {
      yield put(MiscActions.miscGetCustomFailure(res.data.message))
    }
  }
}

export function * getStaticUrl (api) {
  yield baseListen(MiscTypes.MISC_GET_STATIC_URL_REQUEST, fetchgetStaticUrl, api)
}

function * fetchgetStaticUrl (api) {
  yield baseFetchNoToken(api.getStaticUrl, null, MiscActions.miscGetStaticUrlSuccess, MiscActions.miscGetStaticUrlFailure)
}

export function * sendCrashUserFeedback (api) {
  yield baseListen(MiscTypes.MISC_SEND_CRASH_USER_FEEDBACK, sendCrashUserFeedbackApi, api)
}

export function * sendCrashUserFeedbackApi (api, { data }) {
  yield call(api.sendCrashUserFeedback, data)
}
