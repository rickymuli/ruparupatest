import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import config from '../../config.js'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import has from 'lodash/has'
import find from 'lodash/find'

import Modal from 'react-native-modal'
import { Navigate } from '../Services/NavigationService'
// import { trackWithProperties } from '../Services/MixPanel'
import { trackCart, trackEmptyCart } from '../Services/Emarsys'
// import Emarsys from 'react-native-emarsys-wrapper'
import analytics from '@react-native-firebase/analytics'

// redux
import CartActions from '../Redux/CartRedux'
import UserActions from '../Redux/UserRedux'

// util
import { NumberWithCommas, UpperCase } from '../Utils/Misc'

// Components
import Loading from '../Components/LoadingComponent'
import LottieComponent from '../Components/LottieComponent'
import Numbers from '../Components/NumberInput'

// Models
import { Logo } from '../Model/NewRetailImages'

// Styles
import styled from 'styled-components'

class ItemCart extends Component {
  constructor (props) {
    super(props)
    this.state = {
      items: [],
      cart: props.cart || { fetching: true },
      checkoutLink: '',
      user: '',
      refresh: false,
      removeItem: {},
      deletedItemIndex: null,
      deletedDetailIndex: null,
      fetching: props.route?.params?.AddToCartButton ?? false,
      modalVisible: false,
      err: get(props.cart, 'data.errors') || {}
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(prevState.cart, nextProps.cart) && !nextProps.cart.fetching) {
      let AddToCartButton = nextProps.route?.params?.AddToCartButton ?? false
      let fetching = AddToCartButton ? !has(nextProps.cart, 'data.items') : false
      return {
        cart: nextProps.cart,
        err: get(nextProps.cart, 'data.errors') || {},
        deletedItemIndex: null,
        deletedDetailIndex: null,
        fetching: fetching
      }
    }
    if (!isEmpty(nextProps.cart.data) && !isEmpty(nextProps.cart.data.token)) {
      return {
        checkoutLink: config.paymentURL + '?token=' + nextProps.cart.data.cart_id
      }
    }
    return null
  }

  componentDidMount () {
    if (!(this.props.route?.params?.AddToCartButton ?? false)) {
      this.props.cartRequest()
    }
    if (!isEmpty(this.state.cart.data) && !isEmpty(this.state.cart.data.items)) {
      this.setItems()
    } else {
      trackEmptyCart()
    }
  }

  isDigitalProduct = (storeCode, sku) => {
    // const skuDigitalStore = ['A300', 'H300']
    // const skuDigitalCode = ['70000094', '70000090'] // fixotp-multistaging
    const skuDigitalCode = ['70000216', '70000220']
    // return (includes(skuDigitalStore, storeCode) && includes(skuDigitalCode, sku)) ? true : false
    return !!(includes(skuDigitalCode, sku))
  }

  setItems = () => {
    const { cart } = this.state
    let arrItem = []
    if (cart.data.items) {
      cart.data.items.forEach(item => {
        let itemTemp = []
        if (item.details) {
          item.details.forEach(detail => {
            const isDigitalProduct = this.isDigitalProduct(item.shipping.store_code, detail.sku)
            let detailTemp = {
              sku: detail.sku,
              qty: detail.qty_ordered,
              isDigitalProduct
            }
            itemTemp.push(detailTemp)
          })
        }
        arrItem.push({ detail: itemTemp })
      })
      this.setState({ items: arrItem })
    }
    trackCart(cart.data.items)
  }

  async componentDidUpdate (prevProps, prevState) {
    const { refresh, cart } = this.state
    if (refresh) {
      this.setState({ refresh: false }, () => {
        if (!isEmpty(cart.data)) {
          this.setItems()
        }
      })
    }
    if (!isEmpty(cart.data) && cart.data.items !== null && !isEqual(this.props.cart.data, prevState.cart.data)) {
      this.setItems()
    }
  }

