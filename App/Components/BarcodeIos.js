import React, { Component } from 'react'
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { fonts } from '../Styles'

import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit'

// Redux
import SearchActions from '../Redux/SearchRedux'

const { width, height } = Dimensions.get('screen')
class BarcodeIos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      permission: false,
      isVisible: false
    }
  }

  readBarcode = (data) => {
    const { isBarcode, searchInit, validateBarcode } = this.props
    const { isVisible } = this.state
    let code = data.nativeEvent.codeStringValue
    searchInit()
    if (isBarcode && isVisible === false) {
      // this.camera.pausePreview()
      validateBarcode(code)
    }
  }

  closeModal = () => {
    // this.camera.resumePreview()
    this.setState({ isVisible: false })
  }

  componentDidUpdate (prevProps, prevState) {
    const { error } = this.props
    const { isVisible } = this.state
    if (!isEqual(error, prevProps.error) && error && isVisible === false) {
      this.setState({ isVisible: true })
    }
  }

  async checkPermissions () {
    try {
      const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus()
      this.setState({ permission: isCameraAuthorized })
    } catch (err) {
      console.log('error: ', err.message)
    }
  }

  async setFlashlight (param) {
    try {
      let flash = param ? 'on' : 'auto'
      await CameraKitCamera.setFlashMode(flash)
      this.setState({ flashlight: !param })
    } catch (err) {
      console.log('error: ', err.message)
    }
  }

  render () {
    const { permission, isVisible } = this.state
    const { product, flashlight } = this.props
    if (!permission) {
      this.checkPermissions()
      return null
    }
    let stylingIos = Platform.OS === 'ios' ? { width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' } : {}
    return (
      <View style={stylingIos}>
        <CameraKitCameraScreen
          style={{ width: width * 0.80, height: width * 0.5, marginTop: 10 }}
          cameraOptions={{
            flashMode: flashlight ? 'on' : 'off',
            focusMode: 'on' // off/on(default)
          }}
          scanBarcode={!product.productScanFetching}
          onReadCode={((data) => this.readBarcode(data))}
          onReadQRCode={((event) => console.log('readQr', event))}
          hideControls // (default false) optional, hide buttons and additional controls on top and bottom of screen
          showFrame // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
          offsetForScannerFrame={1} // (default 30) optional, offset from left and right side of the screen
          heightForScannerFrame={190}
          colorForScannerFrame={'red'} // (default white) optional, change colot of the scanner frame
        />
        <View style={{ flex: 1 }}>
          {permission
            ? product.productScanFetching
              ? <ActivityIndicator size='large' color='white' style={{ marginTop: 50 }} />
              : <View style={{ justifyContent: 'center', paddingHorizontal: 30, marginTop: 35 }}>
                {(get(product.productScanData, 'total') === 0)
                  ? <View style={{ borderWidth: 1, borderColor: 'white', marginTop: 15, padding: 20 }}>
                    <Text style={{ color: '#F3251D', fontFamily: fonts.bold, textAlign: 'center', fontSize: 14 }}>{'Produk yang dicari tidak dapat ditemukan. Coba scan lagi'}</Text>
                  </View>
                  : <Text style={{ textAlign: 'center', color: 'white', fontFamily: fonts.regular, fontSize: 16 }}>Scan Barcode Produk</Text>
                }
              </View>
            : null
          }
        </View>
        <Modal
          backdropTransitionOutTiming={1}
          isVisible={isVisible}
          animationIn={'slideInUp'}
          animationOut={'slideOutDown'}
          onSwipeComplete={() => this.closeModal()}
          swipeDirection={['down']}
        >
          <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: fonts.bold, marginBottom: 12, fontSize: 18, textAlign: 'center' }}>Produk yang Anda cari tidak dapat ditemukan</Text>
            <Image source={require('../assets/images/new-retail/not-found.webp')} style={{ height: 101, width: 102 }} />
            <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
              <Icon name={'information'} size={20} />
              <View style={{ flex: 1, paddingLeft: 4 }}>
                <Text style={{ fontFamily: fonts.regular }}>Coba scan barcode pada label harga.</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => this.closeModal()} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: fonts.medium, color: 'white', fontSize: 16 }}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  search: state.search,
  product: state.product
})

const dispatchToProps = (dispatch) => ({
  searchInit: () => dispatch(SearchActions.searchInit())
})

export default connect(stateToProps, dispatchToProps)(BarcodeIos)
