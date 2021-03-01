import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Clipboard, Linking } from 'react-native'
import HTML from 'react-native-render-html'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import htmlStyles from '../Styles/RNHTMLStyles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

class TahuTextBox extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onHover: false
    }
  }

  getBackground () {
    const { data } = this.props
    let color = (data.background_color || 'white')
    if (data.background_transparent) color = 'transparent'
    return color
  }

  buttonFeedback () {
    const { data, marketplaceAcquisition } = this.props
    let urlKey = ''
    if (data.dir === 'Browser') {
      let url = (!isEmpty(data.textLink)) ? data.textLink : data.button_link
      Linking.openURL(url)
    } else {
      if (data.dir === 'TahuStatic') {
        urlKey = data.target_url_key.replace('.html', '')
      }
      let screen = {
        ProductCataloguePage: { itemDetail: { data: { url_key: data.target_url_key }, search: '' } },
        ProductDetailPage: { itemData: { data: { url_key: data.target_url_key } } },
        OrderStatusDetail: { orderData: { order_id: get(marketplaceAcquisition, 'order', '') } },
        TahuStatic: { itemDetail: { data: { url_key: urlKey, company_code: (!isEmpty(data.target_company_code) ? data.target_company_code : (!isEmpty(this.props.companyCode)) ? this.props.companyCode : '') } } }
      }
      if (data.dir.length > 0) this.props.navigation.navigate(data.dir, screen[data.dir])
      else this.props.navigation.navigate('Profil', { fromMarketplaceAcquisition: true })
    }
  }

  copyToClipboard (code) {
    Clipboard.setString(code)
    this.props.callSnackbar('Berhasil menyalin voucher')
  }

  _onShowUnderlay () {
    // const buttonColor = this.props?.data.buttonColor || 'btn-primary'
    const buttonColor = this.props?.data['button_color'] || 'btn-primary'
    if (buttonColor.includes('btn-ghost') || buttonColor.includes('border')) {
      this.setState({ onHover: true })
    }
  }

  _onHideUnderlay () {
    // const buttonColor = this.props?.data.buttonColor || 'btn-primary'
    const buttonColor = this.props?.data['button_color'] || 'btn-primary'
    if (buttonColor.includes('btn-ghost') || buttonColor.includes('border')) {
      this.setState({ onHover: false })
    }
  }

  renderTitle (data) {
    if (!isEmpty(data.title) && (data.title !== 'Ide & Inspirasi')) {
      return <Text style={{ textAlign: 'center', fontFamily: 'Quicksand-Bold', fontSize: 16, color: `${data.text_color || `#555761`}` }}>{data.title}</Text>
    }
  }

  render () {
    const { data, marketplaceAcquisition } = this.props
    const { HTMLButtonStyling } = htmlStyles
    let { description } = data
    let btnColor = data.button_color || 'btn-primary'
    let btnSize = data.button_size || 'btn-m'

    if (marketplaceAcquisition && data.description) {
      if (description.includes('{brand}')) description = description.replace(/{brand}/g, marketplaceAcquisition.brand)
      else if (description.includes('{marketplace}')) description = description.replace(/{marketplace}/g, marketplaceAcquisition.marketplace)
    }
    return (
      <View style={{ padding: (parseInt(data.paddingContainer) || 10), backgroundColor: `${this.getBackground()}` }}>
        {this.renderTitle(data)}
        {/* {!isEmpty(data.title) && <Text style={{ textAlign: 'center', fontFamily: 'Quicksand-Bold', fontSize: 16, color: `${data.text_color || `#555761`}` }}>{data.title}</Text>} */}
        {!isEmpty(description) &&
          <HTML
            html={description}
            tagsStyles={{ ins: { textDecorationLine: 'underline' }, p: { fontFamily: 'Quicksand-Regular' }, strong: { fontFamily: 'Quicksand-Bold' } }}
            ignoredStyles={['width', 'height', 'font-weight', 'font-family']}
          />
        }
        {(data.useVoucher && marketplaceAcquisition) &&
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15, paddingBottom: 15 }}>
            <View style={{ borderWidth: 1, borderColor: '#E5E9F2', padding: 10, flexGrow: 85 }}>
              <Text>{marketplaceAcquisition.voucherCode}</Text>
            </View>
            <TouchableOpacity onPress={() => this.copyToClipboard(marketplaceAcquisition.voucherCode)} style={{ backgroundColor: '#F26524', width: 80, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: 'white' }}><Icon name='content-copy' size={20} color='white' /></Text>
            </TouchableOpacity>
          </View>
        }
        {data.use_button &&
          <ButtonContainer
            bgColor={HTMLButtonStyling[btnColor].bgColor}
            padding={HTMLButtonStyling[btnSize].padding}
            border={HTMLButtonStyling[btnColor].border}
            underlayColor={HTMLButtonStyling[btnColor].underlayColor}
            onShowUnderlay={this._onShowUnderlay.bind(this)}
            onHideUnderlay={this._onHideUnderlay.bind(this)}
            onPress={() => this.buttonFeedback()}
          >
            <ButtonText
              onHover={this.state.onHover}
              fontSize={HTMLButtonStyling[btnSize].fontSize}
              fontColor={HTMLButtonStyling[btnColor].fontColor || 'white'}
            >{data.cta_title}</ButtonText>
          </ButtonContainer>
        }
        {/* {data.use_button &&
          <ButtonSecondaryInverseM onPress={() => this.buttonFeedback()}>
            <ButtonSecondaryInverseMText>{data.cta_title}</ButtonSecondaryInverseMText>
          </ButtonSecondaryInverseM>
        } */}
      </View>
    )
  }
}

const ButtonContainer = styled.TouchableHighlight`
  background-color: ${props => props.bgColor};
  padding: ${props => props.padding};
  border: ${props => props.border};
`

const ButtonText = styled.Text`
  font-size: ${props => props.fontSize};
  color: ${props => (props.onHover ? 'white' : props.fontColor)};
  text-align: center;
`
// const ButtonSecondaryInverseM = styled.TouchableOpacity`
//   background-color: white;
//   border: 1px #008ccf solid;
//   padding: 9px;
//   border-radius: 3px;
// `
// const ButtonSecondaryInverseMText = styled.Text`
//   font-size: 16px;
//   color: #008ccf;
//   text-align: center;
//   font-family:Quicksand-Bold;
// `
export default TahuTextBox
