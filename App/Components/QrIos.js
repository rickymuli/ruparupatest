import React, { Component } from 'react'
import { View, Text, Dimensions, Linking, ActivityIndicator, Platform } from 'react-native'
import includes from 'lodash/includes'
import { connect } from 'react-redux'

import { CameraKitCameraScreen, CameraKitCamera } from 'react-native-camera-kit'

// Redux
import SearchActions from '../Redux/SearchRedux'

const { width, height } = Dimensions.get('screen')
class QrIos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      error: null,
      permission: false
    }
  }

  readBarcode = (data) => {
    const { isBarcode, validateQrcode } = this.props
    let code = data.nativeEvent.codeStringValue
    if (!isBarcode) {
      if (includes(code, 'https://') && !includes(code, 'ruparupamobileapp.page.link')) Linking.openURL(code)
      else validateQrcode(code)
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

  render () {
    const { error, permission } = this.state
    const { search, flashlight, storeNewRetail } = this.props
    if (!permission) {
      this.checkPermissions()
      return null
    }
    let stylingIos = Platform.OS === 'ios' ? { width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' } : {}
    return (
      <View style={stylingIos}>
        <CameraKitCameraScreen
          style={{ width: width * 0.80, height: width }}
          cameraOptions={{
            flashMode: flashlight ? 'on' : 'off',
            focusMode: 'on' // off/on(default)
          }}
          onReadCode={((data) => this.readBarcode(data))}
          onReadQRCode={((event) => console.log('readQr', event))}
          hideControls={false} // (default false) optional, hide buttons and additional controls on top and bottom of screen
          showFrame // (default false) optional, show frame with transparent layer (qr code or barcode will be read on this area ONLY), start animation for scanner,that stoped when find any code. Frame always at center of the screen
          qrFrame
          offsetForScannerFrame={1} // (default 30) optional, offset from left and right side of the screen
          heightForScannerFrame={290}
          frameHeightAndroid={350}
          frameSizeAndroid={390}
          colorForScannerFrame={'red'} // (default white) optional, change colot of the scanner frame
        />
        <View style={{ flex: 1 }}>
          {permission
            ? search.fetching || storeNewRetail.fetching
              ? <ActivityIndicator size='large' color='white' />
              : <View style={{ justifyContent: 'center', paddingHorizontal: 30 }}>
                {(error)
                  ? <View style={{ borderWidth: 1, borderColor: 'white', marginTop: 15, padding: 20 }}>
                    <Text style={{ color: '#F3251D', fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 14 }}>{error}</Text>
                  </View>
                  : <Text style={{ textAlign: 'center', color: 'white', fontFamily: 'Quicksand-Regular', fontSize: 16, paddingBottom: 10 }}>Scan Kode QR Toko</Text>
                }
              </View>
            : null
          }
        </View>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  search: state.search,
  storeNewRetail: state.storeNewRetail
})

const dispatchToProps = (dispatch) => ({
  searchInit: () => dispatch(SearchActions.searchInit())
})

export default connect(stateToProps, dispatchToProps)(QrIos)
