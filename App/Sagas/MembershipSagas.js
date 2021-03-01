import MembershipActions, { MembershipTypes } from '../Redux/MembershipRedux'
import LoginMemberActions, { LoginMemberTypes } from '../Redux/LoginMembershipRedux'
import { baseListen } from './BaseSagas'
import dayjs from 'dayjs'
import size from 'lodash/size'
import { trackCustomEvent } from '../Services/Smartlook'

import { call, put, fork } from 'redux-saga/effects'
import { updateUserDataAPI, fetchUserDataAPI } from '../Sagas/UserSagas'
import { Navigate } from '../Services/NavigationService'

export const loginMember = (state) => state.loginMember

export function * retrieveMembershipApiData (api, getToken, data) {
  yield baseListen(MembershipTypes.RETRIEVE_MEMBERSHIP,
    fetchMembershipApiData,
    api, data, getToken)
}

export function * fetchMembershipApiData (api, data, getToken) {
  try {
    // do api call
    yield fork(fetchUserDataAPI, api, getToken, data)
    let membershipData = data.membership
    const res = yield call(api.postMembershipApiData, membershipData)
    if (!res.ok) {
      yield put(MembershipActions.membershipFailure('Terjadi kesalahan, ulangi beberapa saat lagi'))
    } else if (res.ok) {
      let resData = res.data.data
      if (data.user.group['NOT LOGGED IN'] === '') {
        delete data.user.group['NOT LOGGED IN']
        delete data.user.group['NOT LOGGED IN_is_verified']
        delete data.user.group['NOT LOGGED IN_expiration_date']
      }
      if (resData.expiration_date) {
        if (membershipData.company_id === 'AHI') {
          data.user.group['AHI_expiration_date'] = dayjs(resData.expiration_date).format('YYYY-MM-DD HH:mm:ss')
        } else if (membershipData.company_id === 'HCI') {
          data.user.group['HCI_expiration_date'] = dayjs(resData.expiration_date).format('YYYY-MM-DD HH:mm:ss')
        } else if (membershipData.company_id === 'TGI') {
          data.user.group['TGI_expiration_date'] = dayjs(resData.expiration_date).format('YYYY-MM-DD HH:mm:ss')
        }
      }
      if (!resData.is_password_valid) {
        const regex = /[A-Z]{2,3}/
        let memberID = membershipData.member_id.match(regex)
        if (membershipData.member_id === '') {
          yield put(MembershipActions.membershipFailure('Nomor Member tidak Terdaftar'))
        } else if (resData.is_verified === '0') {
          yield put(MembershipActions.membershipFailure('Nomor Member tidak Terdaftar'))
        } else if (memberID[0] !== 'AR' && memberID[0] !== 'ARE' && memberID[0] !== 'TAM' && membershipData.company_id === 'AHI') {
          if (membershipData.member_pass === '' && size(membershipData.member_id) === 10) {
            yield put(MembershipActions.membershipFailure('Silahkan lengkapi passkey Anda'))
          } else {
            yield put(MembershipActions.membershipFailure('Nomor Member tidak Terdaftar'))
          }
        } else if (memberID[0] !== 'IR' && memberID[0] !== 'TIM' && membershipData.company_id === 'HCI') {
          if (membershipData.member_pass === '' && size(membershipData.member_id) === 10) {
            yield put(MembershipActions.membershipFailure('Silahkan lengkapi passkey Anda'))
          } else {
            yield put(MembershipActions.membershipFailure('Nomor Member tidak Terdaftar'))
          }
        } else if (membershipData.member_pass === '') {
          yield put(MembershipActions.membershipFailure('Silahkan lengkapi passkey Anda'))
        } else {
          yield put(MembershipActions.membershipFailure('Passkey yang Anda masukkan salah'))
        }
      } else if (resData.is_password_valid) {
        if (resData.is_verified === '10') {
          if (membershipData.company_id === 'AHI') {
            data.user.group['AHI_is_verified'] = resData.is_verified
          } else if (membershipData.company_id === 'HCI') {
            data.user.group['HCI_is_verified'] = resData.is_verified
          } else if (membershipData.company_id === 'TGI') {
            data.user.group['TGI_is_verified'] = resData.is_verified
          }
          yield put(MembershipActions.membershipSuccess(res))
          yield fork(updateUserDataAPI, api, getToken, { data })
        } else if (resData.is_verified === '5') {
          if (membershipData.company_id === 'AHI') {
            data.user.group['AHI_is_verified'] = resData.is_verified
          } else if (membershipData.company_id === 'HCI') {
            data.user.group['HCI_is_verified'] = resData.is_verified
          } else if (membershipData.company_id === 'TGI') {
            data.user.group['TGI_is_verified'] = resData.is_verified
          }
          yield put(MembershipActions.membershipSuccess(res))
          yield fork(updateUserDataAPI, api, getToken, { data })
        }
      } else {
        yield put(MembershipActions.membershipFailure('Nomor Member tidak Terdaftar'))
      }
    }
  } catch (e) {
    if (__DEV__) {
      console.log(e)
    }
  }
}

export function * loginAce (api, getToken, data) {
  yield baseListen(LoginMemberTypes.LOGIN_MEMBER_REQUEST,
    fetchLoginAceApi,
    api, data, getToken)
}

export function * fetchLoginAceApi (api, { data }, getToken) {
  const token = yield call(getToken)
  let res = yield call(api.loginAce, token, data)
  trackCustomEvent('loginAce_saga_response', { name: 'loginAce', res: JSON.stringify(res) })

  if (res.ok && !res.data.error) {
    const success = yield put(LoginMemberActions.loginMemberSuccess(res.data.data))
    yield fork(fetchUserDataAPI, api, getToken, { data })
    if (success) {
      Navigate('Profil')
    }
  } else {
    yield put(LoginMemberActions.loginMemberFailure(res.data.message))
  }
}
