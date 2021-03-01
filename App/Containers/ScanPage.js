import React, { Component } from 'react'
import { View, TouchableOpacity, Alert, Text, Image, Modal as ModalFull, Linking, Platform, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import includes from 'lodash/includes'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import BarcodeAndroid from '../Components/BarcodeAndroid'
import QrAndroid from '../Components/QrAndroid'
import { BarcodeIos, HeaderComponent, QrIos, Snackbar, StoreLocation, ScanGuide } from '../Components'
import EasyModal from '../Components/EasyModal'
import analytics from '@react-native-firebase/analytics'

// Modal
import { Store } from '../Model/NewRetailImages'
// Redux
import SearchActions from '../Redux/SearchRedux'
import ProductActions from '../Redux/ProductRedux'
// import StoreDataActions from '../Redux/StoreDataRedux'
import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'

// Styles
import styled from 'styled-components'
import { colors } from '../Styles'

class ScanPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: false,
      modalFullVisible: false,
      sku: '',
      flashlight: false,
      isBarcode: true,
      alert: false,
      onScan: false,
      barcodeError: false,
      qrStore: false,
      qrError: false,
      storeName: false,
      storeCode: ''
    }
  }

  setParentState (state) {
    this.setState(state)
  }

  // async componentDidMount() {
  // }

  // componentDidMount () {
  //   this.validateBarcode('228247')
  // }

  componentDidUpdate (prevProps) {
    const { product, navigation, storeNewRetail, storeNewRetailErr } = this.props
    const { alert, onScan } = this.state
    if (!isEmpty(product.productScanData) && get(product.productScanData, 'total') > 0 && onScan === true) {
      this.setState({ flashlight: false, onScan: false, success: true }, () => {
        let validProduct = true
        let selectedProduct = product.productScanData.products[0]
        let storeName = ''
        let sku = get(selectedProduct, 'variants[0].sku', '')

        if (!isEmpty(storeNewRetail.data) && storeNewRetail.data.store_name) {
          storeName = storeNewRetail.data.store_name
        }

        let itmParameter = {
          itm_source: 'Barcode',
          itm_campaign: 'scan barcode',
          itm_term: sku
        }
        let param = {
          itemData: selectedProduct,
          storeName: storeName,
          isScanned: true,
          itmParameter
        }

        let dir = ''
        if (selectedProduct.is_extended === 10 && selectedProduct.variants.length > 0) {
          dir = 'ProductDetailPage'
        } else if (selectedProduct.is_extended === 0 && selectedProduct.status_retail === 10 && selectedProduct.variants.length > 0) {
          dir = 'ProductDetailPageStore'
        } else validProduct = false

        if (validProduct) {
          if (this.state.isBarcode) analytics().logEvent('barcode_scan_success', { sku: this.state.sku })
          navigation.replace(dir, param)
        } else {
          // this.snackbar.call('Produk yang dicari tidak dapat ditemukan. Coba scan lagi', 'error')
          this.setState({ barcodeError: true, onScan: false })
        }
      })
    } else if (onScan === true && !isEmpty(product.productScanErr)) {
      // this.snackbar.call(product.productScanErr, 'error')
      this.setState({ flashlight: false, onScan: false, barcodeError: true })
    }

    if (alert && storeNewRetail.data && storeNewRetail.data !== prevProps.storeNewRetail.data) {
      this.setState({ qrStore: true, qrError: false, storeName: storeNewRetail.data.store_name, storeCode: storeNewRetail.data.store_code })
    } else if (storeNewRetailErr && storeNewRetailErr !== prevProps.storeNewRetailErr) {
      this.setState({ qrStore: true, qrError: true, storeName: false })
    }
  }

  alert (message) {
    Alert.alert(
      'Message',
      message,
      [
        {
          text: 'Ok',
          onPress: () => this.setState({ alert: false })
        }
      ],
      { cancelable: false }
    )
  }

  successAlert (message) {
    Alert.alert(
      'Message',
      message,
      [
        {
          text: 'Scan Product',
          onPress: () => this.setState({ alert: false, isBarcode: true })
        }
      ],
      { cancelable: false }
    )
  }

  qrStore (qrError) {
    if (qrError) {
      this.setState({ alert: false, qrStore: false, qrError: false })
    } else {
      this.setState({ alert: false, isBarcode: true, qrStore: false, qrError: false })
    }
  }

  validateBarcode (sku) {
    if (this.state.success || this.state.onScan) return null
    this.setState({ onScan: true, sku: sku, barcodeError: false })
    this.props.productScanRequest({ sku })
  }

  validateQrcode = (qr) => {
    try {
      if (this.state.alert) return null
      else if (includes(qr, config.newRetailDynamicLink) || includes(qr, 'https://l.ead.me/')) {
        let storeCode = qr.replace(config.newRetailDynamicLink, '')
        if (qr === 'https://l.ead.me/bbT7h4') storeCode = 'A445'
        this.props.retrieveStoreNewRetail(storeCode)
        analytics().logEvent('qrcode_scan_success', { sku: storeCode })
        this.setState({ alert: true, storeCode })
      } else if (includes(qr, 'https://ruparupamobileapp.page.link/') || includes(qr, 'https://ruparupa.page.link/')) Linking.openURL(qr)
      else throw new Error()
    } catch (error) {
      this.setState({ qrStore: true, qrError: true, storeName: false })
    }
  }

  validateQrcodeByLocation = (storeCode) => {
    try {
      if (this.state.alert) return null
      this.setState({ modalFullVisible: false })
      this.props.retrieveStoreNewRetail(storeCode)
      this.setState({ alert: true, storeCode })
    } catch (error) {
      this.setState({ qrStore: true, qrError: true, storeName: false })
    }
  }

  componentWillUnmount () {
    this.setState({ alert: false, onScan: false })
    this.props.searchInit()
  }

  setFlashlight = () => {
    this.setState((state) => ({ flashlight: !state.flashlight }))
  }

  param () {
    const { flashlight, isBarcode, barcodeError, onScan } = this.state

    let error = false
    if (barcodeError) {
      error = true
    }

    return {
      navigation: this.props.navigation,
      validateBarcode: this.validateBarcode.bind(this),
      validateQrcode: this.validateQrcode.bind(this),
      setFlashlight: this.setFlashlight.bind(this),
      flashlight: flashlight,
      isBarcode: isBarcode,
      product: this.props.product,
      error: error,
      onScan: onScan
    }
  }

  renderBody () {
    const { isBarcode } = this.state
    return (
      <View>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 20 }}>
          <Button onPress={() => this.setState({ isBarcode: false })} active={!isBarcode}>
            <Icon name={'qrcode'} color={isBarcode ? 'grey' : 'white'} size={38} />
            <TextButton active={!isBarcode} >{'Scan Qrcode'}</TextButton>
          </Button>
          <Button onPress={() => this.setState({ isBarcode: true })} active={isBarcode}>
            <Icon name={'barcode'} color={!isBarcode ? 'grey' : 'white'} size={38} />
            <TextButton active={isBarcode}> {'Scan Barcode'} </TextButton>
          </Button>
        </View>
        {isBarcode
          ? <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>Kesulitan dalam scan barcode?</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.setState({ isVisible: true })} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', textDecorationLine: 'underline', color: '#008CCF' }}>Lihat petunjuk</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Quicksand-Regular' }}> atau </Text>
              <TouchableOpacity onPress={() => this.easy.setModal(true)} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', textDecorationLine: 'underline', color: '#008CCF' }}>Input manual</Text>
              </TouchableOpacity>
            </View>
          </View>
          : <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>Tidak menemukan Kode QR toko?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>Aktifkan GPS</Text>
              <Text style={{ fontFamily: 'Quicksand-Regular' }}> Anda dan </Text>
              <TouchableOpacity onPress={() => this.setState({ modalFullVisible: true })} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', textDecorationLine: 'underline', color: '#008CCF' }}>klik disini</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      </View>
    )
  }

  render () {
    const { isBarcode, isVisible, qrStore, qrError, storeName, storeCode } = this.state
    return (
      <View style={{ flex: 1 }}>
        {isBarcode
          ? <HeaderComponent close pageName={'Halaman Scan'} navigation={this.props.navigation} />
          : <HeaderComponent close pageName={'Scan Kode QR Toko'} navigation={this.props.navigation} />
        }
        {isBarcode
          ? Platform.OS === 'ios' ? <BarcodeIos {...this.param()} />
            : <BarcodeAndroid {...this.param()} />
          : Platform.OS === 'ios' ? <QrIos {...this.param()} />
            : <QrAndroid {...this.param()} />
        }
        <ContentBox style={{ shadowRadius: 2, shadowOffset: { width: 0, height: -3 }, shadowColor: '#000000', elevation: 4 }}>
          {this.renderBody()}
          <Snackbar ref={ref => { this.snackbar = ref }} />
        </ContentBox>
        <Modal
          backdropTransitionOutTiming={1}
          isVisible={isVisible}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onSwipeComplete={() => this.setState({ isVisible: false })}
          swipeDirection={['down']}
        >
          <ScanGuide setParentState={this.setParentState.bind(this)} />
        </Modal>
        <Modal
          backdropTransitionOutTiming={1}
          isVisible={qrStore}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onSwipeComplete={() => this.qrStore(qrError)}
          swipeDirection={['down']}
        >
          {(qrError)
            ? <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18 }}>Kode QR tidak valid</Text>
              <Image source={require('../assets/images/new-retail/qr-code-not-found.webp')} style={{ height: 101, width: 102 }} />
              <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
                <Icon name={'information'} size={20} />
                <View style={{ flex: 1, paddingLeft: 4 }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}>Pastikan Anda melakukan scan kode QR toko di lokasi Anda saat ini.</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.qrStore(qrError)} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Coba Lagi</Text>
              </TouchableOpacity>
            </View>
            : <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18 }}>Selamat datang di toko</Text>
              <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18, textAlign: 'center' }}>{(storeName || '').replace(',', ', \n')}</Text>
              <Image source={Store[storeCode.charAt(0)]} style={{ height: 101, width: 102 }} />
              <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
                <Icon name={'information'} size={20} />
                <View style={{ flex: 1, paddingLeft: 4 }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}>Produk di cart Anda sebelum nya akan pindah ke produk rekomendasi.</Text>
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}>Silahkan scan barcode produk yang ingin Anda beli di toko ini.</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.qrStore(qrError)} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Scan Produk</Text>
              </TouchableOpacity>
            </View>
          }
        </Modal>
        <ModalFull
          animationType='fade'
          visible={this.state.modalFullVisible}
          onRequestClose={() => { this.setState({ modalFullVisible: false }) }}>
          <StoreLocation validateQrcodeByLocation={this.validateQrcodeByLocation.bind(this)} setParentState={this.setParentState.bind(this)} />
        </ModalFull>
        <EasyModal ref={(ref) => (this.easy = ref)} title={'Input sku manual'} close>
          <View style={{ borderWidth: 1, borderStyle: 'solid', borderRadius: 5, borderColor: colors.primary, margin: 10 }}>
            <TextInput
              // placeholderTextColor='#666'
              placeholder='SKU'
              style={{ marginHorizontal: 10, padding: 10, color: '#333' }}
              autoFocus
              onSubmitEditing={(event) => {
                this.validateBarcode(event.nativeEvent.text)
                this.easy.setModal(false)
              }}
            />
          </View>
          {/* <TextInput // package rnpaper
            label='SKU'
            mode='outlined'
            style={{ margin: 10 }}
            onSubmitEditing={(event) => {
              this.validateBarcode(event.nativeEvent.text)
              this.easy.setModal(false)
            }}
          /> */}
        </EasyModal>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  storeNewRetailErr: state.storeNewRetail.err,
  product: state.product,
  productScan: state.product.productScanData
})

