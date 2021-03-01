import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Navigate } from '../Services/NavigationService'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import { PhoneOrEmail } from '../Utils/Misc'
import { Container } from '../Styles/StyledComponents'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import AuthActions from '../Redux/AuthRedux'
import OtpActions from '../Redux/OtpRedux'

// Style
import styled from 'styled-components'

const ForgotPassword = props => {
  const { changeForgetPass } = props
  const [err, setErr] = useState('')
  const [email, setEmail] = useState('')

  const { err: otpErr, fetching: otpFetching, success, dataOtp, dataChoices } = useSelector(state => state.otp)

  const dispatch = useDispatch()
  const otpCheckRequest = (data, dataTemp) => dispatch(OtpActions.otpCheckRequest(data, dataTemp))

  useEffect(() => { setErr(otpErr) }, [otpErr])
  useEffect(() => {
    return () => {
      dispatch(AuthActions.authResetStatus())
      dispatch(OtpActions.otpInit())
    }
  }, [])

  useEffect(() => {
    if (success && dataOtp) {
      // if (!dataOtp.is_used) setErr('Alamat email atau nomor telepon Anda tidak terdaftar')
      // if (dataOtp.force_update || !dataChoices || isEmpty(dataChoices.types)) Navigate('UpdatePhone', { validateNoPhone: false })
      // else Navigate('ValidateOption')

      if (!dataOtp.is_used) {
        setErr('Alamat email atau nomor telepon Anda tidak terdaftar')
      } else if (!dataOtp.force_update) {
        Navigate('ValidateOption')
      } else if (dataOtp.force_update || !dataChoices || isEmpty(dataChoices.types)) {
        Navigate('UpdatePhone', { validateNoPhone: false })
      }
    }
  }
  , [success])

  const checkOtp = async () => {
    if (!email) return setErr('Email atau No Handphone tidak boleh kosong')
    const phoneOrEmail = await PhoneOrEmail(email)
    if (phoneOrEmail.err) return setErr(phoneOrEmail.err)
    let data = { action: 'forgot-password', password: '', ...phoneOrEmail }
    let dataTemp = {
      customer_id: '0',
      email: '',
      phone: '',
      ...data
    }
    otpCheckRequest(data, dataTemp)
  }

  return <View style={{ backgroundColor: 'white', flexDirection: 'column' }}>
    <View style={{ padding: 15, backgroundColor: '#E5F7FF', flexDirection: 'row', marginBottom: 10 }}>
      <Icon name='information' color='#757886' size={18} />
      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ color: '#757886', fontFamily: 'Quicksand-Regular' }}>Masukkan email atau nomor telepon yang terdaftar. Kami akan mengirimkan kode verifikasi. </Text>
      </View>
    </View>
    <Container>
      <FormS style={{ flexDirection: 'row' }}>
        <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='email' color={'#D4DCE6'} />
        <Input
          autoCapitalize='none'
          selectionColor='rgba(242, 101, 37, 1)'
          underlineColorAndroid='transparent'
          keyboardType='email-address'
          value={email}
          onChangeText={(e) => setEmail(e.toLowerCase())}
          placeholder='Email atau Nomor Telepon'
          placeholderTextColor='#b2bec3'
          style={{ fontFamily: 'Quicksand-Medium' }}
        />
      </FormS>
      {!isEmpty(err) && <Text style={{ color: '#F3251D', fontSize: 14, fontFamily: 'Quicksand-Regular' }}>{`${err}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}</Text>}
      <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => changeForgetPass(false)}>
        <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF', fontSize: 12, textAlign: 'right', marginVertical: 10 }}>Sudah punya akun?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => checkOtp()} disabled={otpFetching} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
        {otpFetching
          ? <ActivityIndicator color='white' />
          : <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16, color: 'white' }}>Kirim</Text>
        }
      </TouchableOpacity>
    </Container>
  </View>
}

export default ForgotPassword

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-bottom: 5px;
`
const Input = styled.TextInput`
  color: #757885;
  text-decoration-color: white;
  color: #F26525;
  flex: 1;
  height: 40;
`
