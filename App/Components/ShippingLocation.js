import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Modal, Image, SafeAreaView, Dimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config.js'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import find from 'lodash/find'
import includes from 'lodash/includes'
import startsWith from 'lodash/startsWith'
import { UpperCase } from '../Utils/Misc'

// contex
import { WithContext } from '../Context/CustomContext'

// Redux
import MiscActions from '../Redux/MiscRedux'
import LocationActions from '../Redux/LocationRedux'

// Styles
import styles from './Styles/ShippingLocationStyles'
import styled from 'styled-components'

// Components
import GojekPdp from './GojekPdp'
import PickupComponent from './PickupComponent'
import FreeShipping from './FreeShipping'
// import EasyModal from '../Components/EasyModal'
// import Loading from '../Components/LoadingComponent'
import PickerLocation from '../Components/PickerLocation'

class ShippingLocation extends Component {
  constructor (props) {
    super(props)
    this.pickerRef = null
    this.state = {
      selectedProvince: '490',
      selectedCity: '573',
      selectedKecamatan: '7004',
      provinceName: 'DKI JAKARTA',
      cityName: 'KOTA. JAKARTA BARAT',
      kecamatanName: 'KEMBANGAN',
      canDelivery: props.productDetail?.canDelivery ?? null,
      canDeliveryChecked: false,
      payload: props.payload || null,
      stock: props.stock || null,
      urlKey: props.urlKey,
      modalVisible: false,
      productDetail: props.productDetail,
      quantity: props.quantity || '1',
      showMore: false,
      expressDelivery: null,
      activeVariant: null,
      cityErr: null,
      kecamatanErr: null,
      location: null
    }
  }

  componentDidMount = async () => {
    const { activeVariant, quantity, address, route } = this.props
    if (get(address, 'selected')) {
      let { province, city, kecamatan } = address.selected
      await this.setState({
        selectedProvince: province.province_id,
        selectedCity: city.city_id,
        selectedKecamatan: kecamatan.kecamatan_id,
        provinceName: province.province_name,
        cityName: city.city_name,
        kecamatanName: kecamatan.kecamatan_name
      })
    }
    this.setShippingLocation()
    this.props.getProvince()
    if (!this.props.fromFilter) {
      let isProductScanned = ((route && (route.params?.isScanned ?? false)) === true) ? 10 : 0
      this.props.actions.getProductCanDelivery(activeVariant.sku, this.state.selectedKecamatan, quantity, isProductScanned)
      // this.props.fetchProductCanDelivery(activeVariant.sku, this.state.selectedKecamatan, quantity, isProductScanned)
    }
  }

