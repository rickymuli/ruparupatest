// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authChangePasswordRequest: ['data'],
  authChangePasswordSuccess: null,
  authChangePasswordFailure: ['err'],
  authForgotPasswordRequest: ['data'],
  authForgotPasswordSuccess: null,
  authForgotPasswordFailure: ['err'],
  authResetPasswordRequest: ['data'],
  authResetPasswordSuccess: null,
  authResetPasswordFailure: ['err'],
  authCheckoutRequest: ['data'],
  authRequest: ['data'],
  authSuccess: ['user'],
  authFailure: ['err'],
  authSocialRequest: ['data'],
  authSocialSuccess: ['user'],
  authSocialFailure: ['err'],
  authLogout: ['data'],
  authLogoutSuccess: null,
  authLogoutFailure: ['err'],
  authInit: null,
  authUserInit: null,
  authSocMedLoginRequest: ['data'],
  authSocMedLoginSuccess: ['user'],
  authSocMedLoginFailure: ['err'],
  authSetDeviceTokenRequest: ['data'],
  authSetDeviceTokenSuccess: ['data'],
  authResetRequest: ['data'],
  authResetSuccess: ['user'],
  authResetFailure: ['err'],
  authResetStatus: null,
  authIsGuest: ['isGuest'],
  authAutoLoginRequest: ['data']
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  dataDeviceToken: {},
  user: null,
  err: null,
  profileChanged: false,
  passwordChanged: false,
  forgotPassword: false
})

/* ------------- Reducers ------------- */

// we're attempting to login
export const request = (state: Object) => state.merge({
  fetching: true,
  err: null,
  forgotPassword: false
})

// we've successfully logged in
export const success = (state: Object, { user }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    user
  })

export const changeSuccess = (state: Object, { user }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    passwordChanged: true
  })

export const forgotPasswordSuccess = (state: Object, { user }: Object) =>
  state.merge({
    fetching: false,
    err: null,
    forgotPassword: true
  })

// we've had a problem logging in
// Possible errors:
// * user pass doesnt match
// * user not registered ?
// * user account not activated ?
// err is string
export const failure = (state: Object, { err }: any) => {
  return state.merge({
    fetching: false,
    err
  })
}

export const forgotPasswordFailure = (state: Object, { err }: any) => {
  return state.merge({
    fetching: false,
    err,
    forgotPassword: false
  })
}

// Set state initial value when user open sign in modal
export const init = (state: Object) => state.merge({
  fetching: false,
  err: null,
  passwordChanged: false
})

export const userInit = (state: Object) => state.merge({
  fetching: false,
  err: null,
  user: null
})

export const logout = (state: Object) => state.merge({ fetching: true })

export const logoutFailure = (state) => state.merge({
  fetching: false,
  user: null
})

export const resetStatus = (state) => state.merge({
  fetching: false,
  err: null
})

export const authSetDeviceTokenRequest = (state: Object) => state.merge()
export const authSetDeviceTokenSuccess = (state: Object, { data }) => state.merge({
  dataDeviceToken: data
})

export const authIsGuest = (state: Object, { isGuest }) => state.merge({ isGuest })

/* ------------- Hookup Reducers To Types ------------- */
export const reducer =
  createReducer(INITIAL_STATE, {
    [Types.AUTH_CHANGE_PASSWORD_SUCCESS]: changeSuccess,
    [Types.AUTH_CHANGE_PASSWORD_REQUEST]: request,
    [Types.AUTH_CHANGE_PASSWORD_FAILURE]: failure,
    [Types.AUTH_FORGOT_PASSWORD_SUCCESS]: forgotPasswordSuccess,
    [Types.AUTH_FORGOT_PASSWORD_REQUEST]: request,
    [Types.AUTH_FORGOT_PASSWORD_FAILURE]: forgotPasswordFailure,
    [Types.AUTH_RESET_PASSWORD_SUCCESS]: changeSuccess,
    [Types.AUTH_RESET_PASSWORD_REQUEST]: request,
    [Types.AUTH_RESET_PASSWORD_FAILURE]: failure,
    [Types.AUTH_SUCCESS]: success,
    [Types.AUTH_REQUEST]: request,
    [Types.AUTH_FAILURE]: failure,
    [Types.AUTH_SOCIAL_SUCCESS]: success,
    [Types.AUTH_SOCIAL_REQUEST]: request,
    [Types.AUTH_SOCIAL_FAILURE]: failure,
    [Types.AUTH_CHECKOUT_REQUEST]: request,
    [Types.AUTH_LOGOUT]: logout,
    [Types.AUTH_LOGOUT_SUCCESS]: success,
    [Types.AUTH_LOGOUT_FAILURE]: logoutFailure,
    [Types.AUTH_INIT]: init,
    [Types.AUTH_USER_INIT]: userInit,
    [Types.AUTH_SOC_MED_LOGIN_REQUEST]: request,
    [Types.AUTH_SOC_MED_LOGIN_SUCCESS]: success,
    [Types.AUTH_SOC_MED_LOGIN_FAILURE]: failure,
    [Types.AUTH_SET_DEVICE_TOKEN_REQUEST]: authSetDeviceTokenRequest,
    [Types.AUTH_SET_DEVICE_TOKEN_SUCCESS]: authSetDeviceTokenSuccess,
    [Types.AUTH_RESET_SUCCESS]: success,
    [Types.AUTH_RESET_REQUEST]: request,
    [Types.AUTH_RESET_FAILURE]: failure,
    [Types.AUTH_RESET_STATUS]: resetStatus,
    [Types.AUTH_IS_GUEST]: authIsGuest,
    [Types.AUTH_AUTO_LOGIN_REQUEST]: request
  })

export const isLoggedIn = (state: Object) => state.user !== null
