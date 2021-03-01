// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  otpCheckRequest: ['data', 'dataTemp'],
  otpCheckSuccess: ['data'],
  otpCheckFailure: ['err'],
  otpGenerateRequest: ['data'],
  otpGenerateSuccess: ['data'],
  otpGenerateFailure: ['err'],
  otpValidateRequest: ['data'],
  otpValidateSuccess: ['data'],
  otpValidateFailure: ['err'],
  otpChoicesRequest: ['data', 'dataTemp'],
  otpChoicesSuccess: ['data'],
  otpChoicesFailure: ['err'],
  otpUpdatePhoneRequest: ['data'],
  otpUpdatePhoneSuccess: ['data'],
  otpUpdatePhoneFailure: ['err'],
  otpForgotPasswordRequest: ['data'],
  otpForgotPasswordSuccess: ['data'],
  otpForgotPasswordFailure: ['err'],
  otpSaveDataGenerate: ['data'],
  otpSaveDataTemp: ['data'],
  otpAddDataTemp: ['data'],
  otpInit: null,
  otpResetStatus: null,
  otpAceRequest: ['data'],
  otpAceSuccess: ['data'],
  otpAceFailure: ['err'],
  otpAceValidateRequest: ['data'],
  otpAceValidateSuccess: ['data'],
  otpAceValidateFailure: ['err'],
  otpVerifyPhoneRequest: ['data'],
  otpVerifyPhoneSuccess: ['data'],
  otpVerifyPhoneFailure: ['err']
})

export const OtpTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  success: false,
  data: null,
  dataOtp: null,
  dataChoices: null,
  dataTemp: {},
  generateData: null,
  tokenFogotPassword: null,
  errChoices: false,
  errGenerate: null,
  errValidate: null,
  err: null,
  fetchingValidate: false,
  successValidate: false,
  fetchingGenerate: false,
  successGenerate: false,
  fetchingChoices: false,
  successChoices: false,
  fetchingUpdatePhone: false,
  successUpdatePhone: false,
  fetchingForgotPassword: false,
  successForgotPassword: false,
  fetchingAce: false,
  successAce: false,
  aceOtp: null,
  fetchingAceValidate: false,
  successAceValidate: false,
  fetchingVerify: false,
  successVerify: false,
  errVerify: null
})

/* ------------- Reducers ------------- */

export const request = (state, { dataTemp = {} }) => {
  return state.merge({
    fetching: true,
    success: false,
    err: null,
    dataTemp
  })
}

export const success = (state, { data }) => {
  return state.merge({
    fetching: false,
    success: true,
    dataOtp: data,
    err: null
  })
}

export const failure = (state, { err }) => state.merge({
  fetching: false,
  success: false,
  data: null,
  err
})

export const validateSuccess = (state, { data }) => {
  return state.merge({
    fetchingValidate: false,
    successValidate: true,
    data,
    errValidate: null
  })
}

export const validateRequest = (state) => state.merge({
  fetchingValidate: true,
  successValidate: false,
  data: null,
  errValidate: null
})

export const validateFailure = (state, { err }) => state.merge({
  fetchingValidate: false,
  successValidate: false,
  data: null,
  errValidate: err
})

export const generateRequest = (state, { data }) => state.merge({
  fetchingGenerate: true,
  successGenerate: false,
  generateData: data,
  errGenerate: null,
  err: null
})

export const generateSuccess = (state, { data }) => {
  return state.merge({
    fetchingGenerate: false,
    successGenerate: true,
    data,
    errGenerate: null,
    err: null
  })
}

export const generateFailure = (state, { err }) => state.merge({
  fetchingGenerate: false,
  successGenerate: false,
  data: null,
  errGenerate: err
})

export const choicesSuccess = (state, { data }) => {
  return state.merge({
    fetchingChoices: false,
    successChoices: true,
    dataChoices: data,
    errChoices: null
  })
}

export const choicesFailure = (state, { err }) => state.merge({
  fetchingChoices: false,
  successChoices: false,
  dataChoices: null,
  errChoices: err
})

export const choicesRequest = (state, { dataTemp = state.dataTemp }) => state.merge({
  fetchingChoices: true,
  successChoices: false,
  dataChoices: null,
  errChoices: null,
  dataTemp
})

export const updatePhoneSuccess = (state, { data }) => {
  return state.merge({
    fetchingUpdatePhone: false,
    successUpdatePhone: true,
    data,
    err: null
  })
}

export const updatePhoneFailure = (state, { err }) => state.merge({
  fetchingUpdatePhone: false,
  successUpdatePhone: false,
  data: null,
  err
})

export const updatePhoneRequest = (state) => state.merge({
  fetchingUpdatePhone: true,
  successUpdatePhone: false,
  data: null,
  err: null
})

export const forgotPasswordRequest = (state) => state.merge({
  fetchingForgotPassword: true,
  successForgotPassword: false,
  tokenFogotPassword: null
})

export const forgotPasswordFailure = (state, { err }) => state.merge({
  fetchingForgotPassword: false,
  successForgotPassword: false,
  tokenFogotPassword: null,
  err
})

