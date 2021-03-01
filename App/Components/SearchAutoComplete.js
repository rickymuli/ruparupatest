import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Push } from '../Services/NavigationService'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import take from 'lodash/take'
import debounce from 'lodash/debounce'

// Components
import LottieComponent from '../Components/LottieComponent'
// import { trackWithProperties } from '../Services/MixPanel'
// import analytics from '@react-native-firebase/analytics'

import styles from './Styles/SearchResultStyles'
import { trackAlgoliaClick } from '../Services/AlgoliaAnalytics'
import useEzFetch from '../Hooks/useEzFetch'

const SearchAutoComplete = ({ keyword, urlKeyCheck, fetchingPageRedirect, fetchingStaticDetail, prevSearchAdd }) => {
  const { get: getAutoComplete, fetching } = useEzFetch()
  const [payload, setPayload] = useState({})

  const delaySearch = useCallback(debounce(async q => {
    const algolia = await AsyncStorage.getItem('algolia_anonymous_token')
    getAutoComplete(`/instant/search/${q}?storeCode=${''}`, { 'X-Algolia-UserToken': `anonymous-${algolia}` }, ({ response }) => {
      const res = response?.data?.data || {}
      setPayload({
        autoSuggestion: take(res.sug, 6) || [],
        categories: take(res.facets, 6) || [],
        products: take(res.prd, 6) || [],
        url: res.url,
        queryId: res.queryId
      })
    })
  }, 300), [])

  useEffect(() => {
    delaySearch(keyword)
    return () => null
  }, [keyword])

  const shownText = useMemo(() => {
    return payload?.autoSuggestion?.[0]?.query || keyword
  }, [payload])

  const goToPDP = (itemData, index) => {
    Keyboard.dismiss()
    let itmParameter = {
      itm_source: 'Search',
      itm_campaign: 'catalog',
      itm_term: itemData?.sku ?? ''
    }
    trackAlgoliaClick({ ...itemData, __queryID: payload.queryId, index: 'productsvariant', event: 'product_search', __position: index + 1 })
    Push('ProductDetailPage', { itemData, itmParameter })
  }
  const goToPCP = (searchKey, urlKey) => {
    Keyboard.dismiss()
    let itmData = {
      itm_source: 'Search',
      itm_campaign: 'category',
      itm_term: searchKey
    }
    let itemDetail = {
      data: {
        url_key: urlKey
      },
      search: searchKey
    }
    prevSearchAdd(searchKey)
    Push('ProductCataloguePage', { itemDetail, itmData })
  }
  if (fetchingPageRedirect || fetchingStaticDetail || fetching) return (<LottieComponent style={{ height: 50, width: 60, marginTop: 10 }} />)
  return (
    <View>
      <ScrollView keyboardShouldPersistTaps='always'>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          {
            map(payload.autoSuggestion, (suggestion, index) => !isEmpty(suggestion?.query) && (
              <TouchableOpacity onPress={() => urlKeyCheck(suggestion.query)} key={index}>
                <View style={styles.popularSearchView}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{suggestion.query}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
          {map(payload.categories, (category, index) => !isEmpty(category) &&
            (
              <TouchableOpacity onPress={() => goToPCP(shownText, payload.url?.[index])} key={index}>
                <View style={styles.popularSearchView}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{shownText} <Text style={{ fontFamily: 'Quicksand-Bold' }}>di kategori {category}</Text></Text>
                </View>
              </TouchableOpacity>
            ))
          }
          {
            map(payload.products, (product, index) => (
              <TouchableOpacity onPress={() => goToPDP(product, index)} key={index}>
                <View style={styles.popularSearchView}>
                  <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: 'Quicksand-Regular' }}>{(product?.name || '').toLowerCase()}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default SearchAutoComplete
