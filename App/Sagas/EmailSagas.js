import { put } from 'redux-saga/effects'
import EmailActions, { EmailTypes } from '../Redux/EmailRedux'
import EmailValidator from '../Validations/Email'
import { baseListen, baseFetchNoToken } from './BaseSagas'

// forgot password
export function * sendEmailB2B (api) {
  yield baseListen(EmailTypes.EMAIL_B2B_REQUEST,
    fetchEmailB2BAPI,
    api)
}

// forgot password API
export function * fetchEmailB2BAPI (api, { data }) {
  const hasError = EmailValidator.b2bConstraints(data)
  if (hasError) {
    return yield put(EmailActions.emailB2bFailure(hasError))
  } else {
    yield baseFetchNoToken(api.emailB2B,
      data,
      EmailActions.emailB2bSuccess,
      EmailActions.emailB2bFailure)
  }
}
