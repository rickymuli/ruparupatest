import React, { Component } from 'react'
import { Image, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'
import config from '../../config'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

// Redux
import CategoryDetailActions from '../Redux/CategoryDetailRedux'
import MiscActions from '../Redux/MiscRedux'

const { height, width } = Dimensions.get('window')

const styles = {
  wrapper: {
    ...Platform.select({
      ios: {
        height: height / 3.6
      },
      android: {
        height: 200
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
    width,
    flex: 1
  }
}

class Carousel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      images: props.images,
      isCategory: false,
      verifyStatic: props.misc.verifyStatic || null,
      changeNavigation: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEmpty(nextProps.misc.verifyStatic) && !nextProps.misc.fetching && !isEqual(nextProps.misc.verifyStatic, prevState.verifyStatic)) {
      return {
        verifyStatic: nextProps.misc.verifyStatic
      }
    }
    if (!isEmpty(nextProps.images) && !isEqual(nextProps.images, prevState.images)) {
      return {
        images: nextProps.images
      }
    } else {
      return null
    }
  }

  componentDidUpdate () {
    // Error max update depth bisa di sini!
    const { verifyStatic, changeNavigation } = this.state
    if (!isEmpty(verifyStatic) && changeNavigation) {
      if (verifyStatic.section === 'category') {
        this.setState({
          isCategory: true
        }, () => {
          if (this.state.changeNavigation) {
            let urlKey = this.state.verifyStatic.url_key
            if (!urlKey.includes('.html')) {
              urlKey = urlKey + '.html'
            }
            let itemDetail = {
              data: {
                url_key: urlKey
              },
              search: ''
            }
            this.props.miscVerifyStaticInit()
            this.props.navigation.navigate('ProductCataloguePage', {
              itemDetail
            })
            this.setState({ isCategory: false, changeNavigation: false, verifyStatic: null })
          }
        })
      } else {
        // Goes to static page
        this.setState({
          isCategory: false,
          changeNavigation: false,
          verifyStatic: null
        })
      }
    }
  }

  configureToPCP = (banner) => {
    let data = banner.banner_url.substring(config.baseURL.length, banner.banner_url.length)
    let categoryData = data.split('/')
    let pageData = categoryData[categoryData.length - 1]?.split('?') || ''
    let finalData = ''
    if (categoryData.length > 1) {
      categoryData.forEach((category, index) => {
        if (index !== categoryData.length - 1) {
          finalData = finalData + category + '/'
        } else {
          finalData = finalData + pageData[0]
        }
      })
    } else {
      finalData = pageData[0]
    }
    this.setState({
      changeNavigation: true
    }, () => {
      this.props.verifyStaticPage(finalData)
    })
  }

  /* Carousel Component. Accepts props name images */
  render () {
    if (this.state.images.fetching || this.state.images.banner === null) {
      return null
    } else if (!this.state.images.fetching && this.state.images.banner !== null) {
      let autoPlay = !__DEV__
      let loop = Platform.OS !== 'ios'
      return (
        <Swiper
          style={styles.wrapper}
          autoplay={autoPlay}
          loop={loop}>
          {this.state.images.banner.map((image, index) => (
            <TouchableWithoutFeedback onPress={() => this.configureToPCP(image)} style={styles.slide} key={`imageTopCarousel${index}`}>
              <Image style={styles.image} source={{ uri: image.banner_image }} />
            </TouchableWithoutFeedback>
          ))}
        </Swiper>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  categoryDetail: state.categoryDetail,
  misc: state.misc
})

const mapDispatchToProps = (dispatch) => ({
  fetchCategoryDetail: (urlKey) => dispatch(CategoryDetailActions.categoryDetailRequest(urlKey)),
  verifyStaticPage: (pageData) => dispatch(MiscActions.miscVerifyStaticRequest(pageData)),
  miscVerifyStaticInit: () => dispatch(MiscActions.miscVerifyStaticInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(Carousel)
