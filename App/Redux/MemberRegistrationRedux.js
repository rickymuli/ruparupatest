// @flow
import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  memberRegResetState: null,
  memberRegDate: ['memberRegistration'],
  memberRegFulfilledTrue: ['memberRegistration'],
  memberRegFulfilledFalse: ['memberRegistration'],
  memberRegChangeDate: ['data'],
  memberRegChangeMonth: ['data'],
  memberRegChangeYear: ['data'],
  memberRegChangeOtp: ['data'],
  memberRegCartSuccess: ['cartSuccess'],
  memberRegGoToPayment: ['goToPayment']
})

export const MemberRegistrationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  date: null,
  month: null,
  year: null,
  otp: null,
  isFulfilled: false,
  isChecked: false,
  isValidatedDate: true,
  sendOtp: {
    timer: 0,
    active: false
  },
  cartSuccess: false,
  goToPayment: false
})

/* ------------- Reducers ------------- */

export const validateDate = (state) => {
  const { date, month, year } = state
  let m = month
  if (m.length === 1) {
    m = '0' + m
  }
  if (year >= 1900) {
    if (m === '01' || m === '03' || m === '05' || m === '07' || m === '08' || m === '10' || m === '12') {
      if (date <= 31) {
        return state.merge({
          isValidatedDate: true
        })
      } else {
        return state.merge({
          isValidatedDate: false
        })
      }
    } else if (m === '04' || m === '06' || m === '09' || m === '11') {
      if (date <= 30) {
        return state.merge({
          isValidatedDate: true
        })
      } else {
        return state.merge({
          isValidatedDate: false
        })
      }
    } else if (m === '02') {
      if (year % 4 === 0) {
        if (date <= 29) {
          return state.merge({
            isValidatedDate: true
          })
        } else {
          return state.merge({
            isValidatedDate: false
          })
        }
      } else {
        if (date <= 28) {
          return state.merge({
            isValidatedDate: true
          })
        } else {
          return state.merge({
            isValidatedDate: false
          })
        }
      }
    } else {
      return state.merge({
        isValidatedDate: false
      })
    }
  } else {
    return state.merge({
      isValidatedDate: false
    })
  }
}

export const fulfilledTrue = (state) => {
  return state.merge({
    isFulfilled: true
  })
}

export const fulfilledFalse = (state) => {
  return state.merge({
    isFulfilled: false
  })
}

export const checkedTrue = (state) => {
  return state.merge({
    isChecked: true
  })
}

export const checkedFalse = (state) => {
  return state.merge({
    isChecked: false
  })
}

export const sendOTP = (state) => {
  return state.merge({
    sendOtp: { timer: 90, active: true }
  })
}

export const changeDate = (state, { data }) => {
  return state.merge({
    date: data
  })
}

export const changeMonth = (state, { data }) => {
  return state.merge({
    month: data
  })
}

export const changeYear = (state, { data }) => {
  return state.merge({
    year: data
  })
}

export const changeOtp = (state, { data }) => {
  return state.merge({
    otp: data
  })
}

export const cartSuccess = (state, { cartSuccess }) => {
  return state.merge({
    cartSuccess
  })
}

export const goToPayment = (state, { goToPayment }) => {
  return state.merge({
    goToPayment
  })
}

export const init = (state) => state.merge({
  isFulfilled: false,
  isChecked: false,
  isValidatedDate: true,
  sendOtp: {
    timer: 0,
    active: false
  }
})

export const resetState = (state) => {
  return state.merge({
    date: null,
    month: null,
    year: null,
    otp: null,
    isFulfilled: false,
    isChecked: false,
    isValidatedDate: true,
    sendOtp: {
      timer: 0,
      active: false
    }
  })
}

/* ------------- Hookup Reducers To Types ------------- */
export const reducer = createReducer(INITIAL_STATE, {
  [Types.MEMBER_REG_RESET_STATE]: resetState,
  [Types.MEMBER_REG_DATE]: validateDate,
  [Types.MEMBER_REG_FULFILLED_TRUE]: fulfilledTrue,
  [Types.MEMBER_REG_FULFILLED_FALSE]: fulfilledFalse,
  [Types.MEMBER_REG_FULFILLED_FALSE]: fulfilledFalse,
  [Types.MEMBER_REG_CHANGE_DATE]: changeDate,
  [Types.MEMBER_REG_CHANGE_MONTH]: changeMonth,
  [Types.MEMBER_REG_CHANGE_YEAR]: changeYear,
  [Types.MEMBER_REG_CHANGE_OTP]: changeOtp,
  [Types.MEMBER_REG_CART_SUCCESS]: cartSuccess,
  [Types.MEMBER_REG_GO_TO_PAYMENT]: goToPayment
})
