import React, { Component } from 'react'
import { Image, TouchableWithoutFeedback, Platform, Dimensions, Alert } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'
import config from '../../config'

// Redux
import MiscActions from '../Redux/MiscRedux'

// Styles
const styles = {
  wrapper: {
    ...Platform.select({
      ios: {
        height: Dimensions.get('screen').height / 0.4
      },
      android: {
        height: 220
      }
    }),
    marginBottom: 15
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width: Dimensions.get('screen').width,
    flex: 1
  }
}
class PromoBank extends Component {
  constructor (props) {
    super(props)
    this.state = {
      promoBank: null,
      images: null,
      verifyStatic: null,
      changePage: false
    }
  }

  componentDidMount () {
    this.props.miscGetPromoBank(`promo-bank-${config.environment}`)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEmpty(nextProps.misc) && !isEmpty(nextProps.misc.promoBank) && !isEqual(nextProps.misc.promoBank, prevState.promoBank)) {
      return {
        promoBank: nextProps.misc.promoBank,
        images: null
      }
    } else if (!isEmpty(nextProps.misc.verifyStatic) && isEmpty(prevState.verifyStatic)) {
      return {
        verifyStatic: nextProps.misc.verifyStatic
      }
    } else {
      return null
    }
  }

  componentDidUpdate () {
    const { images, promoBank, verifyStatic, changePage } = this.state
    if (isEmpty(images) && !isEmpty(promoBank)) {
      this.getImages(promoBank.body_html)
    }
    if (!isEmpty(verifyStatic) && (verifyStatic.section === 'category' || verifyStatic.section === 'custom_category')) {
      if (changePage) {
        const itemDetail = {
          data: {
            url_key: verifyStatic.url_key
          },
          search: ''
        }
        this.setState({
          changePage: false
        }, () => { this.props.navigation.navigate('ProductCataloguePage', { itemDetail }) })
      }
    } else if (!isEmpty(verifyStatic) && verifyStatic.section === 'static page') {
      if (changePage) {
        this.setState({ changePage: false })
        Alert.alert('Alert!', 'This link will lead you to a static page which is still in Development. This alert will be removed after deployment')
      }
    }
  }

  getImages = (promoBankBodyHTML) => {
    let source = []
    let link = []
    let regexImgSource = /<img.*?src="([^">]*\/([^">]*?))".*?>/g
    let regexHref = /<a.*?href="([^">]*\/([^">]*?))".*?>/g
    let imageTemp
    while ((imageTemp = regexImgSource.exec(promoBankBodyHTML)) !== null) {
      source.push(imageTemp[1])
    }
    let hrefTemp
    while ((hrefTemp = regexHref.exec(promoBankBodyHTML))) {
      link.push(hrefTemp[1])
    }
    let images = []
    source.forEach((imageSource, index) => {
      images.push({ source: imageSource, link: link[index] })
    })
    this.setState({ images })
  }

  verifyStatic = (image) => {
    let urlKey = image.link.substring(config.baseURL.length, image.link.length)
    this.setState({
      verifyStatic: null,
      changePage: true
    }, () => {
      this.props.verifyStaticPage(urlKey)
    })
  }

  render () {
    const { images } = this.state
    const { misc } = this.props
    if (misc && misc.promoBank && misc.promoBank.body_html && images) {
      let autoPlay = !__DEV__
      let loop = true
      return (
        <Swiper
          style={styles.wrapper}
          autoplay={autoPlay}
          loop={loop}>
          {images.map((image, index) => (
            <TouchableWithoutFeedback onPress={() => this.verifyStatic(image)} style={styles.slide} key={`promo bank ${index}`}>
              <Image style={styles.image} source={{ uri: image.source }} />
            </TouchableWithoutFeedback>
          ))}
        </Swiper>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  misc: state.misc
})

const mapDispatchToProps = (dispatch) => ({
  verifyStaticPage: (pageData) => dispatch(MiscActions.miscVerifyStaticRequest(pageData)),
  miscGetPromoBank: (identifier) => dispatch(MiscActions.miscPromoBankRequest(identifier))
})

export default connect(mapStateToProps, mapDispatchToProps)(PromoBank)
