import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import includes from 'lodash/includes'

import Octicons from 'react-native-vector-icons/Octicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import {
  Freshchat,
  ConversationOptions
} from 'react-native-freshchat-sdk'

// Context
import { WithContext } from '../Context/CustomContext'

// Component
import { Lottie, EasyModal, DeliveryOption } from './'

// Styles
import { PrimaryTextMedium } from '../Styles'
import styles from '../Containers/Styles/ProductDetailPageStyles'

class AddToCartPdp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      buttonQrScan: false,
      isScanned: this.props.route?.params?.isScanned ?? false,
      // isScanned: this.props.navigation.getParam('isScanned', false),
      imageModal: [
        {
          image: require('../assets/images/ace-new-retail/scan-ace-retail-online.webp'),
          text: 'Scan kode QR toko'
        },
        {
          image: require('../assets/images/ace-new-retail/cart-ace-retail-online.webp'),
          text: 'Masukkan produk ke keranjang dan lakukan pembayaran melalui aplikasi Ruparupa'
        },
        {
          image: require('../assets/images/ace-new-retail/bukti-ace-retail-online.webp'),
          text: 'Berikan bukti pembayaran kepada CS dan pilih metode pickup atau kirim'
        }
      ]
    }
  }

  componentDidMount () {
    const { activeVariant, stock, data, fetchingStock } = this.props
    const { isScanned } = this.state
    if (isEmpty(stock) && !fetchingStock && !has(data, 'deliveryMethod')) {
      this.props.actions.getProductStock(activeVariant.sku, isScanned)
      // fetchProductStock(activeVariant.sku, isScanned)
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { activeVariant } = this.props
    const { isScanned } = this.state

    if (prevProps.activeVariant !== activeVariant) {
      this.props.actions.getProductStock(activeVariant.sku, isScanned)
      // fetchProductStock(activeVariant.sku, isScanned)
    }
  }

  startFreshchat () {
    var conversationOptions = new ConversationOptions()
    // conversationOptions.tags = ["premium"];
    // conversationOptions.filteredViewTitle = "Premium Support";
    Freshchat.showConversations(conversationOptions)
  }

  renderButton = (stockByDC, canDelivery) => {
    const { payload, stock, maxStock } = this.props
    // const { payload, stock, maxStock } = this.props.productDetail
    const variant = this.props.activeVariant
    const statusPreorder = (variant && variant.status_preorder) ? variant.status_preorder : 0

    // Set Text Button
    let stockQuantity = 0
    if (maxStock) stockQuantity = maxStock.max_stock
    if (payload.is_extended === 0 && stock && stock.location && stock.location.length > 0) stockQuantity = stock.location[0].qty

    let text
    if (maxStock && stockQuantity > 0 && variant.sku !== 'GWPHUROM') {
      text = 'Tambah ke keranjang'
      if (statusPreorder === 10) text = 'Pre order'

      if ((canDelivery.can_pickup && !canDelivery.can_delivery && stockByDC)) {
        return (
          <View style={styles.buttonDisabledPickup}>
            <PrimaryTextMedium style={{ textAlign: 'center' }}>Stok Habis</PrimaryTextMedium>
          </View>
        )
      }
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingBottom: 8 }}>
          <TouchableOpacity onPress={() => this.startFreshchat()} style={{ paddingVertical: 10, paddingHorizontal: 12, marginRight: 2, backgroundColor: '#F26525', borderRadius: 2 }}>
            <AntDesign name='message1' color='#FFFFFF' size={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.modal.setModal(true)} style={{ backgroundColor: '#F26525', borderRadius: 2, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.buttonText}>{text}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      text = (variant.sku === 'GWPHUROM') ? 'Produk tidak tersedia' : (variant.label === 'New Arrivals') ? 'Coming Soon' : 'Stok Habis'
      return (
        <View style={styles.buttonDisabled}>
          <PrimaryTextMedium style={{ textAlign: 'center' }}>{text}</PrimaryTextMedium>
        </View>
      )
    }
  }

  renderPagination (index, total) {
    let indexItem = index + 1
    if (indexItem === total && !this.state.buttonQrScan) this.setState({ buttonQrScan: true })
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Octicons name={'primitive-dot'} size={20} color={indexItem === 1 ? '#008CCF' : '#E5E9F2'} style={{ marginHorizontal: 4 }} />
        <Octicons name={'primitive-dot'} size={20} color={indexItem === 2 ? '#008CCF' : '#E5E9F2'} style={{ marginHorizontal: 4 }} />
        <Octicons name={'primitive-dot'} size={20} color={indexItem === 3 ? '#008CCF' : '#E5E9F2'} style={{ marginHorizontal: 4 }} />
      </View>
    )
  }

  render () {
    const { fetchingCart, route, fetchingMaxStock, maxStock, stock, canDelivery } = this.props
    // const { fetchingMaxStock, maxStock, stock, canDelivery } = productDetail
    let stockByDC
    if (stock && stock.location && stock.location.length > 0) {
      stock.location.filter((location) => {
        if (includes(['', 'DC'], location.pickup_code)) {
          stockByDC = true
        } else {
          stockByDC = false
        }
      })
    }
    if (isEmpty(maxStock) || fetchingMaxStock || fetchingCart || (!isEmpty(maxStock.max_stock) && maxStock.max_stock === 0 && typeof stockByDC === 'undefined') || isEmpty(canDelivery)) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.buttonDisabled}>
            <Lottie addToCart style={{ height: 30, width: 30 }} />
          </View>
        </View>
      )
    }
    return (
      <View style={{ padding: 2, justifyContent: 'center', alignItems: 'center', shadowRadius: 2, shadowOffset: { width: 0, height: -3 }, shadowColor: '#000000', elevation: 4 }}>
        {this.renderButton(stockByDC, canDelivery)}
        <EasyModal ref={ref => { this.modal = ref }} size={72} close title={'Pilih Metode'} >
          <DeliveryOption onClickBuyNow={(param) => this.modal.setModal(false, () => this.props.onClickBuyNow(param))} route={route} />
        </EasyModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  fetchingCart: state.cart.fetching,
  storeNewRetail: state.storeNewRetail
})

const dispatchToProps = (dispatch) => ({
})

export default WithContext(connect(mapStateToProps, dispatchToProps)(AddToCartPdp))
