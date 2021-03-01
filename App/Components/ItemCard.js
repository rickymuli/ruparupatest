import React, {useEffect} from 'react'
import { TouchableOpacity, View, Image, Platform, Dimensions } from 'react-native'
import config from '../../config.js'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Push, Replace } from '../Services/NavigationService'
import { trackRecommendationClick } from '../Services/Emarsys'
import { trackAlgoliaClick } from '../Services/AlgoliaAnalytics'
import FastImage from 'react-native-fast-image'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import get from 'lodash/get'
// import { useNavigationState } from '@react-navigation/native'
import analytics from '@react-native-firebase/analytics'

// Components
import ButtonWishlist from './ButtonWishlist'
import MultivariantCard from './MultivariantCard'
import ItemCardPrice from './ItemCardPrice'

// Styles
import styled from 'styled-components'
import { WithContext } from '../Context/CustomContext'
import RatingStars from './RatingStars'

const { width } = Dimensions.get('screen')
const ItemCard = (props) => {
  const { itemData = {}, itmData = {}, storeNewRetail, fromProductList, wishlistRequest, hidePrice, disabled, callSnackbarWithAction, emarsysRecommendation, emarsysData, fromCart, noWishlist, algoliaTrackHit, replaceNavigation } = props
  if (get(itemData, 'variants.length', 0) <= 0) return null
  let variants = get(itemData, 'variants[0]', {})
  let Container = fromProductList ? ProductContainer : ProductContainerFixed

  // const routesLength = useNavigationState(state => state.routes)

  const goToPDP = () => {
    if (itmData) {
      analytics().logSelectItem({
        item_list_id: itmData?.itm_source ?? '', // eslint-disable-line
        item_list_name: itmData?.itm_campaign ?? '', // eslint-disable-line
        content_type: itmData?.itm_source ?? '', // eslint-disable-line
        items: [{
          item_id: variants.sku,
          item_name: itemData.name,
          item_category: itemData.url_key
        }]
      })
    }
    // if (this.props.validatepdp) {
    //   this.props.validatepdp()
    // }
    // trackWithProperties('Data product', item)
    let param = {
      itemData,
      itmParameter: {},
      images: variants.images,
      video: variants.video,
      algoliaTrackHit
    }
    if (get(storeNewRetail, 'data.store_code')) {
      param = {
        ...param,
        storeName: get(storeNewRetail, 'data.store_code', ''),
        isScanned: variants.is_product_scanned === 10
      }
    }
    if (!isEmpty(itmData)) {
      if (itmData.utm_source) param.itmParameter = itmData
      else {
        let key = includes(['direct_search', 'catalog'], itmData.campaign) && !isEmpty(itmData.keyword) ? `&keyword=${itmData.keyword}` : ''
        param.itmParameter = {
          itm_source: itmData.itm_source,
          itm_campaign: `${itmData.itm_campaign}${key}`,
          itm_term: variants.sku
        }
      }
    }
    if (replaceNavigation) {
      Replace('ProductDetailPage', param)
    } else Push('ProductDetailPage', param, `PDP-${variants.sku}`)

    if (emarsysRecommendation) trackRecommendationClick(emarsysData)
    if (algoliaTrackHit) trackAlgoliaClick(algoliaTrackHit)
    // Navigate('ProductDetailPage', { ...param })
  }

  const renderLabel = () => {
    if (variants.label !== '') {
      return (
        <View>
          <Promotion>
            <Icon name='information-outline' color='#FF3B33' size={14} style={{ alignSelf: 'center', marginRight: 5 }} />
            <PromotionText>{variants.label}</PromotionText>
          </Promotion>
        </View>
      )
    } else {
      // No Label
      return null
    }
  }

  const wishlistButtonPressed = (message) => {
    if (wishlistRequest) wishlistRequest(message)
    else if (callSnackbarWithAction) callSnackbarWithAction(message, 'Lihat Wishlist')
  }

  const renderWishlist = () => {
    let rightWishlist = {
      alignItems: 'flex-end'
    }
    if (Platform.OS === 'ios') {
      rightWishlist['zIndex'] = 1
    }
    return (
      <View style={rightWishlist}>
        <Wishlist>
          <ButtonWishlist wishlistButtonPressed={wishlistButtonPressed.bind(this)} sku={variants.sku} />
        </Wishlist>
      </View>
    )
  }

  const renderStamp = ({imageSize, isStockEmpty}) => {
    let isFlashSale = !!(itmData.itm_campaign === 'FlashSale')

    // render empty stock
    if (isStockEmpty) return (
      <View style={{ width: imageSize, height: imageSize, zIndex: 10, position: 'absolute', top: 0, left: 0, justifyContent: 'center' }}>
        <Image
          source={require('../assets/images/stock-habis.webp')}
          style={{ aspectRatio: 2.5 / 1, height: imageSize / 3, alignSelf: 'center' }}
        />
      </View>
    )

    // render flash sale
    if (isFlashSale) return (
      <View style={{ width: imageSize, height: imageSize, zIndex: 9, position: 'absolute', top: 0, left: 0 }}>
        <Image
          source={require('../assets/images/flashsale.webp')}
          style={{ aspectRatio: 1, height: imageSize / 2.5 }}
        />
      </View>
    )

  }

  const renderVariantImage = () => {
    let imageSize = fromProductList ? (width / 2) : 150
    let imageUri = (emarsysRecommendation) ? `${variants.images[0].image_url}` : `${config.imageURL}w_170,h_170,f_auto,q_auto${variants.images[0].image_url}`
    let isStockEmpty = !!(itemData.is_in_stock === 0 && variants.label !== 'New Arrivals')
    return (
      <>
        <FastImage
          source={{
            uri: imageUri
          }}
          resizeMode={FastImage.resizeMode.contain}
          style={{ width: imageSize, height: imageSize, alignSelf: 'center', opacity: isStockEmpty ? 0.2 : 1 }}
        />
        {renderStamp({imageSize, isStockEmpty})}
      </>
    )
  }

  const renderInfoDeliv = () => {
    let infoDeliv = ''
    if (variants.can_gosend) {
      variants.can_gosend.map((deliveryMethod) => {
        if ((deliveryMethod === 'instant' || deliveryMethod.delivery_method === 'instant_delivery') && infoDeliv === '') {
          infoDeliv = 'Instant Delivery'
        } else if ((deliveryMethod.delivery_method === 'same_day' || deliveryMethod === 'sameday') && infoDeliv === '') {
          infoDeliv = 'Sameday Delivery'
        } else if (infoDeliv !== '') {
          infoDeliv = 'Sameday & Instant'
        }
      })
    }
    if (isEmpty(infoDeliv)) return null
    return (
      <Promotion>
        <Image
          source={require('../assets/images/icon/sameday-instant-delivery-pdp.webp')}
          style={{ height: 22, width: 22, opacity: 0.8, marginRight: 5, marginTop: 1 }}
        />
        <PromotionDelivery numberOfLines={2}>
          {infoDeliv}
        </PromotionDelivery>
      </Promotion>
    )
  }

  const renderTitle = () => {
    return (
      <TitleLimitName numberOfLines={2}>
        {UpperCase((itemData.name || '').toLowerCase())}
      </TitleLimitName>
    )
  }
  return (
    <Container style={(emarsysRecommendation && !fromCart) ? { width: (Dimensions.get('screen').width / 2.1) } : {}}>
      {(disabled) &&
        <View style={{ opacity: 0.7, zIndex: 2, width: '150%', height: '150%', backgroundColor: 'white', position: 'absolute' }} />
      }
      {!noWishlist && renderWishlist()}
      <TouchableOpacity disabled={disabled} onPress={() => goToPDP()}>
        {variants.images && renderVariantImage()}
        {variants.is_limited_stock
          ? <LimitStockLabel>
            <LimitStockText>Stok terbatas</LimitStockText>
          </LimitStockLabel>
          : null}
        <View style={{ paddingHorizontal: 10, paddingBottom: 5 }}>
          {fromProductList &&
            <View style={{ alignItems: 'center' }}>
              {(!isEmpty(itemData.multivariants) && !isEmpty(itemData.multivariants?.attributes)) &&
                <MultivariantCard multivariants={itemData.multivariants} />
              }
            </View>
          }
          <ItemCardPrice fromProductList={fromProductList} itemData={variants.prices[0]} hidePrice={hidePrice} />
          {renderTitle()}
          {(!emarsysRecommendation) && renderLabel()}
          {(!isEmpty(variants.rating)) &&
            <RatingStars rating={variants.rating.average_star} total={variants.rating.total} />
          }
          {renderInfoDeliv()}
          {itemData.is_in_stock === 0 && <OutOfStock>{variants.label === 'New Arrivals' ? 'Coming Soon' : 'Stok Habis'}</OutOfStock>}
        </View>
      </TouchableOpacity>
    </Container>
  )
}

