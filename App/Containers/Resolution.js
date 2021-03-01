import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'

export default class Resolution extends Component {
  // Removing Header
  static navigationOptions = {
    header: null
  }

  sendToWebView = (url, title) => {
    let pageData = {
      formURL: url,
      title
    }
    this.props.navigation.navigate('WebViewPage', { pageData })
  }

  render () {
    return (
      <View style={{ flexDirection: 'column', backgroundColor: 'white', flex: 1 }}>
        <HeaderSearchComponent back pageName={'Pusat Resolusi'} pageType={'resolusi'} navigation={this.props.navigation} />
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ padding: 20, flexDirection: 'column' }}>
            <View style={{ padding: 15, flexDirection: 'row', backgroundColor: '#E5F7FF', marginBottom: 15 }}>
              <Text style={{ color: '#757885', fontFamily: 'Quicksand-Regular', fontSize: 14 }}><Icon name='information-outline' size={20} color='#757885' /> Apa solusi yang Anda butuhkan</Text>
            </View>
            <TouchableOpacity onPress={() => this.sendToWebView('https://goo.gl/forms/Iq0lMT5razUxl2P33', 'Konfirmasi Transfer Bank')} style={{ padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3 }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', fontSize: 16 }}>Konfirmasi Transfer Bank</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.sendToWebView('https://goo.gl/forms/0MMdFR2ipf3ZPx6w1', 'Refund Ruparapa')} style={{ padding: 15, marginBottom: 15, borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3 }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', fontSize: 16 }}>Pengembalian Barang</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: 1, borderBottomColor: '#D4DCE6' }} />
          <View style={{ paddingHorizontal: 10, marginTop: 20, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}><Icon name='email-outline' size={20} color='#757885' /> {config.defaultMailto}</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}><Icon name='phone' size={20} color='#757885' /> 021 - 582 9191</Text>
          </View>
        </View>
      </View>
    )
  }
}
