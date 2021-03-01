import React, { Component } from 'react'
import { FlatList, View, Platform, Text, TouchableOpacity } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import has from 'lodash/has'
import includes from 'lodash/includes'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { InstantSearch, Configure } from 'react-instantsearch-native'
import algoliasearch from 'algoliasearch'

// Components
import RenderEmptyProduct from './RenderEmptyProduct'
import RenderPcpHeader from './RenderPcpHeader'
// import ProductList from './ProductList'
import LottieComponent from './LottieComponent'
import ItemCard from './ItemCard'
import AlgoliaPcpInfiniteHits from './AlgoliaPcpInfiniteHits'
import config from '../../config'

// Redux
import CategoryDetailActions from '../Redux/CategoryDetailRedux'
import ProductActions from '../Redux/ProductRedux'
import ProductHandlerActions from '../Redux/ProductHandler'
import NavigationFilterActions from '../Redux/NavigationFilterRedux'

class RenderPcpItems extends Component {
  constructor (props) {
    super(props)
    this.onEndReachedCalledDuringMomentum = true
    this.state = {
      products: null,
      refresh: false,
      loadMore: false,
      itemDetail: null,
      urlKey: '',
      renderNew: true,
      itmData: props?.itmData ?? {},
      productInformation: {
        category: 'Semua Kategori',
        name: '',
        total: 0
      }
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {
      renderNew: state.renderNew
    }

    if (!isEmpty(props.product.payload)) {
      // Check if its a request
      if (state.refresh && !state.loadMore) {
        if (!isEqual(props.product.payload.products, state.products)) {
          returnObj = {
            ...returnObj,
            products: props.product.payload.products,
            refresh: false
          }
        } else {
          returnObj = {
            ...returnObj,
            refresh: false
          }
        }
      }

      // Check if the request is made from new urlKey request
      if (props.product.payload.total !== state.productInformation.total) {
        let productInformation = {
          category: has(props.itemDetail, 'name') ? props.itemDetail.data.name : 'Semua Kategori',
          name: props.itemDetail.search,
          total: props.product.payload.hasOwnProperty('total') ? props.product.payload.total : 0
        }
        if (productInformation !== state.productInformation) {
          returnObj = {
            ...returnObj,
            productInformation,
            renderNew: false
          }
        }
      }
      if (!props.product.fetching) {
        returnObj = {
          ...returnObj,
          renderNew: false
        }
      }

      if (!isEqual(props.product.payload.products, state.products)) {
        // Check if the request is for the infinite scroll
        if (state.loadMore && !isEmpty(state.products)) {
          returnObj = {
            ...returnObj,
            products: [...state.products, ...props.product.payload.products],
            loadMore: false
          }
        } else {
          returnObj = {
            ...returnObj,
            products: props.product.payload.products
          }
        }
      }
    }
    if (!isEmpty(props.itemDetail)) {
      if (!isEqual(state.urlKey, props.itemDetail.data.url_key)) {
        returnObj = {
          ...returnObj,
          renderNew: true,
          products: [],
          urlKey: props.itemDetail.data.url_key
        }
      }
    } else if (!isEmpty(props.categoryDetail.data)) {
      if (!isEqual(state.urlKey, props.categoryDetail.data)) {
        returnObj = {
          ...returnObj,
          renderNew: true,
          products: [],
          urlKey: props.categoryDetail.data.url_key
        }
      }
    } else {
      returnObj = {
        ...returnObj,
        urlKey: ''
      }
    }

    return returnObj
  }

  componentDidMount () {
    const { itemDetail } = this.props
    if (!isEmpty(itemDetail.data.url_key) || !isEmpty(itemDetail.search)) {
      this.props.resetFrom()
      this.props.categoryDetailWithProductRequest(itemDetail.data.url_key, itemDetail.search, itemDetail.data.company_code, itemDetail.data.boostEmarsys)
    }

    if (itemDetail !== this.state.itemDetail) {
      const renderNew = !has(itemDetail, 'data.url_key')
      this.setState({
        products: null,
        itemDetail,
        renderNew
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { itemDetail } = this.props
    if (!isEqual(itemDetail, prevProps.itemDetail)) {
      if (!isEmpty(itemDetail.data.url_key) || !isEmpty(itemDetail.search)) {
        this.props.resetFrom()
        this.props.categoryDetailWithProductRequest(itemDetail.data.url_key, itemDetail.search, itemDetail.data.company_code)
      }
    }
  }

  componentWillUnmount () {
    this.props.navigationFilterInit()
    // this.props.productReset()
  }

  refreshItems = () => {
    this.props.forceClose()
    this.setState({ refresh: true })
    this.props.productHandlerGetMoreItem(0, this.state.itemDetail.data.company_code)
    // if (!isEmpty(this.state.urlKey)) {
    //   this.props.productRequest((!isEmpty(this.state.itemDetail.data) ? this.state.itemDetail.data.company_code : ''))
    // } else {
    //   this.props.productByKeywordRequest()
    // }
  }

  renderMoreItems = (e) => {
    if (!this.onEndReachedCalledDuringMomentum && e.distanceFromEnd > 0 && this.state.products.length < this.state.productInformation.total && !isEmpty(this.state.products)) {
      if (!this.state.loadMore) {
        this.setState({ loadMore: true })
        const { from, size } = this.props.productHandler
        let newFrom = from + size
        this.props.productHandlerGetMoreItem(newFrom, this.state.itemDetail.data.company_code)
        this.onEndReachedCalledDuringMomentum = true
      }
    }
  }

  retryFetching = () => {
    const { from, size } = this.props.productHandler
    let newFrom = from + size
    this.props.productHandlerGetMoreItem(newFrom, this.state.itemDetail.data.company_code)
  }

  _headerComponent = () => {
    const { categoryDetail } = this.props
    const { productInformation, urlKey } = this.state
    if (!isEmpty(categoryDetail) && !isEmpty(categoryDetail.data)) {
      productInformation.category = categoryDetail.data.name
    }
    return (
      <RenderPcpHeader urlKey={urlKey} productInformation={productInformation} navigation={this.props.navigation} />
    )
  }

  momentumSetter = value => { this.onEndReachedCalledDuringMomentum = value }

  generateFilterQuery = productHandler => {
    const { algolia, minPrice, maxPrice } = productHandler
    const { colors, brands, labels, canGosend } = algolia
    let filter = 'status:10'

    if (!isEmpty(colors)) {
      filter += ' AND ('
      colors.forEach((color, i) => {
        filter += `colour:${color}`
        if (i !== colors.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    if (!isEmpty(brands)) {
      filter += ' AND ('
      brands.forEach((brand, i) => {
        filter += `brand.name:"${brand.toUpperCase()}"`
        if (i !== brands.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    if (canGosend === '1,2') filter += ' AND (is_express_courier:"Express Courier")'
    // if (!isEmpty(canGoSend)) {
    //   filter += ' AND ('
    //   if (canGoSend === '1') filter += `can_gosend:sameday)`
    //   else if (canGoSend === '2') filter += `can_gosend:instant)`
    //   else if (canGoSend === '1,2') filter += `can_gosend:sameday OR can_gosend:instant)`
    // }

    if (!isEmpty(labels)) {
      filter += ' AND ('
      labels.forEach((label, i) => {
        filter += `label.ODI:"${label}"`
        if (i !== labels.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    if (!isEmpty(minPrice)) filter += ` AND selling_price > ${Number(minPrice)}`
    if (!isEmpty(maxPrice)) filter += ` AND selling_price < ${Number(maxPrice)}`

    return filter
  }

  render () {
    const { product, productHandler, categoryDetail } = this.props
    const { products, refresh, loadMore, renderNew, productInformation, itmData, itemDetail } = this.state
    let removeClippedSubviews = Platform.OS === 'android' !== false
    const algoliaNoUrlKeyCondition = (!isEmpty(has(itemDetail, 'search') ? itemDetail.search : itmData.keyword) && !has(itmData, 'promo')) && isEmpty(has(itemDetail, 'data.url_key') ? itemDetail.data.url_key : '')
    if (isEmpty(productInformation) || renderNew || productHandler.fetchFilter || (productHandler.fetchSort && categoryDetail.data) || refresh) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieComponent />
        </View>
      )
    } else if (algoliaNoUrlKeyCondition && (has(itmData, 'keyword') ? itmData.keyword : itemDetail.search)) {
      let filter = this.generateFilterQuery(productHandler)
      const keyword = has(itmData, 'keyword') ? itmData.keyword : itemDetail.search
      let platform = Platform.OS
      platform = (platform === 'android') ? `android ${config.versionAndroid}` : `ios ${config.versionIos}`

      let algoliaClient = algoliasearch(
        config.apiIndexAlgolia,
        config.apiKeyAlgolia
      )
      const searchClient = {
        search (requests) {
          const newRequests = requests.map((request) => {
            if (!request.params.query || request.params.query.length === 0) {
              request.params.analytics = false
            }
            return request
          })
          return algoliaClient.search(newRequests)
        }
      }
      return (
        <InstantSearch
          searchClient={searchClient}
          // searchClient={algoliasearch(config.apiIndexAlgolia, config.apiKeyAlgolia)}
          indexName='productsvariant'>
          <Configure query={keyword} filters={filter} clickAnalytics analyticsTags={[`mo-apps-ruparupa ${platform}`]} />
          <AlgoliaPcpInfiniteHits itmData={itmData} productHandler={productHandler} filter={filter} productInformation={productInformation} keyword={keyword} navigation={this.props.navigation} />
        </InstantSearch>
      )
    } else if (itemDetail && (includes(itemDetail.data.url_key, '.html') || includes(itmData.itm_campaign, '.html'))) {
      return (
        <FlatList
          data={(!isEmpty(products)) ? products : []}
          removeClippedSubviews={removeClippedSubviews}
          refreshing={refresh}
          onEndReached={(e) => this.renderMoreItems(e)}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
          initialNumToRender={12}
          maxToRenderPerBatch={6}
          onEndReachedThreshold={0.3}
          numColumns={2}
          onRefresh={() => this.refreshItems()}
          ListHeaderComponent={this._headerComponent}
          renderItem={({ item, index }) => {
            return (
              <ItemCard itmData={itmData} fromProductList wishlistRequest={this.props.toggleWishlist} itemData={item} navigation={this.props.navigation} key={`renderPcp ${index}`} />
            )
          }}
          ListFooterComponent={() => {
            if (loadMore) {
              return (<LottieComponent />)
            } else if (!isEmpty(this.props.product.err) && !loadMore) {
              return (
                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                  <Text style={{ textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Coba Lagi</Text>
                  <TouchableOpacity onPress={() => this.retryFetching()} style={{ alignItems: 'center', alignSelf: 'center', justifyContent: 'center', backgroundColor: '#757885', padding: 5, borderRadius: 100, width: 50, height: 50, marginVertical: 10 }}>
                    <Icon name='refresh' color='#FFFFFF' size={30} />
                  </TouchableOpacity>
                </View>
              )
            } else {
              return null
            }
          }}
          keyExtractor={(item, index) => `product catalogue ${index}${item.name}`}
        />
      )
    } else if (productInformation.total === 0) {
      if (!product.fetching) {
        return <RenderEmptyProduct resetFilterAndSort={this.props.resetFilterAndSort} itmData={this.state.itmData} navigation={this.props.navigation} />
      } else {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <LottieComponent />
          </View>
        )
      }
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  categoryDetail: state.categoryDetail,
  product: state.product,
  productHandler: state.productHandler
})

const mapDispatchToProps = (dispatch) => ({
  categoryDetailWithProductRequest: (urlKey, searchKeyword, companyCode, boostEmarsys) => dispatch(CategoryDetailActions.categoryDetailWithProductRequest(urlKey, searchKeyword, companyCode, boostEmarsys)),
  productHandlerGetMoreItem: (from, companyCode) => dispatch(ProductHandlerActions.productHandlerGetMoreItemRequest(from, companyCode)),
  resetFrom: () => dispatch(ProductHandlerActions.productHandlerResetFrom()),
  productReset: () => dispatch(ProductActions.productReset()),
  productRequest: (companyCode) => dispatch(ProductActions.productRequest(companyCode)),
  productByKeywordRequest: () => dispatch(ProductActions.productByKeywordRequest()),
  navigationFilterInit: () => dispatch(NavigationFilterActions.filterInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(RenderPcpItems)
