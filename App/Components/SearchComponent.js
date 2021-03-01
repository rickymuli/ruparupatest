import React, { Component } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Push } from '../Services/NavigationService'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import map from 'lodash/map'
import has from 'lodash/has'
import analytics from '@react-native-firebase/analytics'
// import { trackWithProperties } from '../Services/MixPanel'

// Redux
import LogActions from '../Redux/LogRedux'
import MiscActions from '../Redux/MiscRedux'
import SearchActions from '../Redux/SearchRedux'
import SearchHistoryActions from '../Redux/SearchHistoryRedux'
import ProductHandlerActions from '../Redux/ProductHandler'

// Components
import SearchResult from './SearchResult'
import ProductLastSeen from './ProductLastSeen'

// Styles
import styles from './Styles/SearchScreenStyles'
import styled from 'styled-components'

const { width } = Dimensions.get('screen')

class SearchComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchKeyword: props.searchKeyword || '',
      onSubmitPressed: false,
      itmData: {},
      prevSearch: [],
      redirect: false
    }
    this.searchInput = null
  }

  startSearch(searchKeyword) {
    this.props.searchProductByKeyword(searchKeyword)
  }

  componentWillUnmount() {
    this.props.searchPageRedirectInit()
  }

  componentDidMount() {
    this.props.getCustom('custom_popular_search')
    this.props.miscPromoBannerRequest()
    this.props.searchHistoryRequest()
    this.props.popularSearchRequest()
    if (!isEmpty(this.props.searchKeyword)) {
      this.startSearch(this.props.searchKeyword)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.prevSearch !== nextProps.history) {
      return {
        prevSearch: nextProps.history.data
      }
    }
    return null
  }

  componentDidUpdate(prevProps, prevState) {
    const { searchKeyword, onSubmitPressed, itmData, redirect } = this.state
    const { search, misc } = this.props
    if (!search.fetchingPageRedirect && onSubmitPressed) {
      let pageRedirect = get(search.pageRedirect, 'pageRedirect', '')
      let urlKey = pageRedirect?.split('?')[0] || ''
      if (urlKey) {
        // Redirect to ProductCataloguePage (WAPI)
        itmData['itm_campaign'] = urlKey
        this.props.miscVerifyStaticRequest(urlKey)
        this.setState({ onSubmitPressed: false, redirect: true })
      } else {
        // Redirect to AlgoliaProductCataloguePage
        let itemDetail = {
          data: {
            url_key: ''
          },
          search: searchKeyword
        }
        this.updateSeachHistory(searchKeyword) // save search history
        this.setState({ searchKeyword: '', onSubmitPressed: false },
          () => {
            if (fromIndex) {
              navigation.navigate('ProductCataloguePage', { itemDetail, itmData })
            } else {
              navigation.replace('ProductCataloguePage', { itemDetail, itmData })
            }
          })
      }
    }
    if (!isEmpty(misc.verifyStatic) && redirect) {
      const dir = {
        category: 'ProductCataloguePage',
        promo_page: 'PromoPage',
        product: 'ProductDetailPage'
      }
      this.updateSeachHistory(searchKeyword) // save search history
      analytics().logEvent('view_search_results', { search_term: searchKeyword })
      // trackWithProperties('Data search', { ...itemDetail.data, search: itemDetail.search })
      let itemDetail = {
        data: {
          url_key: misc.verifyStatic.url_key
        },
        search: searchKeyword
      }
      let directoryPage = dir[misc.verifyStatic.section]
      if (!directoryPage) {
        directoryPage = 'ProductCataloguePage'
      }
      this.props.miscVerifyStaticInit()
      this.setState({ searchKeyword: '', redirect: false }, () => Push('ProductCataloguePage', { itemDetail, itmData }))
    } else if (!isEmpty(misc.errVerifyStatic) && redirect) {
      let itemDetail = {
        data: {
          url_key: ''
        },
        search: searchKeyword
      }
      this.props.miscVerifyStaticInit()
      this.setState({ searchKeyword: '', redirect: false }, () => Push('ProductCataloguePage', { itemDetail, itmData }))
    }
  }

  // Render search result
  onSearch = (searchKeyword) => {
    const hasWhitespace = /^ *$/.test(searchKeyword)
    if (searchKeyword.length > 2) this.startSearch(searchKeyword)

    if (!hasWhitespace) this.setState({ searchKeyword }) // whitespace validation
    else if (isEmpty(searchKeyword)) this.setState({ searchKeyword: '' })
  }

  // Send to PCP from pressing return key
  setItemForPCP = (keyword, campaign) => {
    analytics().setAnalyticsCollectionEnabled(true)
    if (!isEmpty(keyword) && !(/^ *$/.test(keyword))) { // regex for whitespace validation
      this.updateSeachHistory(keyword)
      this.props.searchPageRedirectInit()
      // analytics().logEvent('search_keyword', { search_keyword: keyword })
      analytics().logEvent('search', { search_term: keyword })
      let itmData = {
        itm_source: 'search',
        itm_campaign: campaign,
        keyword: keyword
      }
      this.props.searchPageRedirect(keyword)
      this.props.searchByKeywordInit()
      this.setState({ itmData, searchKeyword: keyword, onSubmitPressed: true })
    }
  }

  // Update search history
  updateSeachHistory = (searchKeyword) => {
    const { prevSearch } = this.state
    let newArr = prevSearch ? _([searchKeyword, ...prevSearch]).uniq().take(4) : [searchKeyword]
    this.setState({ searchKeyword, prevSearch: newArr })
    this.props.saveSearchHistoryRequest(newArr)
  }

  // Erase previous search history
  erasePrevSearch = () => {
    this.props.saveSearchHistoryRequest(null)
    this.props.searchHistoryRequest()
  }

  eraseSearchKeyword = () => {
    this.setState({ searchKeyword: '' }, () => this.props.searchHistoryRequest())
    this.searchInput.focus()
  }

  eraseOnePrevSearch = (index) => {
    let newArr = JSON.parse(JSON.stringify(this.state.prevSearch))
    newArr.splice(index, 1)
    this.props.saveSearchHistoryRequest(newArr)
    this.props.searchHistoryRequest()
  }

  // Pressing scan page
  goToScanPage = () => {
    this.props.navigation.navigate('ScanPage')
  }

  popularFeedBack(data, campaign) {
    let itemDetail = {
      data: {
        url_key: data.url_key,
        category_id: data.category_id,
        promo_type: data.promo_type
      }
    }
    let itmData = {
      itm_source: 'search',
      itm_campaign: campaign,
      promo: data.url_key
    }
    const params = {
      ProductDetailPage: { itemData: itemDetail.data, itmData },
      ProductCataloguePage: { itemDetail, itmData },
      PromoPage: { itemDetail, itmData }
    }
    if (data.dir.toLowerCase() === 'browser') {
      Linking.openURL(data.url_key)
    } else {
      // trackWithProperties('Data popularFeedBack', itemDetail.data)
      this.props.navigation.navigate(data.dir, params[data.dir])
    }
  }

  loadingData = () => {
    const { log, search, history, misc } = this.props
    const { searchKeyword, prevSearch } = this.state
    if (log.fetchingPopularSearch || history.fetching) {
      return null
    } else if (!log.fetchingPopularSearch && !isEmpty(log.popularSearch) && searchKeyword.length < 3) {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {has(misc, 'promoBanner[0].img_src') &&
            <TouchableOpacity onPress={() => this.popularFeedBack(misc.promoBanner[0], 'popular-banner-promo')}>
              <Image source={{ uri: misc.promoBanner[0].img_src }} style={{ height: width * 0.07, width: width, alignSelf: 'center' }} />
            </TouchableOpacity>
          }
          {(!isEmpty(prevSearch)) &&
            <View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={styles.headerText}>Pencarian Terakhir</Text>
                <TouchableOpacity onPress={() => this.erasePrevSearch()}>
                  <Text style={styles.eraseHistoryStyle}>Hapus Semua</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {prevSearch.map((searchKeyword, index) => (
                  <View style={styles.prevSearchView} key={`previous search keyword${index}${searchKeyword}`}>
                    <TouchableOpacity onPress={() => this.setItemForPCP(searchKeyword, 'last-search')}>
                      <Text style={styles.capsuleText}>{searchKeyword}</Text>
                    </TouchableOpacity>
                    <Icon name='close-circle' style={{ paddingLeft: 10 }} color='#D4DCE6' size={20} onPress={() => this.eraseOnePrevSearch(index)} />
                  </View>
                ))}
              </View>
            </View>
          }
          <ProductLastSeen FromIndexSearch navigation={this.props.navigation} />
          <View>
            <Text style={styles.headerText}>Pencarian Populer</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {has(misc.getCustom, 'value_list') &&
                map(JSON.parse(misc.getCustom.value_list), (popularSearch, index) => (
                  <TouchableOpacity key={`popularSearch${index}${popularSearch.name}`} onPress={() => this.popularFeedBack(popularSearch, 'popular-search-promo')}>
                    <View style={styles.popularSearchView}>
                      <Text style={styles.popularSearchText}>{popularSearch.name}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              {map(log.popularSearch, (popularSearch, index) => (
                <TouchableOpacity key={`popularSearch${index}${popularSearch}`} onPress={() => this.setItemForPCP(popularSearch, 'popular_search')}>
                  <View style={styles.popularSearchView}>
                    <Text style={styles.popularSearchText}>{popularSearch}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )
    } else if (!log.fetchingPopularSearch && !isEmpty(log.popularSearch) && searchKeyword.length >= 2) {
      return (
        <SearchResult
          setItemForPCP={this.setItemForPCP}
          updateSeachHistory={this.updateSeachHistory}
          search={{ search: search, keyword: searchKeyword }}
          navigation={this.props.navigation}
          productHandlerReset={this.props.productHandlerReset}
        />
      )
    }
  }

  render() {
    const { searchKeyword } = this.state
    const { home, autofocus = false } = this.props
    return (
      <View style={{ backgroundColor: 'white' }} >
        <CardHeader>
          <DistributeSpaceBetween>
            {home &&
              <TouchPointIcon onPress={() => this.props.navigation.navigate('Homepage')}>
                <Image style={{ width: 25, height: 25 }} source={require('../assets/images/home-header-index.webp')} />
              </TouchPointIcon>
            }
            <FormM style={{ flexDirection: 'row', justifyContent: 'space-between', borderRadius: 30 }}>
              <TextInput
                returnKeyType='search'
                ref={ref => { this.searchInput = ref }}
                selectionColor='rgba(242, 101, 37, 1)'
                underlineColorAndroid='transparent'
                autoCapitalize='none'
                autoFocus={autofocus}
                value={searchKeyword}
                onChangeText={(event) => this.onSearch(event)}
                onSubmitEditing={() => this.setItemForPCP(searchKeyword, 'direct_search')}
                style={{ height: 40, textDecorationColor: 'white', color: '#F26525', fontWeight: 'bold', flex: 1 }} />
              {(!isEmpty(searchKeyword)) &&
                <TouchableOpacity onPress={() => this.eraseSearchKeyword()} >
                  <Icon style={{ alignSelf: 'center', padding: 10, paddingLeft: 15 }} size={20} name='close-circle' />
                </TouchableOpacity>
              }
            </FormM>
            <TouchPointIcon onPress={() => this.goToScanPage()}>
              <IconAnt name={'scan1'} size={24} />
            </TouchPointIcon>
          </DistributeSpaceBetween>
        </CardHeader>
        <ScrollView keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
          {this.loadingData()}
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  log: state.log,
  search: state.search,
  history: state.history,
  misc: state.misc
})

const dispatchToProps = (dispatch) => ({
  searchProductByKeyword: (keyword) => dispatch(SearchActions.searchByKeywordRequest(keyword)),
  searchByKeywordInit: () => dispatch(SearchActions.searchByKeywordInit()),
  getCustom: (param) => dispatch(MiscActions.miscGetCustomRequest(param)),
  logCreateRequest: (data) => dispatch(LogActions.logCreateRequest(data)),
  popularSearchRequest: () => dispatch(LogActions.popularSearchRequest()),
  searchPageRedirect: (keyword) => dispatch(SearchActions.searchPageRedirectRequest(keyword)),
  searchPageRedirectInit: () => dispatch(SearchActions.searchPageRedirectInit()),
  saveSearchHistoryRequest: (data) => dispatch(SearchHistoryActions.saveSearchHistoryRequest(data)),
  searchHistoryRequest: () => dispatch(SearchHistoryActions.searchHistoryRequest()),
  miscPromoBannerRequest: () => dispatch(MiscActions.miscPromoBannerRequest()),
  miscVerifyStaticRequest: (data) => dispatch(MiscActions.miscVerifyStaticRequest(data)),
  miscVerifyStaticInit: () => dispatch(MiscActions.miscVerifyStaticInit()),
  productHandlerReset: () => dispatch(ProductHandlerActions.productHandlerReset())
})

export default connect(stateToProps, dispatchToProps)(SearchComponent)

const FormM = styled.View`
  border: 1px #e5e9f2 solid;
  border-radius: 3px;
  margin-top: 0px;
  margin-bottom: 10px;
  flex: 1;
  align-items: center;
  padding-horizontal: 10px;
`

const CardHeader = styled.View`
background-color: white;
padding-top: 35px;
padding-bottom:0px;
box-shadow: 1px 1px 1px #D4DCE6;
elevation:2;
`

const DistributeSpaceBetween = styled.View`
paddingHorizontal: 10;
flex-direction: row;
justify-content: space-between;
`

const TouchPointIcon = styled.TouchableOpacity`
align-self:center;
margin-top:10px;
margin-bottom:20px;
padding-left: 10px;
padding-right: 10px;
`
