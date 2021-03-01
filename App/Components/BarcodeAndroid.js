import React, { Component } from 'react'
import { View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Image, Platform } from 'react-native'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { CameraKitCamera } from 'react-native-camera-kit'
import { RNCamera } from 'react-native-camera'
import { fonts } from '../Styles'

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
    // let code = data.nativeEvent.codeStringValue
    searchInit()
    if (isBarcode && isVisible === false) {
      // this.camera.pausePreview()
      validateBarcode(data?.data ?? '')
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
      if (Platform.OS === 'ios') {
        const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus()
        this.setState({ permission: isCameraAuthorized })
      } else {
        // let permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA
        check(PERMISSIONS.ANDROID.CAMERA)
          .then((result) => {
            if (result === RESULTS.GRANTED) this.setState({ permission: true })
            else request(PERMISSIONS.ANDROID.CAMERA).then(result => (result === RESULTS.GRANTED) && this.setState({ permission: true }))
          })
      }
    } catch (err) {
      console.log('error: ', err.message)
    }
  }
  // async checkPermissions () {
  //   try {
  //     const isCameraAuthorized = await CameraKitCamera.checkDeviceCameraAuthorizationStatus()
  //     this.setState({ permission: isCameraAuthorized })
  //   } catch (err) {
  //     console.log('error: ', err.message)
  //   }
  // }

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
    const { product } = this.props
    if (!permission) {
      this.checkPermissions()
      return null
    }
    // let stylingIos = Platform.OS === 'ios' ? { width, height, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' } : {}
    return (
      <View>
        <RNCamera style={{ height: height * 0.8 }} onBarCodeRead={(res) => this.readBarcode(res)} />
        <View style={{ width, height, position: 'absolute', alignItems: 'center' }}>
          <View style={{ width: width * 0.7, height: width * 0.4, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: 'white', marginTop: 100, borderRadius: 10, marginBottom: 10 }} />
          {permission
            ? product.productScanFetching
              ? <ActivityIndicator size='large' color='white' />
              : <View style={{ justifyContent: 'center', paddingHorizontal: 30 }}>
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
