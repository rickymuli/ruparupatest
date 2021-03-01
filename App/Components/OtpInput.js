import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableWithoutFeedback, Linking, TouchableOpacity, ActivityIndicator } from 'react-native'
import config from '../../config'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import CountDown from 'react-native-countdown-component'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import random from 'lodash/random'
import includes from 'lodash/includes'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import OtpActions from '../Redux/OtpRedux'
// import AuthActions from '../Redux/AuthRedux'

const OtpInput = (props) => {
  const { navigation } = props
  const validateEmailPhone = props?.route?.params?.validateEmailPhone ?? false
  const [fetching, setFetching] = useState(false)
  const [code, setCode] = useState('')
  const [timer] = useState({ id: random(9, true).toString(), time: 300 })
  const [resend, setResend] = useState({ timer: 90, active: false })
  const [err, setErr] = useState('')

  const { errValidate, errGenerate, fetchingValidate, generateData = {}, data } = useSelector(state => state.otp)
  const { err: errAuth, fetching: authFetching } = useSelector(state => state.auth)
  const { err: errRegister, fetching: registerFetching } = useSelector(state => state.register)
  const { err: errUser, fetching: userFetching } = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => { if (code.length > 5 && !fetchingValidate) verifyOtp() }, [code])

  useEffect(() => { setFetching(authFetching) }, [authFetching])
  useEffect(() => { setFetching(fetchingValidate) }, [fetchingValidate])
  useEffect(() => { setFetching(registerFetching) }, [registerFetching])
  useEffect(() => { setFetching(userFetching) }, [userFetching])

  useEffect(() => { setErr(errValidate) }, [errValidate])
  useEffect(() => { setErr(errGenerate) }, [errGenerate])
  useEffect(() => { setErr(errAuth) }, [errAuth])
  useEffect(() => { setErr(errRegister) }, [errRegister])
  useEffect(() => { setErr(errUser) }, [errUser])

  const verifyOtp = () => {
    let newData = {
      access_code: code,
      action: generateData.action,
      customer_id: generateData.customer_id || '0',
      email: '',
      phone: ''
    }
    if (includes(['message', 'chat'], generateData.channel)) newData['phone'] = generateData.phone
    else if (generateData.channel === 'email') newData['email'] = generateData.email
    if (generateData.action === 'social-login') newData['email'] = generateData.email
    dispatch(OtpActions.otpValidateRequest(newData))
  }

  const generateOtp = () => {
    dispatch(OtpActions.otpGenerateRequest({ ...generateData, is_resend: 10 }))
    navigation.replace('ValidateOtp', { validateEmailPhone, resendOtp: true })
  }

  return (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16 }}>{`Kode verifikasi akan expired setelah `}</Text>
            <CountDown
              id={timer.id}
              until={timer.time}
              size={14}
              // onFinish={() => setTimer({ ...timer, time: 0 })}
              timeToShow={['M', 'S']}
              style={{ justifyContent: 'center', alignItems: 'center', height: 14 }}
              digitStyle={{ backgroundColor: 'transparent', marginHorizontal: -6, maxHeight: 14 }}
              digitTxtStyle={{ color: '#555761' }}
              timeLabels={{ m: null, s: null }}
              // separatorStyle={{flex:1, borderWidth:1, marginBottom: 10}}
              showSeparator
            />
          </View>
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 20, textAlign: 'center', paddingTop: 10 }}>{`Kode verifikasi`}</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <OTPInputView
              style={{ width: '60%', height: 80 }}
              pinCount={6}
              code={code} // You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={c => setCode(c)}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
            />
          </View>
          {!isEmpty(err) &&
          <Text style={{ color: '#F3251D', fontSize: 14, fontFamily: 'Quicksand-Regular', paddingBottom: 20, textAlign: 'center' }}>
            {`${err}. Jika ada keluhan silakan klik icon chat di kanan bawah. atau `}
            <TouchableWithoutFeedback onPress={() => Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLScdZbqcqPB6QIAsTiuTJ2SyjciFxXRcFg8Q1qJ2J3XdZ3NGaA/viewform?usp=sf_link')}>
              <Text style={{ textDecorationLine: 'underline' }}>klik di sini</Text>
            </TouchableWithoutFeedback>
          </Text>}
          {!fetching
            ? code
              ? <TouchableOpacity onPress={() => verifyOtp()} style={{ backgroundColor: '#F26525', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 6 }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: code ? 'white' : '#757885', fontSize: 14 }}> Verifikasi </Text>
              </TouchableOpacity>
              : <View style={{ backgroundColor: '#D4DCE6', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 6 }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: code ? 'white' : '#757885', fontSize: 14 }}> Verifikasi </Text>
              </View>
            : <View style={{ backgroundColor: code ? '#F26525' : '#D4DCE6', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 6 }}>
              <ActivityIndicator color='white' />
            </View>
          }
          {!fetching &&
          <View style={{ paddingTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757885', fontSize: 14 }}>{`Tidak menerima kode verifikasi ?`}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => generateOtp()} disabled={!resend.active}>
                <Text style={{ fontFamily: 'Quicksand-Bold', color: resend.active ? '#00A6F5' : '#D4DCE6', fontSize: 14 }}>{`Kirim Ulang `}</Text>
              </TouchableOpacity>
              {!resend.active &&
              <CountDown
                until={resend.timer}
                size={16}
                onFinish={() => setResend({ timer: 0, active: true })}
                timeToShow={['M', 'S']}
                style={{ justifyContent: 'center', alignItems: 'center', height: 16 }}
                digitStyle={{ backgroundColor: 'transparent', marginHorizontal: -8, maxHeight: 16 }}
                digitTxtStyle={{ color: '#555761' }}
                timeLabels={{ m: null, s: null }}
                showSeparator
              />
              }
              {(generateData && !includes(['verify-phone', 'verify-email'], generateData.action) && !validateEmailPhone) &&
              <>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757885', fontSize: 14 }}>{` atau `}</Text>
                <TouchableOpacity onPress={() => navigation.replace('ValidateOption')}>
                  <Text style={{ fontFamily: 'Quicksand-Medium', color: '#00A6F5', fontSize: 14 }}>{`Ganti Metode Verifikasi`}</Text>
                </TouchableOpacity>
              </>
              }
            </View>
          </View>
          }
          {(config.developmentENV === 'stg' && has(data, 'message')) &&
            <Text style={{ color: '#F3251D', fontSize: 14, fontFamily: 'Quicksand-Regular', marginBottom: 6, textAlign: 'center' }}>{data.message}</Text>
          }
      </>
  )
}

export default OtpInput

const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45
  },
  borderStyleHighLighted: {
    borderColor: '#03DAC6'
  },
  underlineStyleBase: {
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    color: 'black'
  },
  underlineStyleHighLighted: {
    borderColor: '#03DAC6'
  }
})
