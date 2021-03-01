import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Linking, Alert, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Navigate } from '../Services/NavigationService'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import Modal from 'react-native-modal'
import config from '../../config.js'
import isEmpty from 'lodash/isEmpty'
import gt from 'lodash/gt'
import get from 'lodash/get'
import includes from 'lodash/includes'

import { Store } from '../Model/NewRetailImages'
// Redux
import CartActions from '../Redux/CartRedux'
import StoreNewRetailActions from '../Redux/StoreNewRetailRedux'

export class InitStoreNewRetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      alert: false,
      isVisible: false,
      isExpireModal: false
    }
  }

  componentDidUpdate (prevProps) {
    const { storeNewRetail } = this.props
    const { alert } = this.state
    if (storeNewRetail && alert && storeNewRetail.data && storeNewRetail.data !== prevProps.storeNewRetail.data) {
      this.setState({ isVisible: true, isExpireModal: false })
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

  componentDidMount () {
    const { checkOnly, retrieveStoreNewRetail } = this.props
    if (checkOnly) this.checkAsyncStorage()
    else {
      Linking.getInitialURL().then(url => {
        if (url && includes(url, config.newRetailDynamicLink)) {
          let storeCode = url.replace(config.newRetailDynamicLink, '')
          this.setState({ alert: true }, () => retrieveStoreNewRetail(storeCode))
        } else this.checkAsyncStorage()
      })
    }
  }

  checkAsyncStorage = async () => {
    await AsyncStorage.getItem('store_new_retail_data')
      .then(value => {
        if (!isEmpty(value)) {
          let data = JSON.parse(value)
          // this.setState({ isVisible: true })
          if (gt(new Date(), new Date(data.time_expire))) {
            let now = new Date()
            if (now.getHours() >= 22) {
              this.props.cartDeleteRequest()
              this.removeStoreData()
              this.props.setStoreNewRetail(null)
            } else this.setState({ isVisible: true, isExpireModal: true })
          }
        }
      })
  }

  expandStoreDataTime = async () => {
    const { storeNewRetail, setStoreNewRetail } = this.props
    let newStoreData = { ...storeNewRetail.data }
    var dt = new Date()
    dt.setHours(dt.getHours() + 2)
    // dt.setMinutes(dt.getMinutes() + 5)
    newStoreData.time_expire = dt
    await AsyncStorage.setItem('store_new_retail_data', JSON.stringify(newStoreData))
    setStoreNewRetail(newStoreData)
    this.setState({ isVisible: false })
  }

  removeStoreData = async () => {
    this.props.cartTypeRequest()
    this.setState({ isVisible: false })
  }

  renderExpireModal () {
    const { storeNewRetail } = this.props
    return (
      <View style={{ backgroundColor: 'white', padding: 18, borderRadius: 4 }}>
        <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 16 }}>Konfirmasi</Text>
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>{`Sesi Anda di Toko ${get(storeNewRetail, 'data.store_name', '')} telah berakhir.`}</Text>
        <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 14 }}>{`Apakah Anda ingin menambah waktu berbelanja di Toko ini?`}</Text>
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>{`Catatan :`}</Text>
        <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 14 }}>{`Barang di keranjang belanja Anda akan hilang apabila Anda mengakhiri sesi di toko ini.`}</Text>
        <TouchableOpacity onPress={() => this.expandStoreDataTime()} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Iya</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.removeStoreData()} style={{ alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>Tidak</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderSaveStoreCodeModal () {
    const { storeNewRetail } = this.props
    return (
      <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18 }}>Selamat datang di toko</Text>
        <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18, textAlign: 'center' }}>{(get(storeNewRetail, 'data.store_name', '')).replace(',', ', \n')}</Text>
        <Image source={Store[(get(storeNewRetail, 'data.store_code', '')).charAt(0)]} style={{ height: 101, width: 102 }} />
        <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
          <Icon name={'information'} size={20} />
          <View style={{ flex: 1, paddingLeft: 4 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>Produk di cart Anda sebelum nya akan pindah ke produk rekomendasi.</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>Silahkan scan barcode produk yang ingin Anda beli di toko ini.</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.setState({ isVisible: false }, () => Navigate('ScanPage'))} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Scan Produk</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const { isVisible, isExpireModal } = this.state
    return (
      <Modal
        backdropTransitionOutTiming={1}
        isVisible={isVisible}
        animationIn={'slideInDown'}
        animationOut={'slideOutUp'}
        onBackdropPress={() => this.setState({ isVisible: false })}
      >
        {isExpireModal
          ? this.renderExpireModal()
          : isVisible && this.renderSaveStoreCodeModal()
        }

      </Modal>
    )
  }
}

const stateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail
})

const dispatchToProps = (dispatch) => ({
  retrieveStoreNewRetail: (data) => dispatch(StoreNewRetailActions.retrieveStoreNewRetail(data)),
  setStoreNewRetail: (data) => dispatch(StoreNewRetailActions.setStoreNewRetail(data)),
  cartTypeRequest: (data) => dispatch(CartActions.cartTypeRequest(data)),
  cartDeleteRequest: () => dispatch(CartActions.cartDeleteRequest())
})

export default connect(stateToProps, dispatchToProps)(InitStoreNewRetail)
