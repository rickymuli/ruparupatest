import React from 'react'
import { View, Text, Image, Linking, TouchableOpacity, Dimensions, ScrollView } from 'react-native'
import IconAnt from 'react-native-vector-icons/AntDesign'
// import { Navigate } from '../Services/NavigationService'
// import _ from 'lodash'
import config from '../../config'
// import {
//   Freshchat,
//   FaqOptions
// } from 'react-native-freshchat-sdk'
import EasyModal from './EasyModal'
import { fonts } from '../Styles'

const { width, height } = Dimensions.get('screen')

const Helper = props => {
  return (
    <EasyModal ref='contactUs' size={45} title='Hubungi Kami' close>
      <ScrollView style={{ width, height: height * 0.4 }}>
        <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${config.defaultMailto}`)}>
            <View style={{ padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <IconAnt name='mail' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: fonts.regular, fontWeight: '700' }}>E-mail: </Text><Text style={{ fontFamily: fonts.regular }}>{config.defaultMailto}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${config.defaultPhone}`)}>
            <View style={{ padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <Image style={{ width: 20, height: 20, marginRight: 7 }} source={require('../assets/images/help-index-icon/help-index-icon.webp')} /><Text style={{ fontFamily: fonts.regular, fontWeight: '700' }}>Phone: </Text><Text style={{ fontFamily: fonts.regular }}>{config.defaultPhone}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.openFreshChat()}>
            <View style={{ padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10, marginLeft: 20, width, textAlign: 'left' }}>
              <IconAnt name='message1' size={20} style={{ marginRight: 7 }} /><Text style={{ fontFamily: fonts.regular, fontWeight: '700' }}>Live Chat</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </EasyModal>
  )
}

export default Helper
