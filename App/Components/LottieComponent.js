import React from 'react'
import { Animated, View, Dimensions, Text } from 'react-native'
import LottieView from 'lottie-react-native'
import { fonts } from '../Styles'

const { height } = Dimensions.get('window')
export default class LottieComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      progress: new Animated.Value(0)
    }
  }

  componentDidMount () {
    // Animated.timing(this.state.progress, {
    //   toValue: 1,
    //   duration: 500,
    //   easing: Easing.linear,
    // }).start();
  }

  getLottieAnimation () {
    const { notif, wishlist, notfound, buttonBlueLoading, loginRegisterPageFB, loginRegisterPageGoogle, addToCart, mainBannerPromoAnniv, simpleLoading } = this.props
    let urlLottie = require('../assets/images/Annimation-MobileApp/loading2-w500-h500.json')
    if (notif) {
      urlLottie = require('../assets/images/Annimation-MobileApp/notification-w800-h600.json')
    } else if (notfound) {
      urlLottie = require('../assets/images/Annimation-MobileApp/notfound-w750-h1334.json')
    } else if (buttonBlueLoading) {
      urlLottie = require('../assets/images/Annimation-MobileApp/loading-btn-orange.json')
    } else if (loginRegisterPageFB) {
      urlLottie = require('../assets/images/Annimation-MobileApp/loading-btn-facebook.json')
    } else if (loginRegisterPageGoogle) {
      urlLottie = require('../assets/images/Annimation-MobileApp/loading-btn-google.json')
    } else if (addToCart) {
      urlLottie = require('../assets/images/Annimation-MobileApp/loading-btn-gray.json')
    } else if (wishlist) {
      urlLottie = require('../assets/images/Annimation-MobileApp/wishlist-w148-h148.json')
    } else if (mainBannerPromoAnniv) {
      urlLottie = require('../assets/images/Annimation-MobileApp/mainbanner-mobile.json')
    } else if (simpleLoading) {
      urlLottie = require('../assets/images/Annimation-MobileApp/simple-loading.json')
    }
    return urlLottie
  }

  render () {
    const { style, noAutoPlay, noLoop, fullscreen, inlineText, customSize } = this.props
    let urlLottie = this.getLottieAnimation()
    return (
      <View style={[{ justifyContent: 'center', alignItems: 'center', flexDirection: inlineText ? 'row' : 'column' }, fullscreen ? { height, flex: 1 } : {}]}>
        <LottieView source={urlLottie} autoPlay={!noAutoPlay} loop={!noLoop} style={[{ height: customSize || 90, width: customSize || 100 }, style]} />
        {inlineText && <Text style={{ color: 'white', letterSpacing: 1.5, fontFamily: fonts.medium }}>{inlineText}</Text>}
      </View>
    )
  }
}
