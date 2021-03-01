import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native'
import { Navigate } from '../Services/NavigationService'

import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import { fonts } from '../Styles'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import OtpActions from '../Redux/OtpRedux'
import ChatButton from '../Components/ChatButton'

const UpdatePhone = props => {
  const { navigation } = props
  const [values, setvalues] = useState('')
  const validateNoPhone = props?.route?.params?.validateNoPhone ?? false

  const { err: otpErr, fetching, fetchingUpdatePhone, successUpdatePhone, successChoices, dataTemp, dataOtp, dataChoices } = useSelector(state => state.otp)
  const dispatch = useDispatch()

  useEffect(() => {
    // if (dataOtp && dataOtp.phone) setvalues(dataOtp.phone)
    return () => {
      dispatch(OtpActions.otpResetStatus())
    }
  }, [])

  useEffect(() => {
    if (successChoices && !isEmpty(dataChoices.types) && includes(dataChoices.types, 'message')) Navigate('ValidateOption')
  }, [successChoices])

  useEffect(() => {
    if (successUpdatePhone) {
      let data = {
        verification_input: values,
        action: dataTemp.action
      }
      dispatch(OtpActions.otpChoicesRequest(data, { ...dataTemp, phone: values }))
    }
  }, [successUpdatePhone])

  const verifyOtp = () => {
    let phone = values.replace('+', '')
    let newData = {
      customer_id: dataOtp.customer_id,
      phone: phone.replace(/^62/, '0')
    }
    dispatch(OtpActions.otpUpdatePhoneRequest(newData))
  }

  const checkOtp = () => {
    let value = values.replace(/^62/, '0')
    let data = {
      action: 'social-login',
      customer_id: '0',
      email: dataTemp.email,
      password: dataTemp.password,
      phone: value,
      checkUpdatePhone: true
    }
    // dispatch(OtpActions.otpCheckRequest(data, newDataTemp))
    dispatch(OtpActions.otpCheckRequest(data, { ...dataTemp, phone: value, customer_id: '0' }))
  }

  return <View style={{ flex: 1 }}>
    <HeaderSearchComponent back pageName={'Verifikasi No Handphone'} navigation={navigation} />
    <View style={{ paddingTop: 20, paddingHorizontal: 22 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 14 }}>
      Untuk Memastikan kemudahan dan keamanan transaksi,
      kami akan mengirimkan kode OTP ke nomor di bawah ini.
      Pastikan nomor handphone tersebut benar</Text>
      <Box>
        <TextInput
          autoCapitalize='none' keyboardType='phone-pad' selectionColor='rgba(242, 101, 37, 1)'
          underlineColorAndroid='transparent'
          value={values}
          onChangeText={(v) => setvalues(v)}
          style={{ height: 40, color: 'black' }}
          placeholder='Nomor Telepon'
          placeholderTextColor='#b2bec3'
        />
      </Box>
      {otpErr &&
      <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14, color: 'red', textAlign: 'center', marginTop: 20 }}>{`${otpErr}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}</Text>
      }
      <TouchableOpacity onPress={() => validateNoPhone ? checkOtp() : verifyOtp()} style={{ backgroundColor: '#F26525', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 6, marginTop: 20 }}>
        { fetching || fetchingUpdatePhone
          ? <ActivityIndicator color={'white'} />
          : <Text style={{ fontFamily: fonts.medium, color: 'white', fontSize: 14 }}>Kirim</Text>
        }
      </TouchableOpacity>
    </View>
    <ChatButton />
  </View>
}

export default UpdatePhone

const Box = styled.View`
    border: 1px #e5e9f2 solid;
    padding-horizontal: 10px;
    margin-top: 20px;
    border-radius: 3px;
  `
