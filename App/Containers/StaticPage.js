import React, { Component } from 'react'
import { View, Platform, Linking } from 'react-native'
import { WebView } from 'react-native-webview'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'
import config from '../../config'

// Redux
import MiscActions from '../Redux/MiscRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
// import LottieComponent from '../Components/LottieComponent'

class StaticPage extends Component {
  constructor () {
    super()
    this.state = {
      url: '',
      pageName: '',
      itemDetail: null,
      redirect: false,
      dir: null,
      urlKey: null,
      canGoBack: false,
      loading: true
    }
  }

  componentDidMount () {
    this.props.miscGetStaticUrlRequest()
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    let itemDetail = props.route.params?.itemDetail ?? 'nothing found...'
    if (!isEqual(itemDetail, state.itemDetail)) {
      let url = ''
      if (!isEmpty(itemDetail)) {
        url = itemDetail.data.url_key
      }
      let pageName = url.substring(config.baseURLmobile.length, url.length).split('?')[0] || ''
      returnObj = {
        itemDetail: props.route.params?.itemDetail ?? 'nothing found...',
        url,
        pageName
      }
    }
    if (!isEmpty(props.misc.verifyStatic) && !state.redirect) {
      let dir = ''
      if (props.misc.verifyStatic.section.includes('category')) {
        dir = 'ProductCataloguePage'
      } else if (props.misc.verifyStatic.section.includes('product')) {
        dir = 'ProductDetailPage'
      } else if (props.misc.verifyStatic.section.includes('promo_page')) {
        dir = 'PromoPage'
      } else if (props.misc.verifyStatic.section.includes('static')) {
        dir = 'StaticPage'
      }
      returnObj = {
        redirect: true,
        dir,
        urlKey: props.misc.verifyStatic.url_key
      }
    }
    return returnObj
  }

  componentDidUpdate () {
    if (this.state.redirect && !isEmpty(this.state.dir) && !isEmpty(this.state.urlKey)) {
      this.props.miscVerifyStaticInit()
      let param = {}
      if (this.state.dir === 'ProductDetailPage') {
        param = {
          ...param,
          itemData: {
            url_key: (this.state.urlKey.includes('.html')) ? this.state.urlKey : `${this.state.urlKey}.html`
          }
        }
      } else {
        param = {
          ...param,
          itemDetail: {
            data: {
              url_key: this.state.urlKey
            },
            search: ''
          }
        }
      }
      this.props.navigation.navigate(this.state.dir, { ...param })
      this.setState({
        redirect: false,
        urlKey: null,
        dir: null
      })
    }
  }

  componentWillUnmount () {
    this.staticWebView = null
  }

  refreshWebView = () => {
    this.staticWebView.reload()
  }

  goback = () => {
    const { canGoBack } = this.state
    if (canGoBack) {
      this.staticWebView.goBack()
    } else {
      this.props.navigation.goBack()
    }
  }

  shouldStartLoad = ({ url, canGoBack }) => {
    if (!isEmpty(url)) {
      let staticPage = false
      this.props.misc.staticUrl.map(urlStatic => {
        if (url.includes(urlStatic)) {
          staticPage = true
        }
      })
      // If True it will start to load and will not load if it returns False. Documentation: https://james1888.github.io/posts/react-native-prevent-webview-redirect/
      if (url.includes(`${config.baseURLmobile}${this.state.pageName}`) || staticPage) {
        return true
      } else {
        if (url.includes('/informa') || url.includes('/ace')) {
          Linking.openURL(url)
        }
        let urlKey = url.substring(config.baseURLmobile.length, url.length)
        if (!url.includes(`/${this.state.pageName}`)) {
          // this.staticWebView.stopLoading()
          this.props.miscVerifyStaticRequest(urlKey)
        }
        return false
      }
    }
  }

  _onNavigationStateChange = (e) => {
    this.setState({ canGoBack: e.canGoBack })
  }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <HeaderSearchComponent search back navigation={this.props.navigation} refresh leftAction={this.goback.bind(this)} rightAction={this.refreshWebView.bind(this)} />
        {!isEmpty(this.state.url)
          ? <WebView
            androidHardwareAccelerationDisabled
            ref={ref => { this.staticWebView = ref }}
            source={{ uri: this.state.url }}
            style={{ flex: 1 }}
            onNavigationStateChange={this._onNavigationStateChange}
            userAgent={Platform.OS}
            onShouldStartLoadWithRequest={this.shouldStartLoad}
          />
          : null
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  misc: state.misc
})

const mapDispatchToProps = (dispatch) => ({
  miscVerifyStaticRequest: (data) => dispatch(MiscActions.miscVerifyStaticRequest(data)),
  miscVerifyStaticInit: () => dispatch(MiscActions.miscVerifyStaticInit()),
  miscGetStaticUrlRequest: () => dispatch(MiscActions.miscGetStaticUrlRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(StaticPage)
