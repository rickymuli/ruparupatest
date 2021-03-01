import React, { Component, useEffect, useState } from 'react'
import { Dimensions, View, Text, TouchableOpacity, Linking, TextInput, TouchableWithoutFeedback } from 'react-native'
import FastImage from 'react-native-fast-image'
import Swiper from 'react-native-swiper'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import config from '../../config.js'
import analytics from '@react-native-firebase/analytics'
import useEzFetch from '../Hooks/useEzFetch.js'

const { width } = Dimensions.get('screen')

const IndexCarousel = (props) => {
  const [state, setState] = useState({
    isfetched: false,
    urlKey: '',
  })
  const { get, fetching, data, error } = useEzFetch()

  useEffect(() => {
    get('/misc/mobile-app-banner')
  }, [])

  const _handleAnalytic = (data) => {
    // Firebase Analytic select_promotion
    let analyticData = {
      creative_name: data.url_key || 'no-creative-name',
      creative_slot: 'slot' || 'no-creative-slot',
      location_id: data.url_link || 'no-location-id',
      promotion_id: data._id || 'no-promotion-id',
      promotion_name: data.img_alt || 'no-promotion-name'
    }
    analytics().logSelectPromotion(analyticData)
  }

  const onPressAction = (bannerData) => {
    _handleAnalytic(bannerData)
    if (bannerData.dir === 'Browser') {
      Linking.openURL(bannerData.url_key)
    } else {
      let itemDetail = {
        data: {
          url_key: bannerData.url_key || null,
          category_id: bannerData.category_id || null,
          promo_type: bannerData.promo_type || null,
          company_code: bannerData.target_bu || null
        },
        search: ''
      }
      let itmData = {
        itm_source: 'homepage',
        itm_campaign: 'popular-banner-promo',
        promo: bannerData.url_key
      }
      if (bannerData.dir === 'ProductCataloguePage') props.navigation.push(bannerData.dir, { itemDetail, itmData })
      else props.navigation.navigate(bannerData.dir, { itemDetail, itmData })
    }
  }
  const autoPlay = !__DEV__
  const { isfetched, urlKey } = state
  const ratio = (width) / 640

  return (
    <View style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10, overflow: 'hidden' }}>
      {(fetching || !data)
        ? <ShimmerPlaceHolder autoRun width={width} height={ratio * 480} visible={false} style={{ alignSelf: 'center' }} />
        : <>
          <Swiper
            style={{ height: ratio * 480 }}
            autoplay={autoPlay}
            showsPagination={isfetched}
            loop={true}>
            {data.map((bannerData, index) => (

              <TouchableWithoutFeedback onPress={() => onPressAction(bannerData)} style={{ alignSelf: 'center', width, height: ratio * 480, overflow: 'hidden' }} key={`banner ${index}`}>
                <FastImage
                  source={{
                    uri: bannerData.img_src, // 'https://cdn.ruparupa.io/promotion/ruparupa/hbdi/hbdi_sliderapps.jpg' => 640*480,
                    priority: FastImage.priority.high,
                    cache: FastImage.cacheControl.immutable
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  style={{ width: width, height: ratio * 480, alignSelf: 'center' }}
                  onLoadEnd={() => { setState({ ...state, isfetched: true }) }}
                />
              </TouchableWithoutFeedback>
            ))}
          </Swiper>
        </>
      }
      {(config.developmentENV !== 'prod' || config.showTahuTextInput)
        ? <View style={{ marginBottom: 10, flexDirection: 'column' }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', marginBottom: 5, marginTop: 10 }}>This will only be shown in staging version of the app!</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <TextInput
              style={{ width: width * 0.4, height: 35, borderColor: '#757886', borderWidth: 1, borderRadius: 5, color: 'black' }}
              value={urlKey}
              onChangeText={urlKey => setState({ ...state, urlKey })}
              placeholder='promo prefix'
              placeholderTextColor='#b2bec3'
            />
            <TouchableOpacity
              onPress={() => onPressAction({
                dir: 'PromoPage',
                url_key: urlKey
              })}
              style={{ backgroundColor: '#F26525', borderRadius: 5, height: 35, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}
            >
              <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, textAlign: 'center', color: 'white' }}>{'To Tahu'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        : null
      }
    </View>
  )
}

export default IndexCarousel