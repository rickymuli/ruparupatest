import React, { Component } from 'react'
import { View, Text, Dimensions, Linking, ActivityIndicator } from 'react-native'
import includes from 'lodash/includes'
import { connect } from 'react-redux'

import { CameraKitCamera } from 'react-native-camera-kit'
import { RNCamera } from 'react-native-camera'

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
    let code = data?.data ?? ''
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
    const { search, storeNewRetail } = this.props
    if (!permission) {
      this.checkPermissions()
      return null
    }
    // let stylingIos = Platform.OS === 'ios' ? { width, height, top: -20 } : {}
    return (
      <View>
        {/* <CameraKitCameraScreen
          // style={{width, height, top: -60}}
          cameraOptions={{
            flashMode: flashlight ? 'on' : 'off',
            focusMode: 'on' // off/on(default)
          }}
          onReadCode={((data) => this.readBarcode(data))}
          onReadQRCode={((event) => console.log('readQr', event))}
        /> */}
        <RNCamera style={{ height: height * 0.8 }} onBarCodeRead={(res) => this.readBarcode(res)} />
        <View style={{ width, height, position: 'absolute', alignItems: 'center' }}>
          <View style={{ width: width * 0.7, height: width * 0.7, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'white', marginTop: 70, borderRadius: 10, marginBottom: 10 }} />
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
