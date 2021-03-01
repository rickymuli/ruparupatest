import { put, call, all } from 'redux-saga/effects'
import AddressActions, { AddressTypes } from '../Redux/AddressRedux'
import UserValidator from '../Validations/User'
import { baseListen, baseFetchToken, baseFetchSideEffectToken } from './BaseSagas'
import AuthActions from './AuthSagas'
import isEmpty from 'lodash/isEmpty'

export function * addressData (api, getToken) {
  yield baseListen(AddressTypes.ADDRESS_REQUEST,
    fetchAddressAPI,
    api,
    getToken)
}

export function * oneAddressData (api, getToken) {
  yield baseListen(AddressTypes.ADDRESS_ONE_REQUEST,
    fetchOneAddressAPI,
    api,
    getToken)
}

export function * createAddress (api, getToken) {
  yield baseListen(AddressTypes.ADDRESS_CREATE_REQUEST,
    createAddressAPI,
    api,
    getToken)
}

export function * primaryAddress (api, getToken) {
  yield baseListen(AddressTypes.ADDRESS_PRIMARY_REQUEST,
    primaryAddressAPI,
    api,
    getToken)
}

export function * deleteAddress (api, getToken) {
  yield baseListen(AddressTypes.ADDRESS_DELETE_REQUEST,
    deleteAddressAPI,
    api,
    getToken)
}

export function * fetchAddressAPI (api, getToken, data) {
  try {
    let token = yield call(getToken)
    if (!isEmpty(data) && !isEmpty(data.token)) token = data.token
    if (!token) {
      yield put(AuthActions.authLogout())
    } else {
      const res = yield call(api.getAddress, token)
      if (!res.ok) {
        yield put(AddressActions.addressFailure('Terjadi kesalahan koneksi'))
      }
      if (!res.data.error) {
        const primary = yield res.data.data.filter(value => parseInt(value.is_default) === 1)
        if (primary) {
          yield all([
            put(AddressActions.addressSuccess(res.data.data)),
            put(AddressActions.addressSelect(primary[0]))
          ])
        } else {
          yield all([
            put(AddressActions.addressSuccess(res.data.data)),
            put(AddressActions.addressSelect(res.data.data[0]))
          ])
        }
      } else {
        yield put(AddressActions.addressFailure(res.data.message))
      }
    }
  } catch (e) {
    yield put(AddressActions.addressFailure())
  }
}

export function * fetchOneAddressAPI (api, getToken, { data }) {
  yield baseFetchToken(api.getOneAddress,
    data,
    getToken,
    AddressActions.addressOneSuccess,
    AddressActions.addressFailure)
}

export function * createAddressAPI (api, getToken, { data }) {
  let hasError = UserValidator.addressConstraints(data)
  const strPhone = data.phone

  if (data.geolocation && !hasError) {
    if (strPhone.substring(0, 2) === '08') {
      let phoneLength = strPhone.length - 2
      if (phoneLength < 8) hasError = 'Nomor telepon harus terdiri dari 8 sampai 12 digit angka'
    }
  }

  if (hasError) {
    yield put(AddressActions.addressCreateFailure(hasError))
  } else {
    if (data.address_id) {
      yield baseFetchToken(api.updateAddress,
        data,
        getToken,
        AddressActions.addressCreateSuccess,
        AddressActions.addressCreateFailure
      )
    } else if (data.token) {
      try {
        const token = data.token
        if (!token) {
          yield put(AuthActions.authLogout())
        } else {
          const res = yield call(api.createAddress, token, data)
          if (!res.ok) {
            if (res.data && res.data.error) {
              yield put(AddressActions.addressCreateFailure(res.data.message))
            } else {
              yield put(AddressActions.addressCreateFailure('Terjadi kesalahan, ulangi beberapa saat lagi'))
            }
          } else {
            if (!res.data.error) {
              yield put(AddressActions.addressCreateSuccess(res.data.data))
            } else {
              yield put(AddressActions.addressCreateFailure(res.data.message))
            }
          }
        }
      } catch (e) {
        yield put(AddressActions.addressCreateFailure())
      }
    } else {
      yield baseFetchToken(api.createAddress,
        data,
        getToken,
        AddressActions.addressCreateSuccess,
        AddressActions.addressCreateFailure
      )
    }
  }
}

export function * primaryAddressAPI (api, getToken, { data }) {
  yield baseFetchSideEffectToken(api.primaryAddress,
    data,
    getToken,
    AddressActions.addressCreateSuccess,
    AddressActions.addressFailure,
    fetchAddressAPI,
    api
  )
}

export function * deleteAddressAPI (api, getToken, data) {
  yield baseFetchSideEffectToken(api.deleteAddress,
    data,
    getToken,
    AddressActions.addressCreateSuccess,
    AddressActions.addressFailure,
    fetchAddressAPI,
    api
  )
}
