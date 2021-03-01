import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, Dimensions, Image, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import startsWith from 'lodash/startsWith'
import includes from 'lodash/includes'

// contex
import { WithContext } from '../Context/CustomContext'

// Styles
import styles from '../Containers/Styles/ProductDetailPageStyles'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { fonts, PrimaryText } from '../Styles'

import { PickupModal } from './'

const { width, height } = Dimensions.get('screen')
export class DeliveryOption extends Component {
  constructor (props) {
    super(props)
    this.state = {
      delivery: true,
      modalVisible: false,
      pickupData: {},
      isScanned: props.route?.params?.isScanned ?? false,
      noSearch: false
    }
  }

  componentDidMount () {
    const { storeNewRetail, activeVariant, quantity, stock } = this.props
    const { isScanned } = this.state
    if (get(storeNewRetail.data, 'store_code') && isScanned === true && !isEmpty(stock.location[0])) {
      let pickupData = {
        activeVariant,
        quantity,
        sku: get(activeVariant, 'sku'),
        deliveryMethod: 'pickup',
        storeName: stock.location[0].store.name,
        storeCode: stock.location[0].store.store_code,
        pickupCode: stock.location[0].pickup_code,
        distance: '0'
      }
      this.setState({ pickupData, delivery: false, noSearch: true })
    }
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  setPickup (pickupData) {
    this.setState({ pickupData, delivery: false })
  }

  pickPickup () {
    const { pickupData } = this.state
    if (pickupData.storeName) this.setState({ delivery: false })
    else this.setModalVisible(true)
  }

  onClickBuy () {
    const { onClickBuyNow } = this.props
    const { pickupData, delivery } = this.state
    if (delivery)onClickBuyNow()
    else onClickBuyNow(pickupData)
  }

  render () {
    const { delivery, pickupData, noSearch, modalVisible } = this.state
    const { activeVariant, stock, quantity, canDelivery } = this.props
    // const { canDelivery } = this.props.productDetail

    let pickupColor = !delivery ? '#0072A9' : '#757886'
    let deliveryColor = delivery ? '#0072A9' : '#757886'
    let stockFiltered = []
    let newQuantity = activeVariant.label.toLowerCase() === 'buy 1 get 1' ? quantity * 2 : quantity
    if (stock && stock.location && stock.location.length > 0) {
      stockFiltered = stock.location.filter((location) => {
        if (!includes(['', 'DC'], location.pickup_code)) {
          return Number(location.qty) >= Number(newQuantity)
        }
      })
    }

    // noted: can delivery not working at MP product so we check if product using prefix M
    let mpProduct = startsWith(get(stockFiltered, '[0].pickup_code'), 'M') /// (!stock || (stock && stock.global_stock_qty <= 0)) || )
    let canDeliv = (canDelivery && (canDelivery.can_delivery || canDelivery.can_delivery_gosend || canDelivery.can_delivery_ownfleet)) || mpProduct
    const pickupOptionAvailable = (canDelivery && canDelivery.can_pickup)
    // noted: check if product is extended or not, if not then check the stock from specific store location
    // let storeNewRetailValidation = (payload.is_extended === 10 || (stock.location.length > 0 && stock.location[0].qty > 0))
    return (
      <View style={{ padding: 10, justifyContent: 'flex-start', height: height * 0.50 }}>
        {(((stock && stock.location && stock.global_stock_qty !== 0 && stock.location.length >= 1 && stock.location[0].pickup_code !== 'DC') && pickupOptionAvailable && !mpProduct && (get(stock, 'location[0].qty', 0) > 0))) &&
        <View style={{ borderWidth: 1, borderColor: pickupColor, padding: 15, borderRadius: 5, marginBottom: 14 }}>
          <TouchableOpacity onPress={() => this.pickPickup()} style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ height: width * 0.06, width: width * 0.06, borderRadius: width * 0.06 / 2, padding: 4, borderWidth: 1, borderColor: pickupColor, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
              {!delivery && <View style={{ height: width * 0.04, width: width * 0.04, borderRadius: width * 0.04 / 2, backgroundColor: pickupColor }} /> }
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <Image source={require('../assets/images/ambil-sendiri.webp')} style={{ height: width * 0.16, width: width * 0.24 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, textAlign: 'left' }}>Pengambilan pesanan di toko: </Text>
              {!isEmpty(pickupData.storeName) && <Text style={{ fontFamily: fonts.bold, textAlign: 'left' }}>{pickupData.storeName}</Text>}
              {!isEmpty(pickupData.distance) &&
                <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <EvilIcons name={'location'} size={16} />
                  <Text style={{ fontFamily: fonts.regular, paddingLeft: 2, fontSize: 16 }}>{pickupData.distance} km</Text>
                </View>
              }
            </View>
          </TouchableOpacity>
          {!noSearch &&
          <View>
            <TouchableOpacity onPress={() => this.setModalVisible(true)} style={{ borderWidth: 1, borderRadius: 3, padding: 8, marginTop: 10, flexDirection: 'row', borderColor: '#757886', alignItems: 'center' }}>
              <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='magnify' color={'#757885'} />
              <PrimaryText style={{ fontSize: 14 }}> Pilih lokasi toko yang Anda inginkan </PrimaryText>
            </TouchableOpacity>
            <View style={{ padding: 5, backgroundColor: '#E5F7FF', marginTop: 5 }}>
              <Text style={{ fontFamily: fonts.regular, fontSize: 12 }}>
                <Icon name='information-outline' color='#757885' size={12} /> Pesanan dapat diambil setelah email konfirmasi dikirimkan.
              </Text>
            </View>
          </View>
          }
        </View>
        }
        {(canDeliv) &&
        <TouchableOpacity onPress={() => this.setState({ delivery: true })} style={{ borderWidth: 1, borderColor: deliveryColor, padding: 15, borderRadius: 5, marginBottom: 14 }}>
          <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <View style={{ height: width * 0.06, width: width * 0.06, borderRadius: width * 0.06 / 2, padding: 4, borderWidth: 1, borderColor: deliveryColor, alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
              {delivery && <View style={{ height: width * 0.04, width: width * 0.04, borderRadius: width * 0.04 / 2, backgroundColor: '#0072A9' }} />}
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              <Image source={require('../assets/images/dikirim.webp')} style={{ height: width * 0.16, width: width * 0.24 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.medium, textAlign: 'left' }}>Pesanan akan dikirim ke alamat Anda</Text>
            </View>
          </View>
        </TouchableOpacity>
        }
        {canDeliv || !isEmpty(pickupData)
          ? <TouchableOpacity onPress={() => this.onClickBuy()} style={[styles.button, { marginBottom: 10 }]}>
            <Text style={styles.buttonText}>{`Pilih`}</Text>
          </TouchableOpacity>
          : <View onPress={() => this.onClickBuy()} style={[styles.button, { marginBottom: 10, backgroundColor: '#F0F2F7' }]}>
            <Text style={[styles.buttonText, { color: '#757885' }]}>{`Pilih`}</Text>
          </View>
        }
        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => { this.setModalVisible(false) }}
          style={{ backgroundColor: '#000', height, width }}
        >
          <PickupModal {...this.props} stockFiltered={stockFiltered} setPickup={this.setPickup.bind(this)} setModalVisible={this.setModalVisible.bind(this)} />
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail
})

export default WithContext(connect(mapStateToProps, null)(DeliveryOption))