const dispatchToProps = (dispatch) => ({
  searchProductByKeyword: (keyword) => dispatch(SearchActions.searchByKeywordRequest(keyword)),
  productScanRequest: (data) => dispatch(ProductActions.productScanRequest(data)),
  // storeDataRequest: (data) => dispatch(StoreDataActions.storeDataRequest(data)),
  // saveStoreData: (data) => dispatch(StoreDataActions.saveStoreData(data)),
  retrieveStoreNewRetail: (data) => dispatch(StoreNewRetailActions.retrieveStoreNewRetail(data)),
  setStoreNewRetail: (data) => dispatch(StoreNewRetailActions.setStoreNewRetail(data)),
  searchInit: () => dispatch(SearchActions.searchInit())
})

export default connect(stateToProps, dispatchToProps)(ScanPage)

const ContentBox = styled.View`
    backgroundColor: white;
    position: absolute;
    bottom: 0;
    width: 100%;
    borderTopRightRadius: 6px;
    borderTopLeftRadius: 6px;
`

const TextButton = styled.Text`
  color: ${props => props.active ? 'white' : 'grey'};
  paddingLeft: 4;
  fontFamily: Quicksand-Medium;
  fontSize: 15;
`

const Button = styled.TouchableOpacity`
  ${props => props.active
    ? 'backgroundColor: #F26524; zIndex:1;'
    : 'borderWidth: 1; borderColor: grey; zIndex:0;'
}
  flexDirection: row;
  justifyContent: center;
  alignItems: center;
  borderRadius: 6;
  paddingVertical: 6px;
  paddingHorizontal: 12px;
`
