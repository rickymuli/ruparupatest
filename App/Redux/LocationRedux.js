// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setProvinceRequest: ['data'],
  setCityRequest: ['data'],
  setKecamatanRequest: ['data'],
  ipLocationRequest: [''],
  ipLocationSuccess: ['data'],
  ipLocationFailure: ['err'],
  longLatLocationRequest: ['data'],
  longLatLocationSuccess: ['data'],
  longLatLocationFailure: ['err']
})

export const LocationDataTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  city: null,
  kecamatan: null,
  province: null,
  ipLocation: null,
  fetchingIpLocation: false,
  errIpLocation: null,
  longLatLocation: null,
  fetchingLongLatLocation: false,
  errLongLatLocation: null
})

/* ------------- Reducers ------------- */
// special for SSR
export const setProvince = (state, { data }) => {
  return state.merge({ province: { ...data } })
}

export const setCity = (state, { data }) => {
  return state.merge({ city: { ...data } })
}

export const setKecamatan = (state, { data }) => {
  return state.merge({ kecamatan: { ...data } })
}

export const ipLocationRequest = (state) =>
  state.merge({
    fetchingIpLocation: true,
    errIpLocation: null,
    ipLocation: null
  })

export const ipLocationSuccess = (state: Object, { data }: Object) =>
  state.merge({
    fetchingIpLocation: false,
    errIpLocation: null,
    ipLocation: data
  })

export const ipLocationFailure = (state: Object, { err }: Object) =>
  state.merge({
    fetchingIpLocation: false,
    errIpLocation: err
  })

export const longLatLocationRequest = (state) =>
  state.merge({
    longLatLocation: null,
    fetchingLongLatLocation: true,
    errLongLatLocation: null
  })

export const longLatLocationSuccess = (state: Object, { data }: Object) =>
  state.merge({
    longLatLocation: data,
    fetchingLongLatLocation: false,
    errLongLatLocation: null
  })

export const longLatLocationFailure = (state: Object, { err }: Object) =>
  state.merge({
    fetchingLongLatLocation: false,
    errLongLatLocation: err
  })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_PROVINCE_REQUEST]: setProvince,
  [Types.SET_CITY_REQUEST]: setCity,
  [Types.SET_KECAMATAN_REQUEST]: setKecamatan,
  [Types.IP_LOCATION_REQUEST]: ipLocationRequest,
  [Types.IP_LOCATION_SUCCESS]: ipLocationSuccess,
  [Types.IP_LOCATION_FAILURE]: ipLocationFailure,
  [Types.LONG_LAT_LOCATION_REQUEST]: longLatLocationRequest,
  [Types.LONG_LAT_LOCATION_SUCCESS]: longLatLocationSuccess,
  [Types.LONG_LAT_LOCATION_FAILURE]: longLatLocationFailure

})
