import React, { useEffect, useMemo } from 'react'
import { View, Text, TouchableWithoutFeedback, Linking, Dimensions } from 'react-native'
import { View as ViewAnimated } from 'react-native-animatable'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WithContext } from '../Context/CustomContext'
import analytics from '@react-native-firebase/analytics'
import useEzFetch from '../Hooks/useEzFetch'
import { Push } from '../Services/NavigationService'

// Styles
import styles from './Styles/AppStyles'
// import { fonts, colors, PrimaryTextMedium } from '../Styles'

// Components
import LottieComponent from './LottieComponent'
import CMSBlockHeaderDesc from './CMSBlockHeaderDesc'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('screen')
const RenderImagesColumn = ({ item, index }) => {
  return (
    <FastImage
      key={index}
      source={{
        uri: item.image
      }}
      style={{ width: width * 0.1, height: width * 0.1 }}
    />
  )
}
const RenderImagesGrid = ({ item, index }) => {
  return (
    <FastImage
      key={index}
      source={{
        uri: item.image
      }}
      style={styles.layoutImageFirst}
    />
  )
}
const CMSBlock = ({ urlKey, companyCode = '', cmsParam }) => {
  const { get, fetching, data } = useEzFetch()
  const dataCmsBlock = useMemo(() => {
    return cmsParam?.data ?? data
  }, [cmsParam, data])
  const companyName = (companyCode === 'AHI') ? 'ace' : (companyCode === 'HCI') ? 'informa' : ''

  const handleAnalytic = (param) => {
    // Firebase Analytic view_promotion
    let analyticData = {
      promotion_id: param.url_key,
      promotion_name: param.name
    }
    const promoPathList = [
      'promotions',
      'promo-brand'
    ]
    const promoPath = (param.url_key || '').split('/')
    if (promoPathList.some(i => promoPath.includes(i))) return analytics().logViewPromotion(analyticData)
    return analytics().logSelectContent({ content_type: 'category', item_id: param.url_key })
  }

  const itemPressed = (item) => {
    handleAnalytic(item)
    let newUrlKey = (item.url_key.startsWith(`${companyName}/`)) ? item.url_key.substr(companyName.length + 1, item.url_key.length) : item.url_key
    let itemDetail = {
      data: {
        url_key: newUrlKey,
        company_code: companyCode
      },
      search: ''
    }
    if (item.dir === 'Browser') {
      Linking.openURL(item.target_link)
    } else {
      Push(item.dir, {
        itemDetail
      }, `CMSBlock-${newUrlKey}`)
    }
  }

  useEffect(() => {
    let identifier = urlKey.includes('.html') ? urlKey.substring(0, urlKey.length - 5) : urlKey
    get(`${companyName}/misc/cms-block-detail?identifier=${identifier}`)
  }, [urlKey])

  if (Number(dataCmsBlock?.status ?? '0') !== 10) return null

  const grid2 = () => {
    return (
      <View style={[styles.flexRowWrap, { marginTop: 10 }]}>
        {(!fetching)
          ? map(dataCmsBlock?.content, (item, index) => (
            <ViewAnimated key={index} delay={index} useNativeDriver animation='fadeInUpBig' easing='ease-out-expo'>
              <TouchableWithoutFeedback onPress={() => itemPressed(item)} key={`cms pcp ${index}`}>
                <View style={styles.layoutCmsBlockContainer}>
                  <RenderImagesGrid item={item} index={index} />
                  {!isEmpty(item.title) && <Text style={styles.cmsItemTitle}>{item.title}</Text>}
                </View>
              </TouchableWithoutFeedback>
            </ViewAnimated>
          ))
          : <LottieComponent />
        }
      </View>
    )
  }

  const column = () => {
    return (
      <View style={styles.cmsContainer}>
        {(!fetching)
          ? map(dataCmsBlock?.content, (item, index) => (
            <ViewAnimated delay={index} key={index} useNativeDriver animation='fadeInUpBig' easing='ease-out-expo' style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => itemPressed(item)} key={`cms pcp ${index}`} >
                <View style={styles.layoutCmsBlockContainer_column}>
                  <View style={styles.ViewImageText}>
                    <RenderImagesColumn item={item} index={index} />
                    {!isEmpty(item.title) && <Text style={styles.cmsItemTitle}>{item.title}</Text>}
                  </View>
                  <View>
                    <Icon name='arrow-right' size={20} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ViewAnimated>
          ))
          : <LottieComponent />
        }
      </View>
    )
  }
  return (
    <View>
      {!isEmpty(dataCmsBlock.header_description) && <CMSBlockHeaderDesc headerdescription={dataCmsBlock.header_description} />}
      {Number(dataCmsBlock.page_layout) === 0
        ? grid2()
        : column()
      }
    </View>
  )
}

// export default WithContext(CMSBlock)
const shouldNotUpdate = (prevProps, nextProps) => (prevProps.urlKey === nextProps.urlKey)

export default WithContext(React.memo(CMSBlock, shouldNotUpdate))
