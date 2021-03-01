import React, { Component } from 'react'
import { Dimensions, ScrollView, View, TouchableOpacity, Text, Clipboard, Platform } from 'react-native'
// import HTML from 'react-native-render-html'
import { WebView } from 'react-native-webview'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'

import EasyModal from '../Components/EasyModal'
import Snackbar from '../Components/SnackbarComponent'

const { width } = Dimensions.get('screen')
class TahuTnc extends Component {
  constructor (props) {
    super(props)
    this.state = {
      title: null,
      desc: null,
      voucher: null,
      useButton: false,
      buttonName: '',
      tncDir: '',
      tncUrlKey: '',
      heightWebview: 2000
    }
    this.navStateChange = this.onNavigationStateChange.bind(this)
  }

  openTnc = (title, desc, voucher, useButton, buttonName, tncDir, tncUrlKey) => {
    this.setState({ title, desc, voucher, useButton, buttonName, tncDir, tncUrlKey }, () => this.tncModal.setModal(true))
  }

  copyToClipboard = (code) => {
    Clipboard.setString(code)
    this.modal.call('Berhasil menyalin voucher')
  }

  tncBtnPressed = () => {
    const { tncDir, tncUrlKey } = this.state
    const itemDetail = {
      data: {
        url_key: tncUrlKey
      },
      search: ''
    }
    const itmData = {
      itm_source: 'PromoPage',
      itm_campaign: tncUrlKey
    }
    this.tncModal.setModal(false)
    this.props.navigation.navigate(tncDir, { itemDetail, itmData })
  }
  onNavigationStateChange (navState) {
    this.setState({
      heightWebview: isEmpty(navState.title) ? this.state.heightWebview : navState.title
    })
  }
  render () {
    const { title, desc, voucher, useButton, buttonName, heightWebview } = this.state
    const scalesPageToFit = Platform.OS === 'android'
    return (
      <EasyModal ref={(ref) => { this.tncModal = ref }} >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>{title}</ModalTitle>
            <ModalCloseIcon onPress={() => { this.tncModal.setModal(false) }}>
              <Icon name='close' size={24} />
            </ModalCloseIcon>
          </ModalHeader>
          <ScrollView>
            <ModalContent>
              {!isEmpty(voucher) &&
              <VoucherContent>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', width: 30, height: 30, marginLeft: -15, marginRight: 15 }}>
                    <Square />
                    <Circle />
                  </View>
                  <View style={{ flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757886' }}>Kode Promo</Text>
                    <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{voucher}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.copyToClipboard(voucher)}>
                    <Icon name={'content-copy'} size={30} />
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', width: 30, height: 30, marginRight: -15, marginLeft: 15 }}>
                    <Square style={{ right: 0 }} />
                    <Circle />
                  </View>
                </View>
              </VoucherContent>
              }
              {(!isEmpty(desc)) &&
                <WebView
                  scalesPageToFit={scalesPageToFit}
                  bounces={false}
                  scrollEnabled={false}
                  injectedJavaScript={'const meta = document.createElement(\'meta\'); meta.setAttribute(\'content\', \'width=device-width, initial-scale=1, maximum-scale=0.99, user-scalable=0\'); meta.setAttribute(\'name\', \'viewport\'); document.getElementsByTagName(\'head\')[0].appendChild(meta);window.location.hash = 1;document.title = document.getElementsByTagName(\'html\')[0].scrollHeight;'}
                  javaScriptEnabled
                  onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                  style={{ height: (!isNaN(heightWebview) ? Number(heightWebview) : 1000), width: '100%' }}
                  source={{
                    html: `
                          <!DOCTYPE html>
                          <html>
                            <head>
                            <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
                            <style>
                            html{
                              overflow-x: hidden;
                              overflow-y: scroll;
                              width: ${width};
                            }
                            table, th, td {
                              border: 1px solid black;
                              border-collapse: collapse;
                            }
                            jodit{
                              width: ${width};
                            }
                            </style>
                            </head>
                            <body>
                              ${desc}
                            </body>
                          </html>
                    `
                  }}
                  automaticallyAdjustContentInsets={false}
                />
                // <HTML
                //   html={desc}
                //   tagsStyles={{ ins: { textDecorationLine: 'underline' }, li: { fontFamily: 'Quicksand-Medium', width: '90%' }, strong: { fontFamily: 'Quicksand-Bold' }, img: { alignSelf: 'center' }, p: { height: 30 } }}
                //   ignoredStyles={['width', 'height', 'font-weight']}
                //   ignoredTags={['span']}
                // />
              }
              {useButton
                ? <ButtonPrimary onPress={() => this.tncBtnPressed()}>
                  <ButtonTextPrimary>{buttonName}</ButtonTextPrimary>
                </ButtonPrimary>
                : null
              }
            </ModalContent>
          </ScrollView>
        </ModalContainer>
        <Snackbar ref={ref => { this.modal = ref }} />
      </EasyModal>
    )
  }
}

export default TahuTnc

const ModalContainer = styled.View`
  flex-direction: column;
  flex: 1;
`
const ModalHeader = styled.View`
  flex-direction: row;
  padding-vertical: 15px;
  justify-content: center;
  width: ${width};
  border-bottom-width: 1;
  border-bottom-color: #D4DCE6;
`
const ModalTitle = styled.Text`
  padding-horizontal: 38px;
  text-align: center;
  font-family: Quicksand-Bold;
  font-size: 20px;
  color: #757885;
`
const ModalCloseIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15;
  top: 15;
`
const ModalContent = styled.View`
  padding: 10px;
`
const VoucherContent = styled.View`
  backgroundColor:#E5F7FF;
  width: 320;
  height: 80;
  marginBottom: 10px;
  alignSelf: center;
  justifyContent: space-between;
  alignItems: center;
  flexDirection: row;
  borderStyle: dotted;
  borderWidth: 2;
  borderRadius: 1;
`

const Square = styled.View`
  position: absolute;
  width: 15;
  height: 30;
  zIndex: 1;
  backgroundColor: white;
`

const Circle = styled.View`
  backgroundColor: white;
  width: 30;
  height: 30;
  borderWidth: 2;
  borderRadius: 15;
  zIndex:0;
  borderStyle: dotted;
`

const ButtonPrimary = styled.TouchableOpacity`
  backgroundColor: #F26525;
  borderRadius: 5;
  padding: 10px;
`

const ButtonTextPrimary = styled.Text`
  fontFamily: Quicksand-Bold;
  textAlign: center;
  color: white;
`
