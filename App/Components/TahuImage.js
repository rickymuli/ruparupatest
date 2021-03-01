import React, { Component } from 'react'
import { Image, TouchableWithoutFeedback, View, Linking, Dimensions } from 'react-native'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import Swiper from 'react-native-swiper'
import Carousel from 'react-native-snap-carousel'
import TahuTnc from '../Components/TahuTnc'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import includes from 'lodash/includes'
import isArray from 'lodash/isArray'
import flattenDeep from 'lodash/flattenDeep'
import maxBy from 'lodash/maxBy'

import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WithContext } from '../Context/CustomContext'
import analytics from '@react-native-firebase/analytics'

class TahuImage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: [],
      width: props.width
    }
  }

  handleAnalytic = (data) => {
    // Firebase Analytic view_promotion
    let analyticData = {
      items: [{
        coupon: data.voucher,
        location_id: data.target_url_key || data.img_src
      }],
      location_id: data.target_url_key || data.img_src
    }
    analytics().logEvent('view_promotion', analyticData)
  }

  imageFeedback (data) {
    this.handleAnalytic(data)
    if (data.action_click === 'modal') {
      this.tncModal.openTnc(data.tnc_title, data.tnc_description, data.voucher, data.useButtonTnc, data.buttonName, data.dir_link_tnc, data.target_url_key_tnc)
    } else if (data.action_click === 'redirect') {
      if (data.dir === 'StaticPage') {
        Linking.openURL(data.img_link)
      } else {
        let itemDetail = {
          data: {
            url_key: (!includes(data.target_url_key, '.html') ? `${data.target_url_key}.html` : data.target_url_key),
            category_id: data.category_id,
            url: data.img_link,
            company_code: (!isEmpty(data.target_company_code) ? data.target_company_code : (!isEmpty(this.props.companyCode)) ? this.props.companyCode : '')
          }
        }
        let itmData = {
          itm_source: 'PromoPage',
          itm_campaign: data.target_url_key
        }
        const params = {
          ProductDetailPage: { itemData: itemDetail.data, itmParameter: itmData },
          ProductCataloguePage: { itemDetail, itmData },
          TahuStatic: { itemDetail }
        }
        this.props.navigation.navigate(data.dir, params[data.dir])
      }
    }
  }

  renderImage (data) {
    const { isVisible, width } = this.state
    let newData = !isArray(data) ? [data] : data
    return (
      <View style={{ flexDirection: 'row', alignContent: 'center' }}>
        {map(newData, (val, key) =>
          <ShimmerPlaceHolder autoRun width={width} height={(width) / val.width * val.height} visible={isVisible.includes(key)} key={`data ${key}`} >
            <TouchableWithoutFeedback onPress={() => this.imageFeedback(val)}>
              <Image source={{ uri: val.img_src }} style={{ width: width, height: (width) / val.width * val.height }} onLoad={() => this.setState({ isVisible: [...isVisible, key] })} />
            </TouchableWithoutFeedback>
          </ShimmerPlaceHolder>
        )}
      </View>
    )
  }

  renderCarousel () {
    const { data } = this.props
    const { width } = this.state
    let newObject = maxBy(flattenDeep(data), 'height')
    return (
      <Swiper style={{ height: (width / newObject.width) * newObject.height }} autoplay={!__DEV__} loop>
        { map(data, (val, index) => (
          <View key={`banner ${index}`}>
            {this.renderImage(val)}
          </View>
        ))
        }
      </Swiper>
    )
  }

  renderCustomImageStatic (data) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        {map(data, (val, index) => {
          return (
            <TouchableWithoutFeedback key={`custom static image ${index}`} onPress={() => this.imageFeedback(val)}>
              <Image
                source={{ uri: val.img_src }}
                style={{ height: ((Dimensions.get('window').width / data.length) / val.width * val.height) }}
                flex={1}
                marginLeft={parseInt(val.marginLeft)}
                marginRight={parseInt(val.marginRight)}
                resizeMode='contain'
              />
            </TouchableWithoutFeedback>
          )
        })}
      </View>
    )
  }

  renderCustomImageSlider (data) {
    const { totalCustomSlider } = this.props
    let deviceWidth = Dimensions.get('window').width
    let width = deviceWidth / totalCustomSlider
    // if (this.props.halfImage) {
    //   width = (deviceWidth * 2) / ((totalCustomSlider * 2) + 1)
    // }
    const heightIndex0 = (width) / data[0].width * data[0].height
    return (
      <View style={{ width: Dimensions.get('window').width }}>
        <Carousel
          ref={(c) => { this._carousel = c }}
          data={data}
          contentContainerCustomStyle={{ alignItems: 'center', overflow: 'hidden', width: (Dimensions.get('window').width / totalCustomSlider) * data.length }}
          activeSlideAlignment={'start'}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          sliderWidth={deviceWidth}
          itemWidth={width}
          enableSnap
          renderItem={({ item }) => {
            return (
              <TouchableWithoutFeedback onPress={() => this.imageFeedback(item)}>
                <Image source={{ uri: item.img_src }} style={{ height: width / item.width * item.height }} />
              </TouchableWithoutFeedback>
            )
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', width: deviceWidth, top: ((heightIndex0 - 25) / 2) }}>
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 100, marginLeft: 5, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }} onPress={() => this._carousel.snapToPrev()}>
            <Icon name='chevron-left' size={20} color='#757886' />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 100, marginRight: 5, height: 25, width: 25, justifyContent: 'center', alignItems: 'center' }} onPress={() => this._carousel.snapToNext()}>
            <Icon name='chevron-right' size={20} color='#757886' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { type, data } = this.props
    return (
      <View>
        {includes(type, 'carousel')
          ? this.renderCarousel()
          : type === 'custom-image-static'
            ? this.renderCustomImageStatic(data)
            : type === 'custom-image-slider'
              ? this.renderCustomImageSlider(data)
              : this.renderImage(data)
        }
        <TahuTnc navigation={this.props.navigation} ref={(ref) => { this.tncModal = ref }} />
      </View>
    )
  }
}

export default WithContext(TahuImage)
