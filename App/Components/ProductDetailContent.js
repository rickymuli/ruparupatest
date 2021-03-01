import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Linking, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NumberWithCommas, UpperCase } from '../Utils/Misc'
import config from '../../config.js'
import { connect } from 'react-redux'
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import isEmpty from 'lodash/isEmpty'
import startsWith from 'lodash/startsWith'
import { WithContext } from '../Context/CustomContext'

// Styles
import styles from './Styles/PDPStyles'
import styled from 'styled-components'
import { PrimaryText, PrimaryTextBold } from '../Styles'

// Components
import VoucherPDP from './VoucherPDP'
import ShippingLocation from '../Components/ShippingLocation'
import CountDownFlashSale from '../Components/CountDownFlashSale'
import MultivarianPick from '../Components/MultivarianPick'
import ContentSpec from '../Components/ContentSpec'
import BreadCrumb from '../Components/BreadCrumb'
import EditQuantity from '../Components/EditQuantity'

const { width } = Dimensions.get('screen')
class ProductDetailContent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      ownFleet: ''
    }
  }

  componentDidUpdate (prevProps) {
    const { fetchingStock, stock } = this.props
    if (prevProps.stock !== stock && !fetchingStock) {
      this.checkOwnFleet()
    }
  }

  renderPrice = () => {
    const { activeVariant } = this.props
    let productPrice = activeVariant.prices[0]
    if (productPrice.special_price === 0) {
      return (
        <View style={{ marginBottom: 10 }}>
          <PricePDP>Rp {NumberWithCommas(productPrice.price)}</PricePDP>
        </View>
      )
    } else {
      let discount = Math.floor(((productPrice.price - productPrice.special_price) / productPrice.price) * 100)
      return (
        <PriceProductPDP>
          <View style={{ flexDirection: 'column' }}>
            <PriceOldPDP>Rp {NumberWithCommas(productPrice.price)}</PriceOldPDP>
            <PricePDP>Rp {NumberWithCommas(productPrice.special_price)}</PricePDP>
          </View>
          <DiscountContainerPDP>
            <TextDiscountPDP>{discount}%</TextDiscountPDP>
          </DiscountContainerPDP>
        </PriceProductPDP>
      )
    }
  }

  renderTimerFlashSale = () => {
    const { events } = this.props.payload
    if (isEmpty(events)) return null
    else if (events[0].url_key !== 'flash-sale') return null
    return (
      <View style={{ backgroundColor: '#F3251D', padding: 10, marginBottom: 15, alignItems: 'center' }}>
        <PrimaryText style={{ color: 'white', textAlign: 'center' }}>Promo berakhir</PrimaryText>
        <View style={{ marginVertical: 15 }}>
          <CountDownFlashSale event={events[0]} fromPdp />
        </View>
      </View>
    )
  }

  checkSupplierByStock = () => {
    const { stock } = this.props
    let supplier = ''
    stock && forEach(stock.location, (v) => {
      if (startsWith(v.store.store_code, 'A')) supplier = 'AHI'
      else if (startsWith(v.store.store_code, 'H')) supplier = 'HCI'
    })
    return supplier
  }

  checkOwnFleet = () => {
    const { payload: product, canDelivery = {} } = this.props
    // const { supplierByStock } = this.state
    /**
    * dimensi berat >= 50kg
    * parameter dimensi salah satunya >= 100
    * manual flag ownfleet from elastic
    * packaging_uom CM MM M
    * we need to convert packaging_uom to CM
    */
    let ownFleet = this.checkSupplierByStock()
    let packagingLength = product.packaging_length
    let packagingWidth = product.packaging_width
    let packagingHeight = product.packaging_height
    switch (product.packaging_uom) {
      case 'MM':
        packagingLength = packagingLength / 10
        packagingWidth = packagingWidth / 10
        packagingHeight = packagingHeight / 10
        break
      case 'M':
        packagingLength = packagingLength * 100
        packagingWidth = packagingWidth * 100
        packagingHeight = packagingHeight * 100
        break
    }
    if (!(packagingLength >= 100 || packagingWidth >= 100 || packagingHeight >= 100 || parseInt(product.weight) >= 27 || get(canDelivery, 'can_delivery_ownfleet'))) {
      ownFleet = ''
    }
    this.setState({ ownFleet })
  }

  renderStoreDetail () {
    const { ownFleet, kecamatan } = this.state
    const { payload, route, navigation } = this.props
    return (
      <>
        {this.renderPrice()}
        {!isEmpty(payload.name) && <PrimaryTextBold style={{ fontSize: 20, marginTop: 10 }}>{UpperCase(payload.name.toLowerCase())}</PrimaryTextBold>}
        {!isEmpty(payload.voucher_information) && <VoucherPDP navigation={navigation} voucherInformation={payload.voucher_information} />}
        <EditQuantity kecamatan={kecamatan} ownFleet={ownFleet} route={route} />
        <MultivarianPick />
      </>
    )
  }

  goToPCP = (urlKey) => {
    let itemDetail = {
      data: {
        url_key: urlKey
      },
      search: ''
    }
    this.props.navigation.navigate('ProductCataloguePage', {
      itemDetail
    })
  }

  render () {
    const { ownFleet, kecamatan } = this.state
    const { payload, activeVariant, nonListingProduct, route, navigation } = this.props
    // let pickupOnly = (!isEmpty(canDelivery) && !productDetail.fetchingCanDelivery && !canDelivery.can_delivery && has(productDetail, 'maxStock.max_stock') && productDetail.maxStock.max_stock !== 0)
    return (
      <View>
        <View style={styles.contentContainerTop}>
          {nonListingProduct
            ? this.renderStoreDetail()
            : <>
              <BreadCrumb breadcrumb={payload.breadcrumb} navigation={navigation} />
              {!isEmpty(payload.name) && <PrimaryTextBold style={{ fontSize: 20, marginTop: 10 }}>{UpperCase(payload.name.toLowerCase())}</PrimaryTextBold>}
              {!isEmpty(payload.voucher_information) && <VoucherPDP navigation={navigation} voucherInformation={payload.voucher_information} />}
              {this.renderPrice()}
              {this.renderTimerFlashSale()}
              {activeVariant.is_limited_stock &&
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                  <Text style={{ color: '#FF3B33', fontFamily: 'Quicksand-Regular', fontSize: 16 }}><Icon name='information-outline' color='#FF3B33' size={16} /> Stok terbatas!</Text>
                </View>
              }
              {!isEmpty(activeVariant.label) &&
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                  <Text style={{ color: '#FF3B33', fontFamily: 'Quicksand-Regular', fontSize: 16 }}><Icon name='information-outline' color='#FF3B33' size={16} /> {activeVariant.label}</Text>
                </View>
              }
              <EditQuantity kecamatan={kecamatan} ownFleet={ownFleet} route={route} isLowestPrice={payload.is_lowest_price} />
              <MultivarianPick />
              <ShippingLocation ownFleet={ownFleet} navigation={navigation} route={route} payload={payload} productDetail={payload} />
              <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                <View style={{ flexDirection: 'column', paddingRight: 20 }}>
                  <PrimaryText>verified brand</PrimaryText>
                  <TouchableOpacity onPress={() => this.goToPCP(this.props.url_key)} style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <PrimaryText><Icon name='check-circle-outline' size={16} /></PrimaryText>
                    <PrimaryText style={{ textDecorationLine: 'underline', marginLeft: 3 }}>{payload.brand.name}</PrimaryText>
                  </TouchableOpacity>
                </View>
                {(!isEmpty(payload.supplier.dikirim_oleh)) &&
                  <View style={{ flexDirection: 'column' }}>
                    <PrimaryText>dikirim oleh</PrimaryText>
                    <PrimaryText><Icon name='cube-send' size={18} style={{ marginTop: 5 }} /> {payload.supplier.dikirim_oleh}</PrimaryText>
                  </View>
                }
              </View>
            </>
          }
        </View>
        <ContentSpec />
        <TouchableOpacity onPress={() => { Linking.openURL(config.returnURL) }}>
          <View style={{ alignItems: 'center', backgroundColor: '#E5F7FF' }}>
            <Image source={require('../assets/images/mobile-app-return-pdp.webp')} style={{ width, height: (width / 972) * 487 }} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  promo: state.promo
})

export default WithContext(connect(mapStateToProps)(ProductDetailContent))

const PricePDP = styled.Text`
  font-size: 20px;
  line-height: 28px;
  color: #008ed1;
  font-family:Quicksand-Bold;
`

const PriceOldPDP = styled.Text`
color: #757886;
position: relative;
font-size:14px;
text-decoration: line-through;
text-decoration-color: #f26524;
font-family:Quicksand-Regular;
`

const DiscountContainerPDP = styled.View`
  width: 50px;
  height: 50px;
  background: #f3591f;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
`
const TextDiscountPDP = styled.Text`
  font-size: 16px;
  color: white;
  text-align:center;
  font-family:Quicksand-Bold;
`

const PriceProductPDP = styled.View`
  margin-bottom: 5px;
  flex-direction: row;
  justify-content: space-between;
`