  refreshItems = () => {
    this.setState({ cart: { data: null }, refresh: true }, () => {
      this.props.cartRequest()
    })
  }

  changeQuantity = (itemData) => {
    let items = this.state.items
    // If the qty is on max or minimum, the process will not dispatch
    if (items[itemData.itemIndex].detail[itemData.detailIndex].qty !== Number(itemData.qty)) {
      items[itemData.itemIndex].detail[itemData.detailIndex] = {
        sku: itemData.sku,
        qty: Number(itemData.qty)
      }
      this.setState({ items })
      const data = {
        items: [
          {
            sku: itemData.sku,
            qty_ordered: Number(itemData.qty)
          }
        ]
      }
      // dispatch here
      this.props.cartUpdateRequest(data)
    }
  }

  onRemoveItem = (addToWishlist) => {
    const { item, itemIndex, detailIndex } = this.state.removeItem
    const { user, cartDeleteItemRequest, toggleWishlist, navigation } = this.props
    // Firebase Analytic remove_from_cart
    let analyticData = {
      currency: 'IDR',
      items: [{
        item_id: item.sku,
        item_name: item.name,
        item_brand: item.brand,
        item_category: item.category.name,
        price: item.prices.selling_price
      }],
      value: item.subtotal
    }
    analytics().logEvent('remove_from_cart', analyticData)
    // we just need sku to delete
    const data = {
      items: [
        {
          sku: item.sku
        }
      ]
    }
    this.setState({
      deletedItemIndex: itemIndex,
      deletedDetailIndex: detailIndex,
      modalVisible: false
    }, () => {
      if (addToWishlist) {
        if (user) toggleWishlist({ method: 'add', sku: item.sku })
        else return navigation.navigate('Homepage', {}, Navigate({ routeName: 'Profil' }))
      }
      cartDeleteItemRequest(data)
    })
  }

  goToPDP = (item, image) => {
    if (!has(item, 'is_extended') || item.is_extended === 10) {
      let itmParameter = {
        itm_source: 'cart-page',
        itm_campaign: 'cart'
      }
      // trackWithProperties('Data product', item)
      this.props.navigation.push('ProductDetailPage', {
        itemData: {
          url_key: item.url_key
        },
        itmParameter,
        images: [{ image_url: image.uri }]
      })
    }
  }

