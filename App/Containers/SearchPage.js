import React, { useEffect, useState, useMemo, useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Dimensions, Linking, Keyboard } from 'react-native'
import { Push } from '../Services/NavigationService'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconAnt from 'react-native-vector-icons/AntDesign'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'
import get from 'lodash/get'
import map from 'lodash/map'
// import trim from 'lodash/trim'

// import analytics from '@react-native-firebase/analytics'
import useEzFetch from '../Hooks/useEzFetch'
import LottieComponent from '../Components/LottieComponent'
// // import { trackWithProperties } from '../Services/MixPanel'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import PrevSearchActions from '../Redux/PrevSearchRedux'
import MiscActions from '../Redux/MiscRedux'
import LogActions from '../Redux/LogRedux'

// Components
import SearchAutoComplete from '../Components/SearchAutoComplete'
import ProductLastSeen from '../Components/ProductLastSeen'

// Styles
import styles from '../Components/Styles/SearchScreenStyles'
import styled from 'styled-components'

const { width } = Dimensions.get('screen')
const SearchPage = ({ navigation, route }) => {
  const searchRef = useRef(null)
  const [keyword, setKeyword] = useState(route?.params?.searchKeyword || '')
  // const [itmData, setItmData] = useState({})
  const dispatch = useDispatch()
  const { promoBanner, getCustom } = useSelector(state => state.misc)
  const { data: prevSearch } = useSelector(state => state.prevSearch)
  const { popularSearch } = useSelector(state => state.log)

  // const textInput = useRef(null)
  const { get: getStaticDetail, fetching: fetchingStaticDetail } = useEzFetch()
  const { get: getPageRedirect, fetching: fetchingPageRedirect } = useEzFetch()

  const prevSearchAdd = (params) => dispatch(PrevSearchActions.prevSearchAdd(params))

  useEffect(() => {
    dispatch(MiscActions.miscGetCustomRequest('custom_popular_search'))
    dispatch(MiscActions.miscPromoBannerRequest())
    dispatch(LogActions.popularSearchRequest())
    searchRef.current.focus()
    return () => {
      Keyboard.dismiss()
    }
  }, [])

  const urlKeyCheck = (params, campaign) => {
    Keyboard.dismiss()
    setKeyword(params)
    getPageRedirect(`/product/pageredirect/${params}`, {}, ({ response }) => {
      var pageRedirect = response.data?.data?.pageRedirect || ''
      var urlKey = pageRedirect.split('?')[0]
      let itmData = {
        itm_source: 'search',
        itm_campaign: campaign,
        itm_term: params
      }
      let itemDetail = {
        data: {
          url_key: ''
        },
        search: params
      }
      prevSearchAdd(params)
      if (urlKey) {
        getStaticDetail(`/routes/${urlKey}`, {}, ({ response }) => {
          const section = response?.data?.data?.section ?? ''
          itemDetail.data.url_key = get(response?.data, 'data.url_key', '')

          if (section === 'promo_page') Push('PromoPage', { itemDetail, itmData })
          else if (section === 'category' || section === 'custom_category') Push('ProductCataloguePage', { itemDetail, itmData }, `searchToPcp-${params}`)
        })
      } else Push('AlgoliaProductCataloguePage', { itemDetail, itmData }, `searchToAlgoliaPcp-${params}`)
    })
  }

  const popularFeedBack = (item, campaign) => {
    Keyboard.dismiss()
    let itemDetail = {
      data: {
        url_key: item.url_key,
        category_id: item.category_id,
        promo_type: item.promo_type
      }
    }
    let itmData = {
      itm_source: 'search',
      itm_campaign: campaign,
      promo: item.url_key
    }
    if (item.dir.toLowerCase() === 'browser') Linking.openURL(item.url_key)
    else {
      var params = {}
      switch (item.dir) {
        case 'ProductCataloguePage':
        case 'PromoPage':
          params = { itemDetail, itmData }
          break
        case 'ProductDetailPage':
          params = { itemData: itemDetail.data, itmData }
          break
        default:
      }
      // trackWithProperties('Data popularFeedBack', itemDetail.data)
      navigation.navigate(item.dir, params)
    }
  }

  const PopularSearch = useMemo(() => {
    if (!isEmpty(popularSearch) || !isEmpty(getCustom)) {
      return (
        <View>
          <Text style={styles.headerText}>Pencarian Populer</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {has(getCustom, 'value_list') && map(JSON.parse(getCustom.value_list), (popular, index) => (
              <TouchableOpacity key={index} onPress={() => popularFeedBack(popular, 'popular-search-promo')}>
                <View style={styles.popularSearchView}>
                  <Text style={styles.popularSearchText}>{popular.name}</Text>
                </View>
              </TouchableOpacity>))}
            {map(popularSearch, (popular, index) => (
              <TouchableOpacity key={index} onPress={() => urlKeyCheck(popular, 'popular_search')}>
                <View style={styles.popularSearchView}>
                  <Text style={styles.popularSearchText}>{popular}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )
    } else return null
  }, [popularSearch, getCustom])

  const PromoBanner = useMemo(() => {
    if (has(promoBanner, '[0].img_src')) {
      return (
        <TouchableOpacity onPress={() => popularFeedBack(promoBanner[0], 'popular-banner-promo')}>
          <Image source={{ uri: promoBanner[0].img_src }} style={{ height: width * 0.07, width: width, alignSelf: 'center' }} />
        </TouchableOpacity>
      )
    } else return null
  }, [promoBanner])

  const renderBody = () => {
    if (keyword.length > 2) return (<SearchAutoComplete prevSearchAdd={(e) => prevSearchAdd(e)} keyword={keyword} urlKeyCheck={urlKeyCheck.bind(this)} fetchingStaticDetail={fetchingStaticDetail} fetchingPageRedirect={fetchingPageRedirect} />)
    else {
      return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
          {PromoBanner}
          {(!isEmpty(prevSearch)) &&
            <View>
              <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <Text style={styles.headerText}>Pencarian Terakhir</Text>
                <TouchableOpacity onPress={() => dispatch(PrevSearchActions.prevSearchReset())}>
                  <Text style={styles.eraseHistoryStyle}>Hapus Semua</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {prevSearch.slice(0, 6).map((prev, index) => (
                  <View style={styles.prevSearchView} key={`previous search keyword${index}${prev}`}>
                    <TouchableOpacity onPress={() => urlKeyCheck(prev, 'last-search')}>
                      <Text style={styles.capsuleText}>{prev}</Text>
                    </TouchableOpacity>
                    <Icon name='close-circle' style={{ paddingLeft: 10 }} color='#D4DCE6' size={20} onPress={() => dispatch(PrevSearchActions.prevSearchRemove(prev))} />
                  </View>
                ))}
              </View>
            </View>
          }
          <ProductLastSeen FromIndexSearch navigation={navigation} />
          {PopularSearch}
        </View>
      )
    }
  }

  // Render search result
  const onChange = (e) => {
    const hasWhitespace = /^ *$/.test(e)
    if (!hasWhitespace || e === '') setKeyword(e) // whitespace validation
  }

  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ backgroundColor: 'white', flex: 1 }} >
      <CardHeader>
        <DistributeSpaceBetween>
          <TouchPointIcon onPress={() => navigation.navigate('Homepage')}>
            <Image style={{ width: 25, height: 25 }} source={require('../assets/images/home-header-index.webp')} />
          </TouchPointIcon>
          <FormM style={{ flexDirection: 'row', justifyContent: 'space-between', borderRadius: 30 }}>
            <TextInput
              ref={searchRef}
              returnKeyType='search'
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              // autoFocus
              value={keyword}
              onChangeText={(e) => onChange(e)}
              onSubmitEditing={() => !isEmpty(keyword) && urlKeyCheck(keyword)}
              style={{ height: 40, textDecorationColor: 'white', color: '#F26525', fontWeight: 'bold', flex: 1 }} />
            {(!isEmpty(keyword)) &&
              <TouchableOpacity onPress={() => setKeyword('')} >
                <Icon style={{ alignSelf: 'center', padding: 10, paddingLeft: 15 }} size={20} name='close-circle' />
              </TouchableOpacity>
            }
          </FormM>
          <TouchPointIcon onPress={() => navigation.navigate('ScanPage')}>
            <IconAnt name={'scan1'} size={24} />
          </TouchPointIcon>
        </DistributeSpaceBetween>
      </CardHeader>
      <ScrollView keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'>
        {(fetchingPageRedirect || fetchingStaticDetail)
          ? <LottieComponent style={{ height: 50, width: 60, marginTop: 10 }} />
          : renderBody()
        }
      </ScrollView>
    </ScrollView>
  )
}

export default SearchPage

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
