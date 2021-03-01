import React, { useState, useEffect } from 'react'
import { Image, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { RowSpaceBetween, OuterContainer, Divider, ButtonBorder, ButtonBorderText, Verified, ErrorText, UnVerified } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { fonts } from '../Styles'

// redux
import { useDispatch, useSelector } from 'react-redux'
import OtpActions from '../Redux/OtpRedux'
var dayjs = require('dayjs')

const ProfileSummaryDashboard = props => {
  const { navigation } = props
  const [action, setAction] = useState('')
  const { errChoices, errGenerate, fetchingChoices, successChoices, successGenerate, dataTemp } = useSelector(state => state.otp)
  const { user = {}, fetching } = useSelector(state => state.user)

  const dispatch = useDispatch()

  useEffect(() => {
    let fromPDP = props?.route?.params?.fromPDP ?? null
    if (fromPDP) {
      let dir = 'ProductDetailPage'
      if (get(fromPDP, 'itemData.is_extended') === 0) dir = 'ProductDetailPageStore'
      navigation.setParams({ fromPDP: null })
      navigation.replace(dir, { ...fromPDP })
    }
  }, [])

  useEffect(() => {
    if (successGenerate && navigation.isFocused()) navigation.navigate('ValidateOtp')
  }, [successGenerate])

  useEffect(() => {
    if (successChoices && navigation.isFocused()) {
      navigation.navigate('ValidateOption')
    }
  }, [successChoices])

  const getDate = (date) => (isEmpty(date) ? '' : dayjs(date).format('D MMM YYYY'))

  const userData = () => (
    {
      customer_id: user.customer_id,
      email: user.email,
      is_resend: 0,
      phone: user.phone
    }
  )

  const memberText = {
    AHI: 'Member ID Ace',
    HCI: 'Member ID Informa',
    TGI: 'Toys Kingdom Smile Club'
  }

  const verifyEmail = () => {
    setAction('verify-email')
    let data = {
      action: 'verify-email',
      channel: 'email',
      ...userData()
    }
    dispatch(OtpActions.otpSaveDataTemp(data))
    dispatch(OtpActions.otpGenerateRequest(data))
  }

  const choices = (action, channel) => {
    setAction(action)
    let data = { action, verification_input: action === 'email' ? user.email : user.phone }
    let newDataTemp = { ...userData(), action, channel }
    dispatch(OtpActions.otpChoicesRequest(data, newDataTemp))
  }
  return <OuterContainer>
    {!isEmpty(user) &&
      <View>
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginBottom: 10 }}>Informasi Kontak</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', paddingRight: 4 }}>
            <Text style={{ fontFamily: fonts.regular }}>Email</Text>
            <View>
              {user.is_email_verified === '10'
                ? <Verified>VERIFIED</Verified>
                : <UnVerified>UNVERIFIED</UnVerified>
              }
            </View>
          </View>
          {fetching && dataTemp && dataTemp.action === 'change-email'
            ? <ActivityIndicator />
            : <Text style={{ fontFamily: fonts.bold, textAlign: 'right', flex: 1 }} numberOfLines={2}>{get(user, 'email', '')}</Text>
          }
        </View>
        <ButtonBorder onPress={() => user.is_email_verified === '10' ? choices('change-email', 'email') : verifyEmail()}>
          {(fetchingChoices && user.is_email_verified !== '0' && action === 'change-email')
            ? <ActivityIndicator />
            : <Text style={{ fontFamily: fonts.regular }}>{user.is_email_verified === '10' ? 'Ubah Email' : 'Verifikasi Email'}</Text>
          }
        </ButtonBorder>
        {(!isEmpty(errGenerate) && action === 'verify-email') && <ErrorText>{errGenerate}</ErrorText>}
        {user.is_email_verified === '0' &&
          <ButtonBorder onPress={() => choices('change-email', 'email')}>
            {fetchingChoices && action === 'change-email'
              ? <ActivityIndicator />
              : <Text style={{ fontFamily: fonts.regular }}>Ubah Email</Text>
            }
          </ButtonBorder>
        }
        {(!isEmpty(errChoices) && action === 'change-email') && <ErrorText>{errChoices}</ErrorText>}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontFamily: fonts.regular }}>No Handphone</Text>
            {user.is_phone_verified === '10'
              ? <Verified>VERIFIED</Verified>
              : <UnVerified>UNVERIFIED</UnVerified>
            }
          </View>
          {fetching && dataTemp && dataTemp.action === 'change-phone'
            ? <ActivityIndicator />
            : <Text style={{ fontFamily: fonts.bold }}>{user.phone}</Text>
          }
        </View>
        <ButtonBorder onPress={() => choices('change-phone', 'phone')} disabled={user.is_phone_verified === '10' && user.is_email_verified === '0'}>
          {fetchingChoices && action === 'change-phone'
            ? <ActivityIndicator />
            : <Text style={{ fontFamily: fonts.regular }}>{user.is_phone_verified === '10' ? 'Ubah No Handphone' : 'Verifikasi No Handphone'}</Text>
          }
        </ButtonBorder>
        {(!isEmpty(errChoices) && action === 'change-phone') && <ErrorText>{errChoices}</ErrorText>}
        {(user.is_phone_verified === '10' && user.is_email_verified === '0') &&
          <ErrorText>Lakukan verifikasi email terlebih dahulu, untuk mengubah No Handphone</ErrorText>
        }
        <Divider />
        <Text style={{ fontFamily: fonts.bold, fontSize: 16, marginBottom: 10 }}>Profil Diri</Text>
        <RowSpaceBetween>
          <Text style={{ fontFamily: fonts.regular, paddingRight: 4 }}>Nama Lengkap</Text>
          <Text style={{ fontFamily: fonts.bold, textAlign: 'right', flex: 1 }} numberOfLines={1}>{user.first_name || ''} {user.last_name || ''}</Text>
        </RowSpaceBetween>
        <RowSpaceBetween>
          <Text style={{ fontFamily: fonts.regular }}>Tanggal Lahir</Text>
          <Text style={{ fontFamily: fonts.bold }}>{getDate(user.birth_date)}</Text>
        </RowSpaceBetween>
        <RowSpaceBetween>
          <Text style={{ fontFamily: fonts.regular }}>Jenis Kelamin</Text>
          {!isEmpty(user.gender) &&
            <Text style={{ fontFamily: fonts.bold }}>{(user.gender === 'male') ? 'Laki-laki' : 'Perempuan'}</Text>
          }
        </RowSpaceBetween>
        <RowSpaceBetween>
          <Text style={{ fontFamily: fonts.regular }}>Password</Text>

          <TouchableOpacity onPress={() => choices('change-password', 'phone')} disabled={user.is_email_verified === '0'}>
            {fetchingChoices && action === 'change-password'
              ? <ActivityIndicator />
              : <Text style={{ fontFamily: fonts.bold, textDecorationLine: 'underline' }}>Ubah Password</Text>
            }
          </TouchableOpacity>
        </RowSpaceBetween>
        {(user.is_email_verified === '0') &&
          <ErrorText>Lakukan verifikasi email terlebih dahulu, untuk mengubah Password</ErrorText>
        }
        <Text style={{ fontFamily: fonts.regular, paddingTop: 8 }}>Data Member</Text>
        {['AHI', 'HCI', 'TGI'].map((item, index) =>
          <RowSpaceBetween key={index}>
            <RowSpaceBetween>
              <Text style={{ fontFamily: fonts.regular }}>{memberText[item]}</Text>
              {(user.group[`${item}_is_verified`] === '10')
                ? <Icon style={{ alignSelf: 'flex-start', marginLeft: 4 }} color={'#049372'} name='check-circle' size={16} />
                : (user.group[`${item}_is_verified`] === '5')
                  ? <Image source={{ uri: `${config.imageURL}v1590560940/Expired_w0yn42.png` }} style={{ height: 16, width: 16, alignSelf: 'flex-start', marginLeft: 4, resizeMode: 'contain' }} />
                  : (user.group[`${item}_is_verified`] === '0')
                    ? <Icon style={{ alignSelf: 'flex-start', marginLeft: 4 }} color={'#F3251D'} name='close-circle' size={16} />
                    : null
              }
            </RowSpaceBetween>
            <TouchableOpacity onPress={() => navigation.navigate('MembershipPage', { route: item })}>
              <Text style={{ fontFamily: fonts.bold, textDecorationLine: 'underline' }}>{!isEmpty(user.group[item]) ? user.group[item] : 'Masukan Data'}</Text>
            </TouchableOpacity>
          </RowSpaceBetween>
        )
        }
      </View>
    }
    <ButtonBorder onPress={() => navigation.navigate('EditProfile')}>
      <Image source={require('../assets/images/Profile-Mobile-App/mini/edit-blue.webp')} style={{ width: 18, height: 18 }} />
      <ButtonBorderText> Edit Profil</ButtonBorderText>
    </ButtonBorder>
  </OuterContainer>
}

export default ProfileSummaryDashboard
