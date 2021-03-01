import React, { useState, useEffect, useReducer, useRef } from 'react'
import { Text, View, ScrollView, RefreshControl, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NumberWithCommas } from '../Utils/Misc'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// Component
import { Lottie, HeaderComponent, AddToCartButton, Snackbar, ContentSpec, InitStoreNewRetail, ShippingLocation } from '../Components'
import EditQuantity from '../Components/EditQuantity'

// Model
import { Logo } from '../Model/NewRetailImages'

// Context
import ContextProvider from '../Context/CustomContext'
import { initialStates as productDetailState, reducer as productDetailReducer } from '../FamilyState/reducers/productDetailReducers'
import { actions as productDetailActions } from '../FamilyState/actions/productDetailActions'

// Style
import styled from 'styled-components'

const { width } = Dimensions.get('screen')

const ProductDetailPageStore = (props) => {
  const { route, navigation, storeNewRetail } = props
  const [state, setState] = useState({
    itemData: route.params?.itemData ?? {},
    isScanned: route.params?.isScanned ?? false,
    activeVariant: {},
    quantity: '1',
    refreshing: false
  })
  const { activeVariant, quantity, refreshing, itemData, isScanned } = state

  const snackbar = useRef(null)
  const [familyState, familyDispatch] = useReducer(productDetailReducer, productDetailState)
  const actions = productDetailActions({ familyState, dispatch: familyDispatch })
  const { fetching, payload, err } = familyState

  const setParentState = data => setState({ ...state, ...data })

  useEffect(() => {
    const { storeNewRetail, user, navigation } = props
    const { itemData, isScanned } = state

    let sku = get(itemData, 'variants[0].sku', '')
    if (isEmpty(storeNewRetail.data) || isEmpty(user.user)) navigation.replace('StoreNewRetailValidation', { isScanned, itemData })
    actions.getProductDetail(sku, isScanned)

    return () => { actions.initProductDetailPage() }
  }, [])

  useEffect(() => {
    if (!fetching && err) snackbar.current.callWithAction(err, 'Coba lagi', () => refreshItem(), 0)
    if (!fetching && refreshing) setState({ ...state, refreshing: false })
  }, [fetching, err])

  const refreshItem = () => {
    setState({ ...state, refreshing: true, quantity: '1' })
    snackbar.current.forceClose()
    actions.getProductDetail(get(itemData, 'variants[0].sku'), isScanned)
  }

  const getContext = () => {
    return {
      quantity,
      activeVariant,
      navigation,
      route,
      actions,
      ...familyState,
      setParentState,
      callSnackbar: (message, type, duration, callback) => snackbar.current.call(message, type, duration, callback),
      callSnackbarWithAction: (message, actionText, callback, duration) => snackbar.current.callWithAction(message, actionText, callback, duration)
    }
  }

  useEffect(() => {
    if (!fetching && !isEmpty(payload)) {
      let multivariants = get(payload, 'multivariants') || {}
      let activevariant = get(payload, 'variants[0]') || {}
      // actions.getProductStock(activeVariant.sku)
      if (multivariants.attributes && multivariants.attributes.top) {
        activevariant = payload.variants[multivariants.default_selected_sku_index]
      }
      setState({ ...state, activeVariant: activevariant })
    }
  }, [payload])

  const renderPrice = () => {
    let productPrice = activeVariant.prices[0]
    if (productPrice.special_price === 0) {
      return (
        <View style={{ marginBottom: 10 }}>
          <PricePDP>Rp { NumberWithCommas(productPrice.price) }</PricePDP>
        </View>
      )
    } else {
      let discount = Math.floor(((productPrice.price - productPrice.special_price) / productPrice.price) * 100)
      return (
        <PriceProductPDP>
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PriceOldPDP>Rp { NumberWithCommas(productPrice.price) }</PriceOldPDP>
              <TextDiscountPDPS>{discount}%</TextDiscountPDPS>
            </View>
            <PricePDP>Rp { NumberWithCommas(productPrice.special_price) }</PricePDP>
          </View>
        </PriceProductPDP>
      )
    }
  }

  const renderItem = () => {
    if (isEmpty(payload) || !get(activeVariant, 'sku')) return <View style={{ flex: 1 }} />

    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshItem}
          />
        }>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', padding: 20, alignContent: 'center' }}>
          <Image source={Logo[(get(storeNewRetail, 'data.store_code', '')).charAt(0)]} style={{ height: width * 0.4, width: width * 0.4 }} />
          <View style={{ flex: 1, paddingLeft: 8 }}>
            <Text style={{ fontSize: 18, fontFamily: 'Quicksand-Bold', color: '#757886' }}>{payload.name || ''}</Text>
            {renderPrice()}
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>verified brand</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}><Icon name='check-circle-outline' size={16} style={{ marginTop: 3 }} /> {get(payload.brand, 'name', '')}</Text>
            <EditQuantity />
          </View>
        </View>
        <View style={{ elevation: 1, borderTopWidth: 1, borderTopColor: '#E0E6ED', padding: 12 }}>
          <ShippingLocation navigation={navigation} />
        </View>
        <View style={{ elevation: 1, borderTopWidth: 1, borderTopColor: '#E0E6ED' }}>
          <ContentSpec hideWeight />
        </View>
        <View style={{ elevation: 1, borderTopWidth: 1, borderTopColor: '#E0E6ED', justifyContent: 'center', padding: 20, alignContent: 'center' }}>
          <Text style={{ fontFamily: 'Quicksand-Bold', textAlign: 'center', fontSize: 20 }}>Cara Membeli Produk Ini</Text>
          <View style={{ borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 14, marginTop: 8 }}>
            <Image source={require('../assets/images/ace-new-retail/scan-ace-retail-online.webp')} style={{ width: width * 0.4, height: width * 0.4 / 480 * 280 }} />
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', flex: 1 }}>Scan barcode produk yang ingin Anda beli</Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 14, marginTop: 8 }}>
            <Image source={require('../assets/images/ace-new-retail/cart-ace-retail-online.webp')} style={{ width: width * 0.4, height: width * 0.4 / 500 * 280 }} />
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', flex: 1 }}>Masukkan produk ke dalam keranjang belanja, kemudian lakukan pembayaran melalui aplikasi Ruparupa</Text>
          </View>
          <View style={{ borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 14, marginTop: 8 }}>
            <Image source={require('../assets/images/ace-new-retail/bukti-ace-retail-online.webp')} style={{ width: width * 0.4, height: width * 0.4 / 480 * 280 }} />
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', flex: 1 }}>Ambil pesanan <Text style={{ fontWeight: '700' }}>{'\ndi Pick up zone\n'}</Text> pada toko yang telah Anda pilih</Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  return (
    <ContextProvider value={getContext()}>
      <InitStoreNewRetail checkOnly />
      <View style={{ flex: 1, backgroundColor: '#F9FAFC' }}>
        <HeaderComponent back search cartIcon pageType={'product-store'} navigation={navigation} />
        {(fetching)
          ? <Lottie />
          : renderItem()
        }
        {!(fetching || isEmpty(payload) || err || !get(activeVariant, 'sku')) && <AddToCartButton /> }
        <Snackbar ref={snackbar} actionHandler={() => navigation.navigate('WishlistPage')} />
      </View>
    </ContextProvider>
  )
}

const mapStateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  user: state.auth,
  misc: state.misc
})

export default connect(mapStateToProps, null)(ProductDetailPageStore)

const PricePDP = styled.Text`
  font-size: 18px;
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
const TextDiscountPDPS = styled.Text`
  paddingLeft: 6;
  font-size: 15px;
  color: #f3591f;
  text-align:center;
  font-family:Quicksand-Bold;
`
const PriceProductPDP = styled.View`
  margin-bottom: 5px;
  flex-direction: row;
  justify-content: space-between;
`