export const forgotPasswordSuccess = (state, { data }) => {
  return state.merge({
    fetchingForgotPassword: false,
    successForgotPassword: true,
    tokenFogotPassword: data,
    err: null
  })
}

export const init = (state) => state.merge({
  fetching: false,
  success: false,
  successAce: false,
  data: null,
  dataTemp: {},
  generateData: null,
  dataOtp: null,
  dataChoices: null,
  tokenFogotPassword: null,
  err: null
})

export const resetStatus = (state) => state.merge({
  fetching: false,
  success: false,
  fetchingGenerate: false,
  fetchingChoices: false,
  fetchingUpdatePhone: false,
  fetchingValidate: false,
  fetchingForgotPassword: false,
  successForgotPassword: false,
  successGenerate: false,
  successValidate: false,
  successUpdatePhone: false,
  successChoices: false,
  err: null,
  errGenerate: null,
  errValidate: null,
  fetchingVerify: false,
  successVerify: false
})

export const aceRequest = (state) => {
  return state.merge({
    fetchingAce: true,
    successAce: false,
    err: null
  })
}

export const aceSuccess = (state, { data }) => {
  return state.merge({
    fetchingAce: false,
    successAce: true,
    success: true,
    aceOtp: data,
    errValidate: null,
    err: null
  })
}

export const aceFailure = (state, { err }) => state.merge({
  fetchingAce: false,
  successAce: false,
  aceOtp: null,
  err
})

export const aceValidateSuccess = (state, { data }) => {
  return state.merge({
    fetchingAceValidate: false,
    successAceValidate: true,
    data,
    errValidate: null
  })
}

export const aceValidateRequest = (state) => state.merge({
  fetchingAceValidate: true,
  successAceValidate: false,
  data: null,
  successAce: false,
  errValidate: null
})

export const aceValidateFailure = (state, { err }) => state.merge({
  fetchingAceValidate: false,
  successAceValidate: false,
  data: null,
  errValidate: err
})

export const verifyPhoneRequest = (state) => state.merge({
  fetchingVerify: true,
  successVerify: false,
  data: null,
  err: null
})

export const verifyPhoneSuccess = (state, { data }) => {
  return state.merge({
    fetchingVerify: false,
    successVerify: true,
    data,
    err: null
  })
}

export const verifyPhoneFailure = (state, { err }) => state.merge({
  fetchingVerify: false,
  successVerify: false,
  data: null,
  err: err
})

export const saveDataGenerateOtp = (state, { data }) => state.merge({ generateData: data })
export const saveDataTemp = (state, { data }) => state.merge({ dataTemp: data })
export const addDataTemp = (state, { data }) => state.merge({ dataTemp: { ...state.dataTemp, ...data } })

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OTP_CHECK_SUCCESS]: success,
  [Types.OTP_CHECK_REQUEST]: request,
  [Types.OTP_CHECK_FAILURE]: failure,
  [Types.OTP_GENERATE_SUCCESS]: generateSuccess,
  [Types.OTP_GENERATE_REQUEST]: generateRequest,
  [Types.OTP_GENERATE_FAILURE]: generateFailure,
  [Types.OTP_VALIDATE_SUCCESS]: validateSuccess,
  [Types.OTP_VALIDATE_REQUEST]: validateRequest,
  [Types.OTP_VALIDATE_FAILURE]: validateFailure,
  [Types.OTP_VALIDATE_SUCCESS]: validateSuccess,
  [Types.OTP_CHOICES_SUCCESS]: choicesSuccess,
  [Types.OTP_CHOICES_REQUEST]: choicesRequest,
  [Types.OTP_CHOICES_FAILURE]: choicesFailure,
  [Types.OTP_UPDATE_PHONE_SUCCESS]: updatePhoneSuccess,
  [Types.OTP_UPDATE_PHONE_REQUEST]: updatePhoneRequest,
  [Types.OTP_UPDATE_PHONE_FAILURE]: updatePhoneFailure,
  [Types.OTP_FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
  [Types.OTP_FORGOT_PASSWORD_REQUEST]: forgotPasswordRequest,
  [Types.OTP_FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
  [Types.OTP_INIT]: init,
  [Types.OTP_RESET_STATUS]: resetStatus,
  [Types.OTP_SAVE_DATA_GENERATE]: saveDataGenerateOtp,
  [Types.OTP_SAVE_DATA_TEMP]: saveDataTemp,
  [Types.OTP_ADD_DATA_TEMP]: addDataTemp,
  [Types.OTP_ACE_SUCCESS]: aceSuccess,
  [Types.OTP_ACE_REQUEST]: aceRequest,
  [Types.OTP_ACE_FAILURE]: aceFailure,
  [Types.OTP_ACE_VALIDATE_REQUEST]: aceValidateRequest,
  [Types.OTP_ACE_VALIDATE_FAILURE]: aceValidateFailure,
  [Types.OTP_ACE_VALIDATE_SUCCESS]: aceValidateSuccess,
  [Types.OTP_VERIFY_PHONE_REQUEST]: verifyPhoneRequest,
  [Types.OTP_VERIFY_PHONE_SUCCESS]: verifyPhoneSuccess,
  [Types.OTP_VERIFY_PHONE_FAILURE]: verifyPhoneFailure
})
