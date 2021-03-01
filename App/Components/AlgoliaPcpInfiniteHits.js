import React, { useEffect, useRef, useState } from 'react'
import { View, FlatList, SafeAreaView } from 'react-native'
import { connectInfiniteHits, connectSortBy, connectStateResults, connectRefinementList } from 'react-instantsearch-native'
import ItemCard from './ItemCard'
import RenderPcpHeader from './RenderPcpHeader'
import LottieComponent from './LottieComponent'
import RenderEmptyProduct from './RenderEmptyProduct'
import { useSelector, useDispatch } from 'react-redux'
import map from 'lodash/map'
import flatten from 'lodash/flatten'
import isEmpty from 'lodash/isEmpty'
import findIndex from 'lodash/findIndex'
import sortBy from 'lodash/sortBy'
import NavigationFilterActions from '../Redux/NavigationFilterRedux'

let value = {
  matching: { value: 'productsvariant' },
  lowestPrice: { value: 'productsvariant_price_asc' },
  highestPrice: { value: 'productsvariant_price_desc' },
  newArrival: { value: 'productsvariant_publishdate' },
  highestDiscount: { value: 'productsvariant_discount_desc' },
  lowestDiscount: { value: 'productsvariant_discount_asc' }
}

const ConnectedHits = connectInfiniteHits(
  ({ hits, filter, hasMore, refine, productInformation, keyword, itmData, navigation }) => {
    let val = map(value, 'value')

    const hitValues = useRef(null)
    const flatListRef = useRef(null)
    const [isFetching, setIsFetching] = useState(false)
    const { sortType } = useSelector(state => state.productHandler)
    const { data } = useSelector(state => state.navigationFilter)

    useEffect(() => {
      if (JSON.stringify(hits) !== JSON.stringify(hitValues.current)) {
        hitValues.current = hits
      } else if (isFetching) {
        setIsFetching(false)
      }
    }, [hits])

    useEffect(() => { setIsFetching(true) }, [sortType])

    useEffect(() => { if (hits.length > 0) setIsFetching(true) }, [filter])
    useEffect(() => {
      if (flatListRef.current) flatListRef.current.scrollToIndex({ animated: true, index: 0 })
    }, [sortType])

    const genItemData = item => {
      return {
        name: item.name,
        is_in_stock: item.is_in_stock.ODI,
        brand: item.brand,
        variants: [{
          images: item.images,
          can_gosend: item.can_gosend,
          label: item.label.ODI,
          sku: item.sku,
          prices: [{
            price: item.default_price,
            special_price: (item.selling_price === item.default_price) ? 0 : item.selling_price
          }]
        }],
        url_key: item.url_key,
        multivariants: {}
      }
    }
    // return hits.length > 0 && !isFetching ? (
    return hits.length > 0 ? (
      <SafeAreaView style={{ flex: 1 }}>
        <BrandFilter attribute='brand.name' data={data} limit={30} />
        <ColourFilter attribute='colour' data={data} />
        <PromoFilter attribute='label.ODI' data={data} />
        <ConnectedSortBy
          defaultRefinement={`productsvariant`}
          // defaultRefinement={`${value[sortType].value}`}
          items={[
            { value: `${val[0]}`, label: 'Paling Relevan' },
            { value: `${val[1]}`, label: 'Harga Termurah' },
            { value: `${val[2]}`, label: 'Harga Termahal' },
            { value: `${val[3]}`, label: 'Produk Terbaru' },
            { value: `${val[4]}`, label: 'Diskon Terendah' },
            { value: `${val[5]}`, label: 'Diskon Tertinggi' }
          ]} />
        <FlatList
          ref={flatListRef}
          data={hits}
          renderItem={({ item: hit, index }) => {
            const itemData = genItemData(hit)
            return <ItemCard itmData={itmData} itemData={itemData} fromProductList key={`algoliaHit ${index}`} algoliaTrackHit={{ ...hit, index: value[sortType].value, event: 'product_catalog' }} />
          }}
          numColumns={2}
          ListHeaderComponent={() => <AlgoliaPcpHeader productInformation={productInformation} keyword={keyword} />}
          ListFooterComponent={() => (hasMore ? <LottieComponent /> : null)}
          onEndReachedThreshold={10}
          onEndReached={() => { if (hasMore) refine() }}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
    ) : <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AlgoliaPcpHeader productInformation={productInformation} keyword={keyword} navigation={navigation} itmData={itmData} />
    </View>
  }
)

const AlgoliaPcpHeader = connectStateResults(
  ({ searchResults, keyword, searching, productInformation, navigation, itmData }) => {
    if (searchResults && searchResults.nbHits !== 0) {
      const algoliaProductInformation = { ...productInformation, total: searchResults.nbHits, name: keyword }
      return (
        <RenderPcpHeader urlKey={''} productInformation={algoliaProductInformation} />
      )
    } else if (searching) {
      return <LottieComponent />
    } else {
      return <RenderEmptyProduct navigation={navigation} itmData={itmData} />
    }
  }
)

const ConnectedSortBy = connectSortBy((renderOptions) => {
  const { refine } = renderOptions
  const { sortType } = useSelector(state => state.productHandler)

  useEffect(() => { refine(value[sortType].value) }, [sortType])
  return null
})

const BrandFilter = connectRefinementList(
  ({ items, data }) => {
    let itemsAlphabeticalOrder = sortBy(items, ['value'])
    dispatchToNavigationFilter({ algoliaValues: itemsAlphabeticalOrder, filterName: 'brand', reduxData: data })
    return null
  }
)

const ColourFilter = connectRefinementList(
  ({ items, data }) => {
    dispatchToNavigationFilter({ algoliaValues: items, filterName: 'color', reduxData: data })
    return null
  }
)

const PromoFilter = connectRefinementList(
  ({ items, data }) => {
    dispatchToNavigationFilter({ algoliaValues: items, filterName: 'label', reduxData: data })
    return null
  }
)

const dispatchToNavigationFilter = ({ algoliaValues, filterName, reduxData }) => {
  let shouldDispatch = reduxData ? findIndex(reduxData, { filter_name: filterName }) : -1
  let filterValues = flatten(map(algoliaValues, 'value'))
  if (shouldDispatch < 0 && !isEmpty(filterValues)) {
    const dispatch = useDispatch()

    const item = { filter_name: filterName, filter_values: filterValues, isFromAlgolia: true }
    let res = reduxData ? [...reduxData, item] : [item]
    dispatch(NavigationFilterActions.filterSuccess(res))
  }
}

export default ConnectedHits
