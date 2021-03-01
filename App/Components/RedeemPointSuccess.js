import React, { Component } from 'react'
import { View, Clipboard, Text, TouchableOpacity, ImageBackground, Dimensions } from 'react-native'
import { NumberWithCommas } from '../Utils/Misc'
import Toast, { DURATION } from 'react-native-easy-toast'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export default class RedeemPointSuccess extends Component {
  copyToClipboard = () => {
    Clipboard.setString(this.props.redeemVoucher)
    this.refs.toast.show(`Tersalin`, DURATION.LENGTH_LONG)
  }

  cardDetail = () => {
    const { memberId, point, selected } = this.props
    return (
      <PositionInputPoint>
        <Text style={[(selected === 'toyskingdom') ? { color: '#555761' } : { color: '#ffffff' }, { fontSize: 18, letterSpacing: 7.5, textAlign: 'center', fontFamily: 'Quicksand-Regular', marginBottom: 15 }]}>{memberId}</Text>
        <WhiteArea>
          <Text style={{ fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>{(point) ? NumberWithCommas(point) : 0 } Poin</Text>
        </WhiteArea>
      </PositionInputPoint>
    )
  }

  render () {
    const { redeemVoucher, balance, selected } = this.props
    const { width } = Dimensions.get('screen')
    const ratio = (width * 0.95) / 462
    return (
      <View>
        <View style={{ marginTop: 20, alignItems: 'center', marginBottom: 20 }}>
          {(selected === 'ace') ? <ImageBackground source={require('../assets/images/point/ace-card-membership-2.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.cardDetail()}</ImageBackground>
            : (selected === 'informa') ? <ImageBackground source={require('../assets/images/point/informa-card-membership.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.cardDetail()}</ImageBackground>
              : (selected === 'toyskingdom') ? <ImageBackground source={require('../assets/images/point/toys-kingdom-card-membership-2.webp')} style={{ width: width * 0.95, height: ratio * 262 }}>{this.cardDetail()}</ImageBackground>
                : null }
        </View>
        <View style={{ padding: 15 }}>
          <Text style={{ textAlign: 'center', fontFamily: 'Quicksand-Bold', marginBottom: 10 }}>Kode Voucher</Text>
          <View style={{ flexDirection: 'row', paddingHorizontal: 10, marginBottom: 10 }}>
            <View style={{ borderWidth: 1, borderColor: '#D4DCE6', flex: 3, padding: 10, borderRadius: 3 }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 14 }}>{redeemVoucher}</Text>
            </View>
            <TouchableOpacity onPress={() => this.copyToClipboard()} style={{ backgroundColor: '#008CCF', borderRadius: 4, padding: 10, flex: 1 }}>
              <Text style={{ textAlign: 'center', color: 'white', fontSize: 16, fontFamily: 'Quicksand-Bold' }}>Salin <Icon name='content-copy' size={18} color='white' /></Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 10, flexDirection: 'column' }}>
            <View style={{ borderTopColor: '#D4DCE6', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ padding: 10, fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Tipe Voucher</Text>
              <Text style={{ padding: 10, fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Tukar Poin</Text>
            </View>
            <View style={{ borderTopColor: '#D4DCE6', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ padding: 10, fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Saldo</Text>
              <Text style={{ padding: 10, fontSize: 14, fontFamily: 'Quicksand-Regular' }}>Rp {(balance) ? NumberWithCommas(balance) : 0}</Text>
            </View>
            <View style={{ borderTopColor: '#D4DCE6', borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ padding: 10, fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Status</Text>
              <Text style={{ padding: 10, fontSize: 14, color: '#049372', fontFamily: 'Quicksand-Bold' }}>Aktif</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => this.props.backToList()} style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Tukar Poin Lagi</Text>
          </TouchableOpacity>
        </View>
        <Toast
          ref='toast'
          style={{ backgroundColor: '#049372', borderRadius: 0, width: '100%' }}
          position='top'
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        />
      </View>
    )
  }
}

const PositionInputPoint = styled.View`
  padding-horizontal: 40;
  padding-bottom: 10;
  display:flex;
  justifyContent: flex-end;
  flex-direction: column;
  width: ${Dimensions.get('screen').width * 0.95};
  height: ${(Dimensions.get('screen').width * 0.95) / 462 * 262};
`
const WhiteArea = styled.View`
  padding: 5px;
  border-radius: 3;
  background-color: #FFFFFF;
  margin-bottom: 10;
`
