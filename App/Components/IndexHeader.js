import React, { useRef } from 'react'
import { View, Image, Linking, Platform, TouchableOpacity, Dimensions, ScrollView, Text } from 'react-native'
import IconAnt from 'react-native-vector-icons/AntDesign'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigate } from '../Services/NavigationService'
import config from '../../config.js'
// import Modal from 'react-native-modal'
import EasyModal from './EasyModal'
import Loading from './LoadingComponent'
import { useSelector } from 'react-redux'

// Styles
// import styles from './Styles/HeaderSearchStyle'
import styled from 'styled-components'

const { width, height } = Dimensions.get('screen')

const IndexHeader = ({ navigation, isScroll }) => {
  const ref = useRef(null)
  const cart = useSelector(state => state.cart)
  return (<IndexCardHeaderSearch>
    <DistributeSpaceBetween>
      <TouchPointIcon onPress={() => Navigate('SearchPage')} style={{ borderColor: '#F0F2F7', borderWidth: 1, borderRadius: 20, flex: 1, paddingVertical: 4, paddingHorizontal: 8, alignItems: 'center', backgroundColor: (isScroll ? '#F0F2F7' : '#ffff') }}>
        <IconAnt name={'search1'} size={18} style={{ marginRight: 5 }} color={'#555761'} />
        <TextSecondarySearch>Cari di <TextGray>rup</TextGray><TextBlue>a</TextBlue><TextGray>rup</TextGray><TextOrange>a</TextOrange></TextSecondarySearch>
      </TouchPointIcon>
      {/* <View style={{flexDirection:'row'}}> */}
      <TouchPointIcon onPress={() => ref.current.setModal()} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
        <Icons name={'chat-processing'} size={24} color={(isScroll ? '#757885' : '#ffffff')} />
      </TouchPointIcon>
      <TouchPointIcon style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingRight: 5 }} onPress={() => navigation.navigate('CartPage', { itmData: {} })}>
        {/* <Image style={{ width: 27, height: 27 }} source={require('../assets/images/shopping-cart.webp')} /> */}
        <Icons name={'cart'} size={24} color={(isScroll ? '#757885' : '#ffffff')} />
        <View style={{ position: 'absolute', top: -3, right: 1, borderRadius: 100 / 2, backgroundColor: '#008CCF', justifyContent: 'center', alignItems: 'center', width: 16, height: 16 }}>
          {(cart.fetching)
            ? <Loading size='small' color='white' />
            : <Text style={{ fontFamily: 'Quicksand-Medium', color: '#ffffff', textAlign: 'center', fontSize: 12, marginBottom: (Platform.OS === 'ios' ? 0 : 2) }}>{(cart && cart.data !== null) ? cart.data.total_qty_item : '0'}</Text>
          }
        </View>
      </TouchPointIcon>
      {/* </View> */}
    </DistributeSpaceBetween>
    <EasyModal ref={ref} size={40} title='Hubungi Kami' close>
      <ScrollView style={{ width, height: height * 0.4 }}>
        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${config.defaultMailto}`)}>
            <View style={{ backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <IconAnt name='mail' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>E-mail: </Text><Text style={{ fontFamily: 'Quicksand-Regular' }}>{config.defaultMailto}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${config.defaultPhone}`)}>
            <View style={{ backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <Image style={{ width: 20, height: 20, marginRight: 7 }} source={require('../assets/images/help-index-icon/help-index-icon.webp')} /><Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>Phone: </Text><Text style={{ fontFamily: 'Quicksand-Regular' }}>{config.defaultPhone}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => null}>
            <View style={{ borderRadius: 100 / 2, backgroundColor: 'white', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <IconAnt name='message1' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>Live Chat</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </EasyModal>
  </IndexCardHeaderSearch>)
}

export default IndexHeader

const IndexCardHeaderSearch = styled.View`
background-color: transparent;
paddingHorizontal: 10px;
padding-top: 12px;
padding-bottom: 2px;
`
const DistributeSpaceBetween = styled.View`
display: flex;
flex-direction: row;
justify-content: space-between;
`
const TouchPointIcon = styled.TouchableOpacity`
paddingHorizontal: 5px;
flex-direction: row;
align-self:center;
`

const TextSecondarySearch = styled.Text`
color: #555761;
font-size: 14px;
padding:2px;
font-family:Quicksand-Regular;
`

const TextOrange = styled.Text`
color: #F26525;
font-family:Quicksand-Bold;
`
const TextBlue = styled.Text`
color: #008CCF;
font-family:Quicksand-Bold;
`
const TextGray = styled.Text`
color: #555761;
font-family:Quicksand-Bold;
`
