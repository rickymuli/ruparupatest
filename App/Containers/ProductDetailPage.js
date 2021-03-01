import React, { useState, useEffect, useRef, useReducer, useMemo } from 'react'
import { View, ScrollView, RefreshControl, Text, TouchableOpacity, Platform, Dimensions } from 'react-native'
import { View as ViewAnimated } from 'react-native-animatable'
import Loading from '../Components/LoadingComponent'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import last from 'lodash/last'
import split from 'lodash/split'
import includes from 'lodash/includes'
import isObject from 'lodash/isObject'
import has from 'lodash/has'
import useEzFetch from '../Hooks/useEzFetch'

// Services
import { trackItemView } from '../Services/Emarsys'

// Redux
import { useSelector } from 'react-redux'

// Context
import ContextProvider from '../Context/CustomContext'
import { initialStates as productDetailState, reducer as productDetailReducer } from '../FamilyState/reducers/productDetailReducers'
import { actions as productDetailActions } from '../FamilyState/actions/productDetailActions'

// Component
import {
  Lottie, ProductDetailImage, ProductDetailContent, BankInstallment, CustomerServicePDP, AddToCartButton,
  ProductLastSeen, Snackbar, InitStoreNewRetail, ProductRecommendation
} from '../Components'
import { FlatList } from 'react-native-gesture-handler'

const { width } = Dimensions.get('screen')

