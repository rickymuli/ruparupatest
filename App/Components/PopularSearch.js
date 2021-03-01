import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView } from 'react-native'
import styled from 'styled-components'
import analytics from '@react-native-firebase/analytics'
import map from 'lodash/map'
import has from 'lodash/has'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
// import { trackWithProperties } from '../Services/MixPanel'

// redux
import SearchActions from '../Redux/SearchRedux'
import SearchHistoryActions from '../Redux/SearchHistoryRedux'

// Component
// import Loading from '../Components/LoadingComponent'

// Redux

class PopularSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      prevSearch: [],
      searchKeyword: '',
      itmData: {},
      onSubmitPressed: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (prevState.prevSearch !== nextProps.history) {
      return {
        prevSearch: nextProps.history.data
      }
    }
    return null
  }

  componentDidUpdate (prevProps, prevState) {
    const { searchKeyword, onSubmitPressed, itmData } = this.state
    const { search } = this.props
    if (!search.fetchingPageRedirect && onSubmitPressed) {
      let pageRedirect = get(search.pageRedirect, 'pageRedirect', '')
      let urlKey = pageRedirect?.split('?')[0] || ''
      let itemDetail = {
        data: {
          url_key: urlKey
        },
        search: searchKeyword
      }
      this.startSearch(searchKeyword)
      this.updateSeachHistory(searchKeyword)
      this.setState({ onSubmitPressed: false })
      this.updateSeachHistory(searchKeyword) // save search history
      // trackWithProperties('Data exploreByCategory', itemDetail)
      this.props.navigation.navigate('ProductCataloguePage', { itemDetail, itmData })
    }
  }

  async startSearch (searchKeyword) {
    await this.props.searchProductByKeyword(searchKeyword)
  }

  updateSeachHistory = (keyword) => {
    let newArr = JSON.parse(JSON.stringify(this.state.prevSearch))
    if (newArr) {
      var index = newArr.indexOf(keyword)
      if (newArr.length >= 4 && index === -1) {
        newArr.pop()
      } else if (index > -1) {
        newArr.splice(index, 1)
      }
      newArr = [keyword, ...newArr]
      this.setState({
        searchKeyword: keyword,
        prevSearch: [keyword, ...newArr]
      })
    } else {
      newArr = [keyword]
      this.setState({
        searchKeyword: keyword,
        prevSearch: [keyword]
      })
    }
    this.props.saveSearchHistoryRequest(newArr)
  }

  setItemForPCP = (keyword) => {
    analytics().setAnalyticsCollectionEnabled(true)
    if (!isEmpty(keyword)) {
      this.props.searchPageRedirectInit() // Clear Data first. getDerivedFromProps keeps on getting the previous pageRedirect Redux state
      // analytics().logEvent('search_keyword', { search_keyword: keyword })
      analytics().logEvent('search', { search_term: keyword })
      let itmData = {
        itm_source: 'Homepage',
        itm_campaign: 'popular_search'
      }
      this.props.searchPageRedirect(keyword)
      this.setState({
        itmData,
        searchKeyword: keyword,
        onSubmitPressed: true
      })
    }
  }

  popularFeedBack (data) {
    let itemDetail = {
      data: {
        url_key: data.url_key,
        category_id: data.category_id
      }
    }
    let itmData = {
      itm_source: 'Homepage',
      itm_campaign: 'popular-search-promo'
    }
    const params = {
      ProductDetailPage: { itemData: itemDetail.data, itmData },
      ProductCataloguePage: { itemDetail, itmData },
      PromoPage: { itemDetail, itmData }
    }
    this.props.navigation.navigate(data.dir, params[data.dir])
  }

  render () {
    const { log, misc } = this.props
    if (log.fetchingPopularSearch) {
      return null
    } else {
      return (
        <MainContainer>
          <HeaderText>Populer</HeaderText>
          <ScrollView horizontal>
            {has(misc.getCustom, 'value_list') &&
                map(JSON.parse(misc.getCustom.value_list), (popularSearch, index) => (
                  <Capsules onPress={() => this.popularFeedBack(popularSearch)} key={`popular search index ${popularSearch.name} ${index}`}>
                    <SearchText>{popularSearch.name}</SearchText>
                  </Capsules>
                ))}
            {has(log, 'popularSearch') &&
              map(log.popularSearch, (keyword, index) => (
                (index < 4) &&
                <Capsules onPress={() => this.setItemForPCP(keyword)} key={`popular search index ${keyword} ${index}`}>
                  <SearchText>{keyword}</SearchText>
                </Capsules>
              ))}
          </ScrollView>
        </MainContainer>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  log: state.log,
  misc: state.misc,
  search: state.search,
  history: state.history
})

const mapDispatchToProps = (dispatch) => ({
  searchProductByKeyword: (keyword) => dispatch(SearchActions.searchByKeywordRequest(keyword)),
  saveSearchHistoryRequest: (data) => dispatch(SearchHistoryActions.saveSearchHistoryRequest(data)),
  searchPageRedirect: (keyword) => dispatch(SearchActions.searchPageRedirectRequest(keyword)),
  searchPageRedirectInit: () => dispatch(SearchActions.searchPageRedirectInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(PopularSearch)

const MainContainer = styled.View`
  flex-direction: column;
  margin-top: 10;
`

const HeaderText = styled.Text`
  color: #757886;
  font-family: Quicksand-Bold;
  font-size: 12;
`

const Capsules = styled.TouchableOpacity`
  background-color: #F9FAFC;
  borderRadius: 50;
  padding-vertical: 5;
  padding-horizontal: 15;
  margin-top: 10;
  margin-right: 5;
`

const SearchText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 12;
  color: #757886;
`