const shouldNotUpdate = (prevProps, nextProps) => (prevProps.itemData === nextProps.itemData)
export default WithContext(React.memo(ItemCard, shouldNotUpdate))

const ProductContainer = styled.View`
  flex-direction:column;
  background-color: #ffffff;
  ${'' /* border-radius: 3px;
  margin-left:1%;
  margin-right:1%;
  margin-bottom:10px; */}
  margin: 1px;
  width: 48%;
  position: relative;
  overflow: hidden;
`

const ProductContainerFixed = styled.View`
  flex-direction:column;
  background-color: #ffffff;
  ${'' /* border-radius: 3px;
  margin-left:4;
  margin-right:4;
  margin-vertical:4px; */}
  margin: 1px;
  width: 150px;
  position: relative;
  overflow: hidden;
`

const TitleLimitName = styled.Text`
  ${''}
  font-size:14px;
  color: #757886;
  line-height: 18px;
  overflow:hidden;
  font-family:Quicksand-Regular;
`

const OutOfStock = styled.Text`
  color: #F3251D;
  font-size: 14px;
  font-family:Quicksand-Regular;
`

const Wishlist = styled.View`
  position:absolute;
  z-index:1;
`

const Promotion = styled.View`
  flex-direction: row;
  margin-top: 5px;
  margin-bottom: 5px;
  opacity: 0.7;
`

const PromotionText = styled.Text`
  color: #F3251D;
  align-self:center;
  font-size: 12px;
  font-family:Quicksand-Regular;
`

const PromotionDelivery = styled.Text`
  flex:1;
  color: #757886;
  font-size: 14px;
  font-family:Quicksand-Regular;
`
const LimitStockLabel = styled.View`
  flex: 1;
  height: 25;
  flex-direction: row;
  position: absolute;
  transform: rotate(-43deg);
  top: 7%;
  left: -30%;
  padding: 3px;
  backgroundColor: #F26525;
  text-align: center;
`
const LimitStockText = styled.Text`
  fontFamily:Quicksand-Bold;
  width: 100%;
  font-size: 12;
  color: #ffffff;
  text-align: center;
`