const ProductDetailPage = ({ navigation, route }) => {
  const [familyState, familyDispatch] = useReducer(productDetailReducer, productDetailState)
  const actions = productDetailActions({ familyState, dispatch: familyDispatch })
  const { fetching, payload, err } = familyState

  const snackbar = useRef(null)
  const remoteConfig = useSelector(state => state.remoteConfig.data) || null
  const storeNewRetail = useSelector(state => state.storeNewRetail)
  const user = useSelector(state => state.auth)
  const cart = useSelector(state => state.cart)
  const [state, setState] = useState({
    activeVariant: {},
    itemData: route.params?.itemData ?? {},
    isScanned: route.params?.isScanned ?? false,
    quantity: '1',
    refresh: false,
    showEmarsys: true
  })
  const { activeVariant, quantity, refresh, itemData, isScanned } = state
  const [showEmarsysProductRecommendation, setShowEmarsysProductRecommendation] = useState(true)

  const { get: getBrandUrlKey, data: dataBrand } = useEzFetch()
  const getBrand = (brand) => getBrandUrlKey(`misc/brand-url-key?brand_id=${brand.brand_id}`)

  useEffect(() => {
    let isProductScanned = route.params?.isScanned ?? false
    let itemData = route.params?.itemData ?? {}
    let urlKey = isProductScanned ? get(itemData, 'variants[0].sku') : itemData.url_key
    actions.getProductDetail(urlKey, isProductScanned)
    let itemSku = get(itemData, 'variants[0].sku', '')
    if (itemSku) trackItemView(itemSku)

    return () => { actions.initProductDetailPage() }
  }, [])

  useEffect(() => {
    if (!fetching && !isEmpty(payload)) {
      let multivariants = get(payload, 'multivariants') || {}
      let activevariant = get(payload, 'variants[0]') || {}
      let brand = get(payload, 'brand') || {}
      // actions.getProductStock(activeVariant.sku)
      if (multivariants.attributes && multivariants.attributes.top) {
        activevariant = payload.variants[multivariants.default_selected_sku_index]
      }
      getBrand(brand)
      setState({ ...state, activeVariant: activevariant })
    }
  }, [payload])

  useEffect(() => {
    if (remoteConfig && has(remoteConfig, 'emarsys_pdp')) {
      let remoteConfigData = JSON.parse(remoteConfig['emarsys_pdp'].value)
      setShowEmarsysProductRecommendation(remoteConfigData.active)
    }
  }, [remoteConfig])

  useEffect(() => {
    if (!fetching && err) snackbar.current.callWithAction(err, 'Coba lagi', () => refreshItem(), 0)
    if (!fetching && refresh) setState({ ...state, refresh: false })
  }, [fetching, err])

  useEffect(() => {
    if (isScanned && activeVariant.status_retail === 10 && !isEmpty(storeNewRetail.data) && isEmpty(user.user)) navigation.replace('StoreNewRetailValidation', { itemData, isScanned })
  }, [storeNewRetail, user])

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

  const setParentState = data => setState({ ...state, ...data })

  const refreshItem = () => {
    setState({ ...state, refresh: true, quantity: '1' })
    snackbar.current.forceClose()

    const urlKey = (includes(itemData.url_key, 'ruparupa')) ? last(split(itemData.url_key, '/')) : itemData.url_key
    let param = isScanned ? get(itemData, 'variants[0].sku') : urlKey
    actions.getProductDetail(param, isScanned)
  }

  const urlKeyBrand = useMemo(() => get(dataBrand, '[0].url_key', ''), [dataBrand])

  const renderItem = () => {
    if (isEmpty(payload) || !get(activeVariant, 'sku')) {
      return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
        {isObject(payload) && <Text style={{ fontFamily: 'Quicksand-Medium' }}>Produk Tidak Ditemukan</Text>}
      </View>)
    }

    return (
      <ViewAnimated useNativeDriver animation='fadeInUpBig' easing='ease-out-expo' style={{ paddingVertical: 10 }}>
        <ProductDetailContent url_key={urlKeyBrand} />

      </ViewAnimated>
    )
  }

  const renderItemDetail = () => {
    if (!(fetching || isEmpty(payload) || err || !get(activeVariant, 'sku'))) {
      let prices = activeVariant.prices[0]
      const data = [
        <BankInstallment price={prices.special_price || prices.price} />,
        <CustomerServicePDP sku={activeVariant.sku} />,
        showEmarsysProductRecommendation && <ProductRecommendation activeVariant={activeVariant} />,
        <ProductLastSeen productDetail={payload} navigation={navigation} />
      ]
      return (
        <View>
          <FlatList
            data={data}
            initialNumToRender={1}
            updateCellsBatchingPeriod={1}
            maxToRenderPerBatch={1}
            keyExtractor={(_, index) => index}
            renderItem={({ item }) => item}
          />
        </View>
      )
    }
  }
  const renderHeader = () => {
    return (<View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, position: 'absolute', zIndex: 1, width, paddingTop: 30 }}>
      <TouchableOpacity style={{ borderRadius: 15, padding: 2 }} onPress={() => { navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Homepage') }}>
        <Icon name={'arrow-left'} size={30} color={'#757885'} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ borderRadius: 15, padding: 2, marginRight: 15 }} onPress={() => navigation.navigate('SearchPage')}>
          <Icon name={'magnify'} size={30} color={'#757885'} />
        </TouchableOpacity>
        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingRight: 5 }} onPress={() => navigation.navigate('CartPage')}>
          <AntDesign name={'shoppingcart'} size={30} color={'#757885'} />
          <View style={{ position: 'absolute', top: -3, right: 1, borderRadius: 100 / 2, backgroundColor: '#008CCF', justifyContent: 'center', alignItems: 'center', width: 16, height: 16 }}>
            {(cart.fetching)
              ? <Loading size='small' color='white' />
              : <Text style={{ fontFamily: 'Quicksand-Medium', color: '#ffffff', textAlign: 'center', fontSize: 12, marginBottom: (Platform.OS === 'ios' ? 0 : 2) }}>{(cart && cart.data !== null) ? cart.data.total_qty_item : '0'}</Text>
            }
          </View>
        </TouchableOpacity>
      </View>
    </View>)
  }

  return (
    <ContextProvider value={getContext()}>
      <View style={{ flex: 1, backgroundColor: '#F9FAFC' }}>
        <InitStoreNewRetail checkOnly />
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={refreshItem}
            />
          }>
          {renderHeader()}
          <ProductDetailImage activeVariant={activeVariant} itemData={itemData} sku={activeVariant.sku} navigation={navigation} payload={payload} />
          {!isEmpty(payload) && <TouchableOpacity style={{ borderRadius: 15, alignItems: 'center', padding: 10 }} onPress={() => navigation.navigate('RoomSimulation', { payload, activeVariant })}>
            <Text style={{ borderWidth: 1, borderRadius: 4, width: '80%', textAlign: 'center', paddingVertical: 8, borderColor: 'grey', color: 'grey' }}>Coba di ruangan saya</Text>
          </TouchableOpacity>}
          <View style={{ minHeight: 250 }}>
            {fetching ? <Lottie /> : renderItem()}
          </View>
          {renderItemDetail()}
        </ScrollView>
        {!(fetching || isEmpty(payload) || err || !get(activeVariant, 'sku')) &&
          <AddToCartButton itmData={route.params?.itmParameter ?? {}} navigation={navigation} route={route} algoliaTrackHit={route.params?.algoliaTrackHit ?? null} />
        }
        <Snackbar ref={snackbar} actionHandler={() => navigation.navigate('WishlistPage')} />
      </View>
    </ContextProvider>
  )
}

export default ProductDetailPage
