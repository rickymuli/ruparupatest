import React, { Component } from 'react'
import { View, Clipboard, ImageBackground, Dimensions, Image } from 'react-native'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/FontAwesome'

// Context
import { WithContext } from '../Context/CustomContext'

// Redux
import { TouchableOpacity } from 'react-native-gesture-handler'

class VoucherPDP extends Component {
  componentDidMount () {
    const { voucherInformation, actions } = this.props
    actions.getVoucherRemaining(voucherInformation.voucher_code)
    // this.props.voucherRemainingRequest(voucherInformation.voucher_code)
  }

  copyCode = () => {
    Clipboard.setString(this.props.voucherInformation.voucher_code)
    this.props.callSnackbar('Berhasil menyalin voucher')
  }

  renderVoucherBar = () => {
    const { voucherInformation, remainingVoucher } = this.props
    // const { remainingVoucher } = this.props.productDetail
    if (!isEmpty(remainingVoucher)) {
      const voucherLimit = Number(voucherInformation.limit_used)
      let usedVoucher = voucherLimit - remainingVoucher.remaining
      if (usedVoucher < Number(voucherInformation.manipulate_value)) {
        usedVoucher = voucherInformation.manipulate_value
      }
      let width = Math.round((usedVoucher / voucherLimit) * 100)
      let color = '#f0f2f7'
      if (width < 50) {
        color = '#049372'
      } else if (width < 80) {
        color = '#F3E21D'
      } else if (width <= 100) {
        color = '#F3251D'
      }
      return (
        <VoucherBarContainer>
          <View style={{ width: `${width}%`, backgroundColor: color, height: 10, borderRadius: 50, flex: 1 }} />
        </VoucherBarContainer>
      )
    } else {
      return null
    }
  }

  showTnc = () => {
    const { voucherInformation } = this.props
    let itemDetail = {
      data: {
        url_key: 'voucher-pdp'
      }
    }
    let itmData = {
      itm_source: 'pdp',
      itm_campaign: `voucher-pdp-${voucherInformation.sku}`
    }
    this.props.navigation.navigate('TahuStatic', { itemDetail, itmData })
  }

  render () {
    const { voucherInformation } = this.props
    const { width } = Dimensions.get('window')
    return (
      <VoucherCardContainer imageStyle={{ borderRadius: 5 }} source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1571976583/2.1/mobile-apps/gradient-voucher-background.webp' }}>
        <HeaderVoucher>{voucherInformation.header}</HeaderVoucher>
        <TouchableOpacity onPress={() => this.showTnc()}>
          <TnCText>Syarat & Ketentuan <Icon name='question-circle' size={12} color='white' /></TnCText>
        </TouchableOpacity>
        <InformationTextBold>Berlaku pukul {voucherInformation.start_date.split(' ')[1].substring(0, 5)} - {voucherInformation.end_date.split(' ')[1].substring(0, 5)} WIB</InformationTextBold>
        <ImageBackground source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1571973219/2.1/mobile-apps/background-voucher-mobile.webp' }} style={{ width: width * 0.9, height: ((width * 0.9) / 640) * 73, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1571973273/2.1/mobile-apps/voucher-tag.webp' }} style={{ height: 15, width: 15 }} />
            <NormalText> Kode Promo </NormalText>
            <VoucherCodeText>{voucherInformation.voucher_code}</VoucherCodeText>
          </View>
          <ButtonPrimary onPress={this.copyCode}>
            <ButtonText>Salin</ButtonText>
          </ButtonPrimary>
        </ImageBackground>
        <RowDirection>
          <InformationText>Tersedia</InformationText>
          {this.renderVoucherBar()}
        </RowDirection>
      </VoucherCardContainer>
    )
  }
}

export default WithContext(VoucherPDP)

const VoucherCardContainer = styled.ImageBackground`
  padding-vertical: 20px;
  flex-direction: column;
  justify-content: center;
  margin-vertical: 20px;
  border-radius: 5;
`

const VoucherBarContainer = styled.View`
  width: 80%;
  background-color: #f0f2f7;
  border-radius: 50;
  height: 10px;
  z-index:1;
`

const InformationTextBold = styled.Text`
  color: #fff;
  font-family: Quicksand-Bold;
  font-size: 16px;
  text-align: center;
`

const TnCText = styled.Text`
  color: white;
  font-size: 12px;
  font-family: Quicksand-Regular;
  text-align: center;
  margin-bottom: 20px;
`

const InformationText = styled.Text`
  color: #fff;
  font-family: Quicksand-Medium;
  font-size: 14px;
`

const VoucherCodeText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 16px
`

const HeaderVoucher = styled.Text`
  font-size: 26px;
  line-height: 28px;
  color: #FFF;
  font-family:Quicksand-Bold;
  text-align: center;
`

const RowDirection = styled.View`
  margin-top: 12;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 20px;
`

const ButtonPrimary = styled.TouchableOpacity`
  backgroundColor: #F26525;
  borderRadius: 5;
  padding-vertical: 5px;
  padding-horizontal: 20px;
`

const ButtonText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 14px;
  color: white;
`

const NormalText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 16px;
`
