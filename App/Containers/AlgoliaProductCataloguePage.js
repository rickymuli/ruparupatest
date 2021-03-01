import React, { useRef, useMemo, useState, useCallback } from 'react'
import { View, FlatList, Platform } from 'react-native'
import get from 'lodash/get'
import { CreateParent } from '../FamilyState/store/pcpStore'

import { InstantSearch, Configure, connectInfiniteHits, connectStateResults } from 'react-instantsearch-native'
import { algoliaObjectHelper } from '../Services/AlgoliaAnalytics'
import algoliasearch from 'algoliasearch'
import config from '../../config'

import { ContainerNoPadding } from '../Styles/StyledComponents'

import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ItemCard from '../Components/ItemCard'
import Lottie from '../Components/LottieComponent'
import Snackbar from '../Components/SnackbarComponent'
import ProductsEmpty from '../Components/ProductsEmpty'
import AlgoliaSort from '../Components/AlgoliaSort'
import AlgoliaFilter from '../Components/AlgoliaFilter'
import ProductCatalogueInformation from '../Components/ProductCatalogueInformation'

const AlgoliaProductCataloguePage = ({ actions, navigation, route, state }) => {
  const { search = '' } = route.params?.itemDetail ?? {}
  const { products, categoryDetails, productsHandler } = state

  let snackbar = useRef(null)
  const toggleWishlist = (message = '') => snackbar.callWithAction(message, 'Lihat Wishlist')
  const productInfo = useMemo(() => ({ category: get(categoryDetails.data, 'name', 'Semua Kategori'), name: search, total: products.total || 0 }), [categoryDetails, products])
  const [sortType, setSortType] = useState({ key: 'matching', label: 'Paling Relevan', value: 'productsvariant' })
  const [algoliaFilterQuery, setAlgoliaFilterQuery] = useState('status:10')
  const [algolia, setAlgolia] = useState({
    price: { minPrice: '', maxPrice: '', invalidPrice: false },
    brands: [],
    colors: [],
    labels: []
  })
  return (
    <ContainerNoPadding style={{ backgroundColor: 'white' }}>
      <HeaderSearchComponent home search={search} itmData={{}} searchBarcode cartIcon pageType={'category'} />
      <InstantSearch indexName={sortType.value} searchClient={algoliasearch(config.apiIndexAlgolia, config.apiKeyAlgolia)}>
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          <AlgoliaFilter algoliaFilterQuery={algoliaFilterQuery} setAlgoliaFilterQuery={setAlgoliaFilterQuery} algolia={algolia} setAlgolia={setAlgolia} productsHandler={productsHandler} />
          <AlgoliaSort sortType={sortType} setSortType={setSortType} />
        </View>
        <Configure query={search} filters={algoliaFilterQuery} clickAnalytics />
        <AlgoliaPcpHeader search={search} productInfo={productInfo} actions={actions} toggleWishlist={toggleWishlist} />
        <ConnectedHits toggleWishlist={toggleWishlist} productInfo={productInfo} search={search} sortType={sortType} actions={actions} />
      </InstantSearch>
      <Snackbar ref={r => { snackbar = r }} actionHandler={() => navigation.navigate('Homepage', { screen: 'Wishlist' })} />
    </ContainerNoPadding>
  )
}

export default CreateParent(AlgoliaProductCataloguePage)

const ConnectedHits = connectInfiniteHits(({ hits, hasMore, refine, toggleWishlist, sortType }) => {
  return hits.length > 0 ? (
    <FlatList
      data={hits}
      removeClippedSubviews={Platform.OS === 'android'}
      refreshing={false}
      onEndReached={() => { if (hasMore) refine() }}
      initialNumToRender={12}
      maxToRenderPerBatch={6}
      onEndReachedThreshold={0.3}
      numColumns={2}
      renderItem={({ item: hit, index }) => {
        const itemData = algoliaObjectHelper(hit)
        return <ItemCard itmData={{}} itemData={itemData} fromProductList wishlistRequest={toggleWishlist} algoliaTrackHit={{ ...hit, index: sortType.value, event: 'product_catalog' }} key={`algoliaHit ${index}`} />
      }}
      ListFooterComponent={() => (hasMore ? <Lottie /> : null)}
      keyExtractor={(item, index) => `algolia product catalogue ${index}${item.name}`}
    />
  ) : null
})

const AlgoliaPcpHeader = connectStateResults(
  ({ searchResults, search, productInfo, searching, actions, toggleWishlist }) => {
    if (searchResults && searchResults.nbHits !== 0) {
      const algoliaProductInformation = { ...productInfo, total: searchResults.nbHits, name: search }
      return <ProductCatalogueInformation productInfo={algoliaProductInformation} />
    } else if (searching) return <Lottie />
    else return <ProductsEmpty resetProductsHandler={actions.productsHandler.reset} itmData={{}} toggleWishlist={toggleWishlist} isFiltered={() => false} />
  }
)
