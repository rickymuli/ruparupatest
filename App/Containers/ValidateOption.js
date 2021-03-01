import React, { useState, useEffect } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'

// component
import OtpChoices from '../Components/OtpChoices'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ChatButton from '../Components/ChatButton'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import OtpActions from '../Redux/OtpRedux'

const ValidateOption = props => {
  const { navigation } = props
  const [err, setErr] = useState('')

  const { err: otpErr, errGenerate, successGenerate, fetchingGenerate, fetchingChoices, dataChoices } = useSelector(state => state.otp)
  const dispatch = useDispatch()

  useEffect(() => { setErr(otpErr) }, [otpErr])
  useEffect(() => { setErr(errGenerate) }, [errGenerate])
  useEffect(() => {
    const { data, dataTemp } = props?.route?.params?.choicesParam ?? {}
    if (!isEmpty(data)) dispatch(OtpActions.otpChoicesRequest(data, dataTemp))
    return () => {
      dispatch(OtpActions.otpResetStatus())
    }
  }, [])

  useEffect(() => {
    if (successGenerate) {
      let fromPDP = props?.route?.params?.fromPDP ?? false
      navigation.replace('ValidateOtp', { fromPDP })
    }
  }, [successGenerate])

  return (
    <View style={{ flex: 1 }}>
      <HeaderSearchComponent home pageName={'Verifikasi'} navigation={navigation} />
      <View style={{ paddingTop: 20, paddingHorizontal: 22 }}>
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>Pilih salah satu metode dibawah ini untuk mendapatkan kode verifikasi</Text>
        {fetchingGenerate || fetchingChoices
          ? <ActivityIndicator style={{ marginTop: 30 }} size={'large'} />
          : has(dataChoices, 'types') && dataChoices.types.map((item, key) => <OtpChoices item={item} key={key} navigation={navigation} />)
        }
        {(!isEmpty(err)) && <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14, color: 'red', marginVertical: 10, textAlign: 'center' }}>{`${err}. Jika ada keluhan silakan klik icon chat di kanan bawah.`}</Text>}
      </View>
      <ChatButton />
    </View>
  )
}

export default ValidateOption
