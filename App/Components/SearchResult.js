import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  // Image,
  ScrollView
  // Dimensions
} from 'react-native'
import { Push } from '../Services/NavigationService'
// import config from '../../config'
// import { NumberWithCommas } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import isEqual from 'lodash/isEqual'

// Components
// import Loading from './LoadingComponent'
import LottieComponent from '../Components/LottieComponent'
// import { trackWithProperties } from '../Services/MixPanel'
import analytics from '@react-native-firebase/analytics'

import styles from './Styles/SearchResultStyles'
import { trackAlgoliaClick } from '../Services/AlgoliaAnalytics'
// import styled from 'styled-components'

export default class SearchResult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchKeyword: props.search.keyword,
      search: props.search.search
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      searchKeyword: newProps.search.keyword,
      search: newProps.search.search
    })
  }

  sendToParent = (searchKeyword, category) => {
    let itemDetail = {
      data: {
        url_key: category,
        category_id: ''
      },
      search: searchKeyword
    }
    let itmData = {
      itm_source: 'search',
      itm_campaign: 'catalog'
    }
    this.setState({ searchKeyword })
    this.props.updateSeachHistory(searchKeyword)
    analytics().logEvent('view_search_results', { search_term: searchKeyword })
    // trackWithProperties('Data SearchResult', { ...itemDetail.data, search: itemDetail.search })
    Push('ProductCataloguePage', { itemDetail, itmData })
  }

  sendKeywordToParent = (keyword) => {
    this.props.productHandlerReset()
    this.props.updateSeachHistory(keyword)
    this.props.setItemForPCP(keyword)
  }

  goToPDP = (itemData, index) => {
    this.props.updateSeachHistory(this.state.searchKeyword)
    if (this.props.setModalSearchVisible) {
      this.props.setModalSearchVisible(false)
    }
    const sku = get(itemData, 'variants[0].sku', '')
    let itmParameter = {
      itm_source: 'Search',
      itm_campaign: 'catalog',
      itm_term: sku
    }
    trackAlgoliaClick({ ...itemData.algoliaHit, index: 'productsvariant', event: 'product_search', __position: index + 1 })
    this.props.navigation.navigate('ProductDetailPage', {
      itemData,
      itmParameter
    })
  }

  // renderPrice = (itemData) => {
  //   if (isEqual(itemData.special_price, 0)) {
  //     return (
  //       <Price>Rp { NumberWithCommas(itemData.price) }</Price>
  //     )
  //   } else {
  //     let discount = Math.round(((itemData.price - itemData.special_price) / itemData.price) * 100)
  //     return (
  //       <View style={{ flexDirection: 'row', width: Dimensions.get('window').width * 0.6, justifyContent: 'space-between' }}>
  //         <View style={{ flexDirection: 'column' }}>
  //           <Priceold>Rp { NumberWithCommas(itemData.price) }</Priceold>
  //           <Price>Rp { NumberWithCommas(itemData.special_price) }</Price>
  //         </View>
  //         <View>
  //           <View style={{ backgroundColor: '#F26525', borderRadius: 100 / 2, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}>
  //             <Text style={{ color: 'white', fontFamily: 'Quicksand-Bold' }}>{discount}%</Text>
  //           </View>
  //         </View>
  //       </View>
  //     )
  //   }
  // }

  render () {
    const { search } = this.state
    if (search.fetching) {
      return (
        <LottieComponent style={{ height: 50, width: 60, marginTop: 10 }} />
      )
    } else if (search.payload === null) {
      return null
    } else if (search.payload !== null && !search.fetching) {
      return (
        <View style={styles.itemStyles}>
          <ScrollView keyboardShouldPersistTaps='always'>
            <View>
              <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                {search.payload.autoSuggestion
                  ? search.payload.autoSuggestion.map((suggestion, index) => {
                    console.log(suggestion, '======')
                    if (!isEmpty(suggestion) && index < 6) {
                      return (
                        <TouchableOpacity onPress={() => this.sendKeywordToParent(suggestion)} key={`searchCategory${suggestion}${index}`}>
                          <View style={styles.popularSearchView}>
                            <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{suggestion}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    } else {
                      return null
                    }
                  })
                  : null
                }
                {search.payload.categories
                  ? search.payload.categories.map((category, index) => {
                    if (!isEmpty(category)) {
                      let shownText = isEmpty(search.payload.autoSuggestion[0]) ? this.state.searchKeyword : search.payload.autoSuggestion[0]
                      return (
                        <TouchableOpacity onPress={() => this.sendToParent(shownText, category.url)} key={`searchCategory${category.name}${index}`}>
                          <View style={styles.popularSearchView}>
                            <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{shownText} <Text style={{ fontFamily: 'Quicksand-Bold' }}>di kategori {category.name}</Text></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    } else {
                      return null
                    }
                  })
                  : null
                }
                {search.payload.products
                  ? search.payload.products.map((product, index) => {
                    return (
                      <TouchableOpacity onPress={() => this.goToPDP(product, index)} key={`product${product.name}${index}`}>
                        <View style={styles.popularSearchView}>
                          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{product.name.toLowerCase()}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                  : null
                }
                {/* {search.payload.categoriesRelated
                  ? search.payload.categoriesRelated.map((category, index) => {
                    if (!isEmpty(category.name)) {
                      if (searchKeyword === category.name.substring(0, searchKeyword.length) || isEmpty(category.facets)) {
                        return (
                          <TouchableOpacity onPress={() => this.sendKeywordToParent(searchKeyword + category.name.substring(searchKeyword.length, category.name.length))} key={`searchCategory${category.name}${index}`}>
                            <View style={styles.popularSearchView}>
                              <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{searchKeyword}<Text style={{ fontFamily: 'Quicksand-Bold' }}>{category.name.substring(searchKeyword.length, category.name.length)}</Text></Text>
                            </View>
                          </TouchableOpacity>
                        )
                      } else {
                        return (
                          <TouchableOpacity onPress={() => this.sendToParent(search.payload.suggestKeyword, category.url)} key={`searchCategory${category.facets}${index}`}>
                            <View style={styles.popularSearchView}>
                              <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{search.payload.suggestKeyword} <Text style={{ fontFamily: 'Quicksand-Bold' }}>di kategori {category.facets}</Text></Text>
                            </View>
                          </TouchableOpacity>
                        )
                      }
                    } else {
                      return null
                    }
                  })
                  : null
                } */}
                {/* {(search.payload.categoriesRelated.length < 10) &&
                  search.payload.products.map((product, index) => {
                    let indexKeyword = product.name.toLowerCase().search(searchKeyword.toLowerCase())
                    if (indexKeyword !== -1) {
                      return (
                        <TouchableOpacity onPress={() => this.goToPDP(product)} key={`product${product.name}${index}`}>
                          <View style={styles.popularSearchView}>
                            <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 16 }}><Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{product.name.substring(0, indexKeyword).toLowerCase()}</Text>{searchKeyword}<Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{product.name.substring(indexKeyword + searchKeyword.length, product.name.length).toLowerCase()}</Text></Text>
                          </View>
                        </TouchableOpacity>
                      )
                    } else {
                      return (
                        <TouchableOpacity onPress={() => this.goToPDP(product)} key={`product${product.name}${index}`}>
                          <View style={styles.popularSearchView}>
                            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{product.name.toLowerCase()}</Text>
                          </View>
                        </TouchableOpacity>
                      )
                    }
                  })
                } */}
              </View>
              {/* <View>
                <View style={{ marginTop: 20, marginLeft: 15, marginBottom: 10 }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}>Produk Terpopuler</Text>
                </View>
                <View style={{ marginLeft: 15, marginBottom: 20 }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular' }}><Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}>{search.payload.data.total}</Text> produk dengan kata cari <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}>{this.state.searchKeyword}</Text></Text>
                </View>
                {search.payload.data.products
                  ? search.payload.data.products.map((product, index) => (
                    <TouchableOpacity onPress={() => this.goToPDP(product)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, marginBottom: 10 }} key={`searchProduct${this.state.searchKeyword}${product.url_key}${index}`}>
                      <Image style={styles.imageResult} source={{ uri: `${config.imageURL}${product.variants[0].images[0].image_url}` }} />
                      <View style={{ flexDirection: 'column' }}>
                        {this.renderPrice(product.variants[0].prices[0])}
                        <View style={{ marginTop: 10, width: Dimensions.get('screen').width * 0.8, flexWrap: 'wrap', paddingLeft: 5 }}>
                          <TitleLimitName>{product.name}</TitleLimitName>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                  : null
                }
              </View> */}
            </View>
            {/* {(search.payload.data.total !== 0)
              ? <TouchableOpacity onPress={() => this.sendToParent('Lihat Semua')}>
                <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#F26525', padding: 15 }}>
                  <Text style={{ fontFamily: 'Quicksand-Bold', color: 'white', fontSize: 18 }}>Lihat Semua</Text>
                </View>
              </TouchableOpacity>
              : null
            } */}
          </ScrollView>
        </View>
      )
    }
  }
}
// const Priceold = styled.Text`
//   color: #757886;
//   position: relative;
//   font-size:12px;
//   text-decoration: line-through;
//   text-decoration-color: #f26524;
//   font-family:Quicksand-Regular;
// `

// const Price = styled.Text`
//   font-size: 16px;
//   line-height: 19px;
//   color: #008ed1;
//   margin-top:5px;
//   font-family:Quicksand-Bold;
// `

// const TitleLimitName = styled.Text`
//   width: 50%
//   flex-direction: row;
//   font-size:14px;
//   color: #555761;
//   line-height: 24px;
//   font-family:Quicksand-Regular;
// `
