import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity, Modal as ModalFull } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config'
import get from 'lodash/get'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import { HeaderComponent, QrIos, StoreLocation } from '../Components'

// Redux
// import StoreDataActions from '../Redux/StoreDataRedux'
import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'

// Model
import { Store } from '../Model/NewRetailImages'

// Styles
import styled from 'styled-components'

class ScanQrcode extends Component {
  constructor (props) {
    super(props)
    this.state = {
      flashlight: false,
      alert: false,
      qrStore: false,
      qrError: false,
      storeName: false,
      storeCode: '',
      modalFullVisible: false
    }
  }

  componentDidUpdate (prevProps) {
    const { storeNewRetail, storeNewRetailErr } = this.props

    if (storeNewRetail.data && storeNewRetail.data !== prevProps.storeNewRetail.data) {
      this.setState({ qrStore: true, qrError: false, storeName: storeNewRetail.data.store_name, storeCode: storeNewRetail.data.store_code })
    } else if (storeNewRetailErr && storeNewRetailErr !== prevProps.storeNewRetailErr) {
      this.setState({ qrStore: true, qrError: true, storeName: false })
    }
  }

  setParentState (state) {
    this.setState(state)
  }

  backTo () {
    const { navigation } = this.props
    let fromPDP = this.props?.route?.params?.fromPDP ?? false
    if (fromPDP) {
      let dir = 'ProductDetailPage'
      if (get(fromPDP, 'itemData.is_extended') === 0) dir = 'ProductDetailPageStore'
      navigation.setParams({ fromPDP: null })
      navigation.replace(dir, { ...fromPDP })
    }
  }

  validateQrcode = (qr) => {
    try {
      if (this.state.alert) return null
      else if (!includes(qr, config.newRetailDynamicLink)) throw new Error()
      let storeCode = qr.replace(config.newRetailDynamicLink, '')
      this.setState({ alert: true, storeCode })
      this.props.retrieveStoreNewRetail(storeCode)
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

  qrStore (qrError) {
    if (qrError) {
      this.setState({ alert: false, qrStore: false, qrError: false })
    } else {
      this.setState({ alert: false, isBarcode: true, qrStore: false, qrError: false })
    }
  }

  setFlashlight = () => {
    this.setState((state) => ({ flashlight: !state.flashlight }))
  }

  param () {
    const { flashlight } = this.state
    return {
      navigation: this.props.navigation,
      validateQrcode: this.validateQrcode.bind(this),
      setFlashlight: this.setFlashlight.bind(this),
      flashlight: flashlight
    }
  }

  render () {
    const { qrStore, qrError, storeName, storeCode } = this.state

    return (
      <View style={{ flex: 1 }}>
        <HeaderComponent back pageName={'Scan Kode QR Toko'} navigation={this.props.navigation} />
        <QrIos {...this.param()} />
        <ContentBox>
          <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>Tidak menemukan Kode QR toko?</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', fontWeight: '700' }}>Aktifkan GPS</Text>
              <Text style={{ fontFamily: 'Quicksand-Regular' }}> Anda dan </Text>
              <TouchableOpacity onPress={() => this.setState({ modalFullVisible: true })} hitSlop={{ bottom: 20, top: 20, left: 20, right: 20 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', textDecorationLine: 'underline', color: '#008CCF' }}>klik disini</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ContentBox>
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
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}>Kembali ke detail produk.</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => this.backTo()} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Lihat Produk</Text>
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
      </View>
    )
  }
}

const stateToProps = (state) => ({
  search: state.search,
  storeNewRetail: state.storeNewRetail,
  storeNewRetailErr: state.storeNewRetail.err
})

const dispatchToProps = (dispatch) => ({
  setStoreNewRetail: (data) => dispatch(StoreNewRetailActions.setStoreNewRetail(data)),
  retrieveStoreNewRetail: (data) => dispatch(StoreNewRetailActions.retrieveStoreNewRetail(data))
})

export default connect(stateToProps, dispatchToProps)(ScanQrcode)

const ContentBox = styled.View`
    backgroundColor: white;
    position: absolute;
    bottom: 0;
    padding: 10px;
    width: 100%;
    borderTopRightRadius: 6px;
    borderTopLeftRadius: 6px;
`
