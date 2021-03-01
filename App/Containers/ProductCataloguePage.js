import React, { useEffect, useRef, useMemo, useState } from 'react'
import { View, Text, FlatList, Platform, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native'
import { View as ViewAnimated } from 'react-native-animatable'
import isEmpty from 'lodash/isEmpty'
import some from 'lodash/some'
import pick from 'lodash/pick'
import get from 'lodash/get'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ContextProvider from '../Context/CustomContext'

import { ContainerNoPadding, HeaderPills } from '../Styles/StyledComponents'

import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ItemCard from '../Components/ItemCard'
import Lottie from '../Components/LottieComponent'
import Snackbar from '../Components/SnackbarComponent'
import CMSBlock from '../Components/CMSBlock'
import FilterProducts from '../Components/FilterProducts'
import ProductsEmpty from '../Components/ProductsEmpty'
import SortProducts from '../Components/SortProducts'
import ProductCatalogueInformation from '../Components/ProductCatalogueInformation'
import useEzFetch from '../Hooks/useEzFetch'
import ProductImageGrid from '../Components/ProductImageGrid'
// import { useParentState } from '../FamilyState/store/pcpStore'
const bu = {
  AHI: '/ace',
  HCI: '/informa'
}
const initialHandler = { categoryId: '', from: 0, size: 48, sortType: 'matching', brands: '', colors: null, minPrice: '', maxPrice: '', storeCode: '', labels: '', canGoSend: '' }
const { width } = Dimensions.get('screen')
const ProductCataloguePage = ({ actions, navigation, route, state }) => {
  const { data = {}, search = '' } = route.params?.itemDetail ?? {}
  const itmData = route.params?.itmData ?? {}
  const { company_code: companyCode = '' } = data
  const urlKey = data.url_key
  const { get: getCategoryDetail, fetching: fetchingCategoryDetail, data: dataCategoryDetail } = useEzFetch()
  const { get: getProduct, fetching: fetchingProduct, error: errorProduct } = useEzFetch()
  const [dataProduct, setDataProduct] = useState({ products: [] })
  const [isScroll, setIsScroll] = useState(false)
  const [onAnimate, setOnAnimate] = useState(false)
  const [numColumns, setNumColumns] = useState(2)
  const [handler, setHandler] = useState(initialHandler)
  const isFiltered = useMemo(() => (some(pick(handler, ['colors', 'brands', 'labels', 'canGoSend', 'minPrice', 'maxPrice']), (v) => !isEmpty(v))), [handler])
  const getCategory = () => getCategoryDetail(`${bu[companyCode] || ''}/category/detail?urlKey=${urlKey || ''}&boostEmarsys=${data.boostEmarsys || ''}`)
  let callOnEndReached
  const handlerParams = () => {
    // return `from=${handler.from}&size=${handler.size}&sort=${handler.sortType}&brands=${handler.brands}&variant_attributes=${!isEmpty(handler.colors) ? `color:${handler.colors}` : ''}&minprice=${handler.minPrice}&maxprice=${handler.maxPrice}&express_courier=${(handler.canGoSend === '1,2' ? 1 : 0)}&storeCode=${handler.storeCode}&labels=${handler.labels}&keyword=${search}&isRuleBased=${(dataCategoryDetail.is_rule_based === '1')}&categoryId=${dataCategoryDetail.category_id || ''}&boost=${data.boostEmarsys || ''}`

    // handling url if value === null
    return `from=${handler.from}&size=${handler.size}&sort=${handler.sortType}&brands=${handler.brands}&variant_attributes=${!isEmpty(handler.colors) ? `color:${handler.colors}` : ''}&minprice=${handler.minPrice}&maxprice=${handler.maxPrice}&express_courier=${(handler.canGoSend === '1,2' ? 1 : 0)}&storeCode=${handler.storeCode}&labels=${handler.labels}&keyword=${search}&isRuleBased=${(!dataCategoryDetail ? false : dataCategoryDetail.is_rule_based === '1')}&categoryId=${!dataCategoryDetail ? '' : dataCategoryDetail.category_id}&boost=${data.boostEmarsys || ''}`
  }

  const getProductByKeyword = () => getProduct(`/product/keyword/${search}?${handlerParams()}`, {}, ({ response }) => generateDataProduct(response))
  const getProductByCategory = () => getProduct(`${bu[companyCode] || ''}/product/category/${dataCategoryDetail.url_key}?${handlerParams()}`, {}, ({ response }) => generateDataProduct(response))

  const generateDataProduct = (response) => {
    let resData = response?.data?.data ?? null
    if (resData) {
      let newDataProducts = {
        total: resData.total,
        products: resData.products
      }
      if (handler.from !== 0) newDataProducts['products'] = [...dataProduct.products, ...resData.products]
      setDataProduct(newDataProducts)
    }
  }

  const snackbar = useRef(null)
  const flatlist = useRef(null)
  const scrollToTop = useRef(null)

  useEffect(() => {
    if (urlKey) {
      if (dataCategoryDetail) getProductByCategory()
      else getCategory()
    } else getProductByKeyword()
  }, [dataCategoryDetail, handler])

  const productInfo = useMemo(() => ({ category: get(dataCategoryDetail, 'name', 'Semua Kategori'), name: search, total: dataProduct?.total ?? 0 }), [dataCategoryDetail, dataProduct])
  const ProductInformation = useMemo(() => {
    if (!isEmpty(dataProduct?.products)) return (<ProductCatalogueInformation productInfo={productInfo} />)
    else return null
  }, [productInfo])

  const renderNumColumns = useMemo(() => {
    return (
      <View style={{ width: width * 0.28 }}>
        <HeaderPills style={{ backgroundColor: numColumns === 4 ? '#F0F2F7' : 'white' }} onPress={() => {
          var newNumColumns = numColumns === 2 ? 4 : 2
          setNumColumns(newNumColumns)
        }}>
          <Icon name='view-grid' color='#757886' />
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', paddingLeft: 4 }}>{'Finder'}</Text>
        </HeaderPills>
      </View>
    )
  }, [numColumns])

  const toogleWishlist = (message = '') => snackbar.current.callWithAction(message, 'Lihat Wishlist')

  const refreshItems = () => urlKey ? getProductByCategory() : getProductByKeyword()
  const renderMoreItems = () => (!fetchingProduct && setHandler({ ...handler, from: handler.from + handler.size }))
  const headerComponent = useMemo(() => {
    return (
      <View style={{ paddingBottom: 10 }}>
        <HeaderSearchComponent home search={search} itmData={{}} searchBarcode cartIcon pageType={'category'} />
        <View style={{ minHeight: 40 }}>
          {/* {(!isEmpty(dataProduct?.products) || dataProduct?.total === 0) && */}
          {/* <ViewAnimated useNativeDriver animation='fadeIn' easing='ease-out-expo' > */}
          <View style={{ justifyContent: 'space-evenly', flexDirection: 'row' }}>
            <FilterProducts />
            <SortProducts />
            {renderNumColumns}
          </View>
        </View>
        {numColumns === 2 && urlKey && <CMSBlock urlKey={urlKey} shouldPersistData companyCode={companyCode} />}
        {/* {numColumns === 2 && <CMSBlock urlKey={urlKey} shouldPersistData companyCode={companyCode} />} */}
        {ProductInformation}
      </View>
    )
  }, [])

  const productErr = () => (
    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
      <Text style={{ textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Coba Lagi</Text>
      <TouchableOpacity onPress={() => renderMoreItems()} style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: '#757885', padding: 5, borderRadius: 100, width: 50, height: 50, marginVertical: 10 }}>
        <Icon name='refresh' color='#FFFFFF' size={30} />
      </TouchableOpacity>
    </View>
  )

  const contextValue = () => {
    return {
      flatlist,
      handler,
      setHandler,
      getProductByKeyword,
      getProductByCategory,
      dataProduct,
      dataCategoryDetail,
      fetchingProduct,
      isFiltered,
      search,
      data,
      urlKey,
      buParam: bu[companyCode],
      itmData
    }
  }
  const handleScroll = (e) => {
    let y = e.nativeEvent.contentOffset.y
    if (y > 20 && !isScroll) setIsScroll(true)
    else if (y < 20 && isScroll && !onAnimate) {
      setOnAnimate(true)
      scrollToTop.current.fadeOutDown(1000).then((e) => {
        if (e.finished) {
          setOnAnimate(false)
          setIsScroll(false)
        }
      })
    }
  }

  const RenderItems = useMemo(() => {
    if (numColumns === 2) return ItemCard
    else if (numColumns === 4) return ProductImageGrid
    else return <View />
  }, [numColumns])

  const listOfProducts = useMemo(() => {
    return dataProduct.products
  }, [dataProduct?.products])


  return (
    <ContextProvider value={contextValue()}>
      <ContainerNoPadding style={{ backgroundColor: 'white' }}>
        <FlatList
          data={listOfProducts}
          ref={flatlist}
          onScroll={handleScroll}
          removeClippedSubviews={Platform.OS === 'android'}
          refreshing={false}
          onEndReached={() => {
            if (callOnEndReached === false) {
              renderMoreItems()
              callOnEndReached = true
            }
          }}
          onEndReachedThreshold={0.1}
          onMomentumScrollBegin={() => { callOnEndReached = false }}
          initialNumToRender={12}
          updateCellsBatchingPeriod={48}
          maxToRenderPerBatch={24}
          extraData={numColumns}
          numColumns={numColumns}
          key={numColumns}
          onRefresh={() => refreshItems()}
          ListHeaderComponent={headerComponent}
          ListEmptyComponent={() => (
            // (!fetchingProduct && !fetchingCategoryDetail && dataProduct?.total === 0)
            (!fetchingProduct && !fetchingCategoryDetail && !urlKey)
              ? <ProductsEmpty resetProductsHandler={() => setHandler(initialHandler)} isFiltered={isFiltered} itmData={{}} toggleWishlist={toogleWishlist} />
              : <Lottie fullscreen />
          )}
          renderItem={({ item }) => <RenderItems itmData={{}} itemData={item} fromProductList wishlistRequest={toogleWishlist} />}
          ListFooterComponent={() => (fetchingProduct && (dataProduct?.total ?? 0) > 0 ? <Lottie /> : !isEmpty(errorProduct) && productErr())}
          keyExtractor={(item, index) => `product catalogue ${index}${item.name}`}
        />
        {isScroll &&
          <TouchableWithoutFeedback onPress={() => flatlist.current.scrollToOffset({ animated: true, offset: 0 })} >
            <ViewAnimated ref={scrollToTop} useNativeDriver animation='fadeInUpBig' easing='ease-out-expo' style={{ height: 60, width: 60, position: 'absolute', backgroundColor: 'white', borderRadius: 30, bottom: 15, right: 15, elevation: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name='arrow-up' color='grey' size={40} />
            </ViewAnimated>
          </TouchableWithoutFeedback>
        }
        <Snackbar ref={snackbar} actionHandler={() => navigation.navigate('Homepage', { screen: 'Wishlist' })} />
      </ContainerNoPadding>
    </ContextProvider>
  )
}

export default ProductCataloguePage