  componentDidUpdate (prevProps) {
    const { selectedKecamatan } = this.state
    const { activeVariant, quantity, route } = this.props
    if (((prevProps.activeVariant !== activeVariant) || (Number(prevProps.quantity) !== Number(quantity))) && !this.props.fromFilter) {
      this.setShippingLocation()
      let isProductScanned = ((route && (route.params?.isScanned ?? false)) === true) ? 10 : 0
      this.props.actions.getProductCanDelivery(activeVariant.sku, selectedKecamatan, Number(quantity), isProductScanned)
      // this.props.fetchProductCanDelivery(activeVariant.sku, selectedKecamatan, Number(quantity), isProductScanned)
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (props.location !== state.location) {
      returnObj = {
        ...returnObj,
        location: props.location
      }
      if (!isEmpty(props.location.province)) {
        const { province } = props.location
        returnObj = {
          ...returnObj,
          selectedProvince: province.province_id,
          provinceName: province.province_name
        }
      }
      if (!isEmpty(props.location.city)) {
        const { city } = props.location
        returnObj = {
          ...returnObj,
          selectedCity: city.city_id,
          cityName: city.city_name
        }
      }
      if (!isEmpty(props.location.kecamatan)) {
        const { kecamatan } = props.location
        returnObj = {
          ...returnObj,
          selectedKecamatan: kecamatan.kecamatan_id,
          kecamatanName: kecamatan.kecamatan_name
        }
      }
    }
    if (props.stock !== state.stock) {
      returnObj = {
        ...returnObj,
        stock: props.stock
      }
    }
    if (props.productDetail !== state.productDetail) {
      const { canDelivery } = props.productDetail
      returnObj = {
        ...returnObj,
        productDetail: props.productDetail,
        activeVariant: props.activeVariant,
        expressDelivery: props.expressDelivery,
        canDelivery,
        canDeliveryChecked: true
      }
    }
    if (props.quantity !== state.quantity) {
      returnObj = {
        ...returnObj,
        quantity: props.quantity
      }
    }
    return returnObj
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  confirmSelection = (selectedProvince, selectedCity, selectedKecamatan, province, city, kecamatan) => {
    const { productDetail } = this.state
    const { activeVariant, quantity, route } = this.props
    if (selectedCity && selectedKecamatan && selectedProvince) {
      const { province_name: provinceName, province_id: provinceId } = find(province, ['province_id', selectedProvince]) || {}
      const { city_name: cityName, city_id: cityId } = find(city, ['city_id', selectedCity]) || {}
      const { kecamatan_name: kecamatanName, kecamatan_id: kecamatanId } = find(kecamatan, ['kecamatan_id', selectedKecamatan]) || {}
      let location = {
        selectedProvince: provinceId,
        selectedKecamatan: kecamatanId,
        selectedCity: cityId,
        cityName,
        kecamatanName,
        provinceName,
        cityErr: '',
        kecamatanErr: ''
      }
      if (!this.props.fromFilter) {
        let isProductScanned = ((route && (route.params?.isScanned ?? false)) === true) ? 10 : 0
        this.props.actions.getProductCanDelivery(activeVariant.sku, selectedKecamatan, quantity, isProductScanned)
        // this.props.fetchProductCanDelivery(activeVariant.sku, selectedKecamatan, quantity, isProductScanned)
        location['canDeliveryChecked'] = true
        location['canDelivery'] = productDetail.canDelivery
      } else {
        this.setLocation(location)
      }
      this.setState(location)
      this.props.setProvince({ province_id: selectedProvince, province_name: provinceName })
      this.props.setCity({ city_id: selectedCity, city_name: cityName })
      this.props.setKecamatan({ kecamatan_id: selectedKecamatan, kecamatan_code: selectedKecamatan, kecamatan_name: kecamatanName })
      this.setModalVisible(false)
    } else {
      let err = {
        cityErr: isEmpty(selectedCity) ? 'Kota tidak boleh kosong' : '',
        kecamatanErr: isEmpty(selectedKecamatan) ? 'Kecamatan tidak boleh kosong' : ''
      }
      this.setState(err)
    }
  }

  setParentState = (state) => this.setState(state)

  renderInformation = () => {
    return (
      <InfoBoxPcp>
        <Icon name='information' size={16} style={{ marginRight: 5, marginTop: 2 }} />
        <View style={{ flexWrap: 'wrap' }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', lineHeight: 20, width: Dimensions.get('screen').width * 0.80 }}>Untuk pengiriman yang lebih akurat, Kami memerlukan data kecamatan Anda</Text>
        </View>
      </InfoBoxPcp>
    )
  }

  renderModalLocationContent = () => {
    const { selectedProvince, selectedCity, selectedKecamatan } = this.state
    let obj = {
      province: {
        province_id: selectedProvince
      },
      city: {
        city_id: selectedCity
      },
      kecamatan: {
        kecamatan_id: selectedKecamatan
      }
    }
    return (
      <View style={{ padding: 10, flexDirection: 'column' }}>
        <PickerLocation setParentState={this.setParentState} pickerRef={ref => { this.pickerRef = ref }} address={obj} handleSubmit={this.confirmSelection} />
      </View>
    )
  }

  renderPengiriman () {
    const { ownFleet } = this.props
    if (!isEmpty(ownFleet)) {
      return (
        <DelivBox>
          <Icon name={'information'} size={12} style={{ marginTop: 2 }} />
          <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12, textAlign: 'center' }}>{`Pengiriman menggunakan ${ownFleet === 'AHI' ? 'Ace' : 'Informa'} Delivery khusus area Jakarta ± 3 Hari`}</Text>
        </DelivBox>
      )
    }
    return null
  }

  renderCanDeliveryGoSend () {
    const { expressDelivery, kecamatanName } = this.state
    return (
      <View>
        <View style={{ backgroundColor: '#E5F7FF', padding: 15, justifyContent: 'center' }}>
          {(!isEmpty(expressDelivery) && (expressDelivery.same_day === '1' || expressDelivery.instant_delivery === '1'))
            ? <Text style={{ fontFamily: 'Quicksand-Regular' }}>Product tidak tersedia untuk pengiriman GO-SEND ke area Anda. <Text onPress={() => this.setModalVisible(true)} style={{ textDecorationLine: 'underline', fontFamily: 'Quicksand-Regular' }}>ubah lokasi</Text></Text>
            : <Text style={{ fontFamily: 'Quicksand-Regular' }}>Maaf, saat ini layanan pengiriman GO-SEND tersedia di daerah {kecamatanName.toLowerCase()}. <Text onPress={() => this.setModalVisible(true)} style={{ textDecorationLine: 'underline', fontFamily: 'Quicksand-Regular' }}>ubah lokasi</Text></Text>
          }
        </View>
      </View>
    )
  }

  renderCanDeliver = () => {
    const { canDelivery, cityName, kecamatanName, stock } = this.state
    const { quantity, activeVariant, payload } = this.props

    let stockFiltered = []
    let newQuantity = activeVariant.label.toLowerCase() === 'buy 1 get 1' ? quantity * 2 : quantity
    // noted: can delivery not working at MP product so we check if product using prefix M
    let mpProduct = (startsWith(get(stockFiltered, '[0].pickup_code'), 'M'))
    // if ((canDelivery && canDeliveryChecked) || mpProduct) {
    // let canDeliv = (canDelivery && (canDelivery.can_delivery || canDelivery.can_delivery_gosend)) || mpProduct
    let goSend = (config.enableGosend && activeVariant)
    if (stock && stock.location && stock.location.length > 0) {
      stockFiltered = stock.location.filter((location) => {
        if (!includes(['', 'DC'], location.pickup_code)) {
          return Number(location.qty) >= Number(newQuantity)
        }
      })
    }
    if (!stock || (stock && stock.global_stock_qty <= 0)) {
      return (
        <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
          {canDelivery && canDelivery.can_delivery
            ? <Image source={require('../assets/images/delivery-logo/reguler-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
            : <Image source={require('../assets/images/delivery-logo/reguler-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
          }
          {(goSend) &&
            <GojekPdp canDelivery={canDelivery} />
          }
          {['AHI', 'HCI'].includes(payload.supplier.supplier_alias) &&
            canDelivery && canDelivery.can_delivery_ownfleet
            ? payload.supplier.supplier_alias === 'AHI'
              ? <Image source={require('../assets/images/delivery-logo/ownfleet-ace-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
              : payload.supplier.supplier_alias === 'HCI'
                ? <Image source={require('../assets/images/delivery-logo/ownfleet-informa-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                : null
            : payload.supplier.supplier_alias === 'AHI'
              ? <Image source={require('../assets/images/delivery-logo/ownfleet-ace-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
              : payload.supplier.supplier_alias === 'HCI'
                ? <Image source={require('../assets/images/delivery-logo/ownfleet-informa-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                : null
          }
        </View>
      )
    } else {
      return (
        <View>
          {(canDelivery && canDelivery.can_delivery) && <FreeShipping activeVariant={activeVariant} />}
          <View style={{ marginTop: 15, marginBottom: 5 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 4, color: '#757886' }}>Jenis Pengiriman Tersedia</Text>
            {(goSend && canDelivery && !canDelivery.can_delivery_gosend) && this.renderCanDeliveryGoSend()}
            <View style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
              {canDelivery && canDelivery.can_delivery
                ? <Image source={require('../assets/images/delivery-logo/reguler-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                : <Image source={require('../assets/images/delivery-logo/reguler-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
              }
              {(goSend) &&
                <GojekPdp canDelivery={canDelivery} />
              }
              {['AHI', 'HCI'].includes(payload.supplier.supplier_alias) &&
                canDelivery && canDelivery.can_delivery_ownfleet
                ? payload.supplier.supplier_alias === 'AHI'
                  ? <Image source={require('../assets/images/delivery-logo/ownfleet-ace-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                  : payload.supplier.supplier_alias === 'HCI'
                    ? <Image source={require('../assets/images/delivery-logo/ownfleet-informa-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                    : null
                : payload.supplier.supplier_alias === 'AHI'
                  ? <Image source={require('../assets/images/delivery-logo/ownfleet-ace-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                  : payload.supplier.supplier_alias === 'HCI'
                    ? <Image source={require('../assets/images/delivery-logo/ownfleet-informa-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, height: 40, marginRight: 10, marginTop: 10 }} />
                    : null
              }
            </View>
            {(!mpProduct) &&
              <PickupComponent
                stockFiltered={stockFiltered}
                data={{ sku: get(activeVariant, 'sku', ''), activeVariant, quantity }}
                navigation={this.props.navigation}
                canDelivery={canDelivery} />
            }
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 4, color: '#757886' }}>Ketersediaan Pengiriman</Text>
            <TouchableOpacity onPress={() => this.setModalVisible(true)} style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 10, borderRadius: 3, borderWidth: 1, borderColor: '#E5E9F2', marginTop: 20 }}>
              <Icon name='map-marker' size={16} style={{ marginRight: 2 }} />
              <Text style={{ fontFamily: 'Quicksand-Regular', alignItems: 'center', flexWrap: 'wrap', flex: 1, color: '#757885', fontSize: 16, textAlign: 'center' }}>
                {UpperCase(cityName.toLowerCase())}, {UpperCase(kecamatanName.toLowerCase())}
              </Text>
              <Text style={{ color: '#008CCF', fontFamily: 'Quicksand-Medium' }}>Ubah</Text>
            </TouchableOpacity>
            {this.renderPengiriman()}
          </View>
        </View>
      )
    }
  }

  setShippingLocation = async () => {
    let { selectedKecamatan } = this.state
    let expressDelivery = await AsyncStorage.getItem(config.expressDeliveryCookies)
    if (isEmpty(expressDelivery)) this.props.getExpressDelivery(selectedKecamatan)
    else this.setState({ expressDelivery: JSON.parse(expressDelivery) })
  }

  setLocation = (location) => {
    this.setState({
      selectedProvince: location.selectedProvince,
      selectedCity: location.selectedCity,
      selectedKecamatan: location.selectedKecamatan
    })
    this.props.getExpressDelivery(location.selectedKecamatan)
  }

  render () {
    const { fromFilter } = this.props
    const { cityErr, kecamatanErr } = this.state
    return (
      <View>
        {(!fromFilter)
          ? this.renderCanDeliver()
          : <TouchableOpacity onPress={() => this.setModalVisible(true)} style={{ padding: 10, borderRadius: 3, borderWidth: 1, borderColor: '#E5E9F2', marginTop: 20 }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757885', fontSize: 16, textAlign: 'center' }}><Icon name='map-marker' size={20} style={{ marginRight: 10 }} />Ubah lokasi</Text>
          </TouchableOpacity>
        }
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ModalHeader>
              <Icon name='close-circle' size={24} color='white' />
              <TextModal>Pilih Daerah Pengiriman</TextModal>
              <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => this.setModalVisible(false)} />
            </ModalHeader>
            {this.renderInformation()}
            {this.renderModalLocationContent()}
            <Error>{cityErr || kecamatanErr}</Error>
            <TouchableOpacity onPress={() => this.pickerRef()} style={{ padding: 10 }}>
              <View style={styles.okButton}>
                <Text style={styles.okText}>Lanjutkan</Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  address: state.address,
  province: state.misc.province,
  city: state.misc.city,
  kecamatan: state.misc.kecamatan,
  expressDelivery: state.misc.expressDelivery,
  location: state.location
  // cart: state.cart
})

const mapDispatchToProps = (dispatch) => ({
  // TODO: Fix is_product_scanned to true value
  getProvince: () => (dispatch(MiscActions.miscProvinceRequest())),
  setProvince: (data) => dispatch(LocationActions.setProvinceRequest(data)),
  setCity: (data) => dispatch(LocationActions.setCityRequest(data)),
  setKecamatan: (data) => dispatch(LocationActions.setKecamatanRequest(data)),
  getExpressDelivery: (kecamatanId) => (dispatch(MiscActions.miscExpressDeliveryRequest(kecamatanId)))
})

export default WithContext(connect(mapStateToProps, mapDispatchToProps)(ShippingLocation))

const DelivBox = (props) => {
  return (
    <View style={{ backgroundColor: '#E5F7FF', padding: 10, marginTop: 4 }}>
      <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
        {props.children}
      </View>
    </View>
  )
}

const ModalHeader = styled.View`
flex-direction:row;
justify-content:space-between;
width: 100%;
border-bottom-width: 1px;
border-bottom-color: #D4DCE6;
padding: 15px;
`
const TextModal = styled.Text`
text-align:center;
flex-grow:1;
font-size:16px;
color: #757886;
font-family: Quicksand-Bold;
`
const InfoBoxPcp = styled.View`
  flex-direction: row;
  background-color: #e5f7ff;
  padding: 10px;
`
const Error = styled.Text`
  font-family: Quicksand-Regular;
  color: #F3251D;
  textAlign: center;
  font-size: 16;
`