  renderEmptyCart = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: 20 }}>
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 18, textAlign: 'center', color: '#757886', fontFamily: 'Quicksand-Medium' }}>Keranjang Anda masih kosong</Text>
        </View>
        <View style={{ marginBottom: 10 }}>
          <Text style={{ fontSize: 14, color: '#757886', textAlign: 'center', fontFamily: 'Quicksand-Regular', lineHeight: 30 }}>Temukan berbagai produk unggulan kami dan nikmati penawaran terbaik lainnya!</Text>
        </View>
      </View>
    )
  }

  renderFreeItem = (item, index) => {
    const { cart } = this.state
    const { storeNewRetail } = this.props
    const { width, height } = Dimensions.get('screen')
    let image = item.primary_image_url
      ? { uri: `${config.imageRR}w_360,h_360,f_auto,q_auto/${item.primary_image_url}` }
      : (get(item, 'is_extended') === 0)
        ? Logo[(get(storeNewRetail, 'data.store_code', '')).charAt(0)]
        : require('../assets/images/image-on-progress.webp')
    return (
      <TouchableOpacity onPress={() => this.goToPDP(item, image)} style={{ paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#E5E9F2' }} key={`cart free items ${index}`}>
        {(cart.fetching)
          ? <Loading />
          : <View style={{ flexDirection: 'row', paddingTop: 30 }}>
            <View>
              <Image
                source={image}
                style={{ width: width * 0.2, height: height * 0.1 }}
              />
            </View>
            <View style={{ flexDirection: 'column', paddingLeft: 2 }}>
              {!isEmpty(item.name) &&
                <View style={{ width: width * 0.55, flex: 1 }}>
                  <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757886' }}>{UpperCase(item.name)}</Text>
                </View>
              }
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'column' }}>
                  <Text style={{ fontSize: 12, color: '#008ED1', fontFamily: 'Quicksand-Bold', marginBottom: 5 }}>{item.qty_ordered} x Rp 0</Text>
                  <View style={{ paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#238B22', borderRadius: 3 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Bold', alignItems: 'center', color: '#ffffff' }}>GRATIS</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        }
      </TouchableOpacity>
    )
  }

  renderCart = (item, itemIndex, detailIndex) => {
    const { cart, items, deletedDetailIndex, deletedItemIndex, err } = this.state
    const { width, height } = Dimensions.get('screen')
    if (items.length !== cart.data.items.length || cart.fetching) {
      return (
        <Loading key={`loading ${item.id}`} />
      )
    } else {
      let currItem = items[itemIndex].detail[detailIndex]
      let errItem
      let errData = err.data || {}
      if (errData.type === 'items') {
        errItem = find(errData.items, ['sku', currItem.sku])
      }
      if (isEmpty(currItem)) {
        return (
          <Loading key={`loading empty ${itemIndex}${item.id}`} />
        )
      } else {
        let image = item.primary_image_url
          ? { uri: `${config.imageRR}w_170,h_170,f_auto,q_auto/${item.primary_image_url}` }
          : (get(item, 'is_extended') === 0)
            ? require('../assets/images/new-retail/logo-ace.webp')
            : require('../assets/images/image-on-progress.webp')
        return (
          <View style={{ flexDirection: 'column' }} key={`loading empty ${itemIndex}${currItem.sku}`}>
            {errItem && <Error>{errItem.message}</Error>}
            <View style={{ paddingBottom: 14, paddingTop: 6, borderBottomWidth: 1, borderBottomColor: '#E5E9F2', flex: 1 }} key={`cart item detail ${itemIndex} ${detailIndex}`}>
              <TouchableOpacity onPress={() => this.goToPDP(item, image)} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View>
                  <Image
                    source={image}
                    style={{ width: width * 0.2, height: height * 0.1 }}
                  />
                </View>
                <View style={{ flexDirection: 'column', flexGrow: 2, paddingLeft: 2 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    {!isEmpty(item.name) &&
                      <View style={{ width: width * 0.55, flex: 1 }}>
                        <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757886' }}>{UpperCase(item.name)}</Text>
                      </View>
                    }
                    {(itemIndex === deletedItemIndex && detailIndex === deletedDetailIndex)
                      ? <Loading fromCartDelete />
                      : <TouchableOpacity
                        style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => this.setState({ modalVisible: true, removeItem: { item, itemIndex, detailIndex } })}
                      >
                        <Icon name='delete' size={18} color='#757886' />
                      </TouchableOpacity>
                    }
                  </View>
                  <View style={{ alignSelf: 'flex-start', flexDirection: 'column' }}>
                    {(item.attributes && item.attributes.length > 0)
                      ? item.attributes.map((attribute, index) => (
                        <View key={`attribute ${index}`}>
                          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{attribute.attribute_label}: {attribute.attribute_value}</Text>
                        </View>
                      ))
                      : null
                    }
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'column' }}>
                      {item.prices && (item.prices.normal_price - item.prices.selling_price !== 0)
                        ? <View style={{ flexDirection: 'row' }}>
                          <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12, color: '#757886', textDecorationLine: 'line-through', textDecorationColor: 'red' }}>Rp {NumberWithCommas(item.prices.normal_price)}</Text>
                          <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12, color: 'red' }}> ({Math.floor((item.prices.normal_price - item.prices.selling_price) / item.prices.normal_price * 100)}%)</Text>
                        </View>
                        : null
                      }
                      <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 12, color: '#008ED1' }}>Rp {NumberWithCommas(item.subtotal)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <Numbers
                        fromCart
                        changeQuantity={this.changeQuantity.bind(this)}
                        sku={currItem.sku}
                        quantity={currItem.qty}
                        maxStock={item.max_qty}
                        itemIndex={itemIndex}
                        detailIndex={detailIndex}
                        isDigitalProduct={currItem.isDigitalProduct}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {(item.free_items.length > 0) ? item.free_items.map((freeItem, index) => this.renderFreeItem(freeItem, index)) : null}
          </View>
        )
      }
    }
  }

  renderDeliveryMethod (item, index) {
    const { sender } = item
    const isDigitalProduct = this.isDigitalProduct(item.shipping.store_code, item.details[0].sku)
    let methodDelivery; let store = ''
    if (item.shipping.delivery_method === 'pickup') {
      if (isDigitalProduct) {
        methodDelivery = 'Khusus produk digital, tidak perlu diambil'
      } else {
        methodDelivery = 'Diambil oleh'
        store = 'Anda'
      }
    } else {
      methodDelivery = 'Dikirim Oleh'
      store = sender ? UpperCase(sender.toLowerCase()) : ''
    }
    return (
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 16 }}>{methodDelivery} </Text>
        {(store === 'Ruparupa')
          ? <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 16 }}>rup<Text style={{ color: '#FF7F45' }}>a</Text>rup<Text style={{ color: '#00A6F5' }}>a</Text></Text>
          : <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 16, fontWeight: 'bold' }}>{store}</Text>
        }
      </View>
    )
  }

  setModalVisible (modalVisible) {
    this.setState({ modalVisible })
  }

  render () {
    const { cart, refresh, fetching, modalVisible, err, removeItem } = this.state
    const items = has(cart, 'data.items') ? cart.data.items : []
    return (
      <View >
        {(get(err, 'data.type') === 'global') && <Error>{err.message}</Error>}
        {(refresh || cart.fetching || fetching)
          ? <LottieComponent />
          : (isEmpty(items))
            ? (this.renderEmptyCart())
            : <FlatList
              data={items}
              refreshing={refresh}
              onRefresh={() => this.refreshItems()}
              renderItem={({ item, index }) => (
                <View style={{ paddingHorizontal: 20, paddingVertical: 12, flexDirection: 'column' }}>
                  {this.renderDeliveryMethod(item, index)}
                  {item.details && item.details.map((detail, detailIndex) => this.renderCart(detail, index, detailIndex))}
                </View>
              )}
              keyExtractor={(items, index) => (`cart items ${index}`)}
            />
        }
        <Modal
          backdropTransitionOutTiming={1}
          isVisible={modalVisible}
          animationIn={'slideInRight'}
          animationOut={'slideOutRight'}
          onBackdropPress={() => this.setModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', padding: 18, justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 16 }}>Hapus barang dari keranjang ?</Text>
            {(get(removeItem, 'item.is_extended') !== 0) && <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 14, textAlign: 'center' }}>Coba pindahkan ke Wishlist, siapa tahu nanti kamu butuh barang ini.</Text>}
            {(get(removeItem, 'item.is_extended') !== 0) &&
              <TouchableOpacity onPress={() => this.onRemoveItem('addWishlist')} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Pindahkan ke Wishlist</Text>
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={() => this.onRemoveItem()} style={{ alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>Hapus barang</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  cart: state.cart,
  user: state.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  cartRequest: () => dispatch(CartActions.cartRequest()),
  cartUpdateRequest: (data) => dispatch(CartActions.cartUpdateRequest(data)),
  cartDeleteItemRequest: (data) => dispatch(CartActions.cartDeleteItemRequest(data)),
  toggleWishlist: (data) => dispatch(UserActions.userToggleWishlistRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemCart)

const Error = styled.Text`
  font-family: Quicksand-Regular;
  color: #F3251D;
  textAlign: center;
  font-size: 16;
`
