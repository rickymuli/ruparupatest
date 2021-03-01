import React, { Component } from 'react'
import { View, Platform, Alert, Dimensions, Linking, Modal, DeviceEventEmitter } from 'react-native'
import { WebView } from 'react-native-webview'
// import Icon from 'react-native-vector-icons/FontAwesome'
import config from '../../config'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import get from 'lodash/get'
import { trackPurchase, trackEmptyCart } from '../Services/Emarsys'
import analytics from '@react-native-firebase/analytics'
import Toast from 'react-native-easy-toast'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import { NumberWithCommas } from '../Utils/Misc'
import Lottie from '../Components/LottieComponent'
// import HandleBack from '../Components/Back'

// Redux
import CartActions from '../Redux/CartRedux'
import ReorderActions from '../Redux/ReorderRedux'
import OrderActions from '../Redux/OrderRedux'
import RatingStore from '../Components/RatingStore'

// const WEBVIEW_REF = 'paymentWebview'

const { height } = Dimensions.get('screen')
class PaymentPage extends Component {
  link = {
    'prod': config.paymentURL,
    'stg': config.stgPaymentURL,
    'dev': config.devPaymentURL
  }

  constructor (props) {
    super(props)
    this.hardwareBackPress = DeviceEventEmitter.removeAllListeners('hardwareBackPress')
    this.state = {
      checkoutLink: this.link[config.developmentENV] + '?token=' + ((props.route && props.route.params && props.route.params.cart_id && props.route.params.from === 'ConfirmationReorder') ? props.route.params.cart_id : props.cart.data.cart_id + props.route.params?.utmParameter ?? ''),
      canGoBack: false,
      canGoHome: false,
      isEmarsysLogged: false,
      isReorder: false,
      isDone: false
    }
  }

  componentDidMount () {
    let email = 'guest'
    let customerID
    if (!isEmpty(this.props.auth.user)) {
      email = this.props.auth.user.email
      customerID = this.props.auth.user.customer_id
    }
    let gtmDataLayer = {
      PageType: 'payment',
      email,
      customerID
    }
    this.webView.reload()
    analytics().logEvent('payment_page', gtmDataLayer)
    this.hardwareBackPress = DeviceEventEmitter.addListener('hardwareBackPress', () => this.goback())
    // Alert.alert('utmParameter', this.state.checkoutLink)
  }

  componentWillUnmount () {
    // this.props.cartRequest()
    if (this.props.route.params.from === 'ConfirmationReorder') {
      this.props.reorderCartInit()
      this.props.reorderInit()
      this.props.navigation.navigate('Order', { data: { from: 'Confirmation' } })
      // this.props.getOrderList()
      // this.props.navigation.reset({
      //   routes: [{ name: 'PaymentPage' }]
      // })
    }
    if (this.state.canGoHome) this.props.getOrderList()
    this.hardwareBackPress = null
  }

  _onNavigationStateChange = (webViewState) => {
    console.log({ webViewState })
    let url = webViewState.url
    const { reorder } = this.props
    if (url.includes('terms-conditions')) { // Condition to send back to a specific page in the app
      this.webView.stopLoading()
      Linking.openURL(url)
      // let res = url.split('/') // res[last-1] = Directory App Navigation; res[last] = url key
      // let dir = res[res.length - 2]
      // let urlKey = res[res.length - 1]
      // let itemDetail = {
      //   data: {
      //     url_key: urlKey
      //   },
      //   search: ''
      // }
      // this.props.navigation.navigate(dir, { itemDetail })
    }
    if (url.includes('thankyou')) this.ratingStore.checkRating()
    let paymentLink = (config.developmentENV === 'prod') ? 'https://payment.' : (this.link[config.developmentENV]).replace('/checkout', '')
    if (!url.includes(paymentLink) && !url.includes('https://accounts.google.') && !url.includes('gopay') && !url.includes('terms-conditions') && !url.includes('https://reorder.payment.')) {
      this.webView.stopLoading()
      if (includes(url, '.html')) {
        let baseURLmobile = config.baseURLmobile
        if (config.developmentENV === 'stg') {
          baseURLmobile = 'https://www.stg.ruparupa.io/'
        }
        let itemData = {
          url_key: url.replace(baseURLmobile, '')
        }
        let itmParameter = {
          itm_source: 'PaymentPage',
          itm_campaign: 'payment'
        }
        this.props.navigation.navigate('ProductDetailPage', { itemData, itmParameter })
      } else {
        // this._handleAnalytic(this.props.cart)
        this.props.navigation.navigate('Homepage')
        this.props.cartRequest()
        this.props.getOrderList()
      }
    } else if (url.includes('verification?page=otp')) {
      this.props.navigation.goBack()
      // } else if (url.includes('mobileapps')) { // Condition to send back to a specific page in the app
      //   this.webView.stopLoading()
      //   let res = url.split('/') // res[last-1] = Directory App Navigation; res[last] = url key
      //   let dir = res[res.length - 2]
      //   let urlKey = res[res.length - 1]
      //   let itemDetail = {
      //     data: {
      //       url_key: urlKey
      //     },
      //     search: ''
      //   }
      //   this.props.navigation.navigate(dir, { itemDetail })
    } else if (!isEmpty(reorder.cartData) || this.props.route.params.from === 'ConfirmationReorder') {
      this.setState({
        isReorder: true
      })
    } else {
      let canGoHome = (url).indexOf('thankyou') !== -1
      if (canGoHome) analytics().logEvent('thankyou_page')
      if (canGoHome && get(this.props.storeNewRetail, 'data.store_code')) {
        this.props.resetCart()
      }
      if (canGoHome && !this.state.isEmarsysLogged) {
        this.setState({ isEmarsysLogged: true })
        trackPurchase(this.props.cart.data.reserved_order_no, this.props.cart.data.items)
        trackEmptyCart()
      }
      this.setState({
        canGoBack: webViewState.canGoBack,
        canGoHome
      })
    }
  }

  refreshWebView = () => {
    this.webView.reload()
  }

  voucherCheck = (res) => {
    const { canGoHome, isDone, canGoBack } = this.state
    const response = res.data.data
    const voucherData = JSON.parse(response.gift_cards)
    const lastVoucher = voucherData[voucherData.length - 1]
    let voucherName = ''
    let voucherAmount = ''
    if (response.gift_cards_amount !== 0 || response.discount_amount !== 0) {
      if (response.gift_cards_amount !== 0) {
        voucherName = ''
        voucherAmount = response.gift_cards_amount
        if (response.discount_amount !== 0) {
          voucherAmount = response.gift_cards_amount + response.discount_amount
        }
        if (lastVoucher.voucher_type === 1) {
          voucherName = 'Registrasimu'
        } else if (lastVoucher.voucher_type === 2) {
          voucherName = 'Refundmu'
        } else if (lastVoucher.voucher_type === 3) {
          voucherName = 'Diskonmu'
        } else if (lastVoucher.voucher_type === 4) {
          voucherName = 'Cashback'
        } else if (lastVoucher.voucher_type === 5) {
          voucherName = 'Redeem'
        } else if (lastVoucher.voucher_type === 6) {
          voucherName = 'New Retail'
        } else {
          voucherName = 'Diskonmu'
        }
      } else if (response.discount_amount !== 0) {
        voucherName = 'Diskonmu'
        voucherAmount = response.discount_amount
      }
      if (isDone === false && !canGoHome) {
        this.alertDiscount(voucherName, voucherAmount)
      } else if (canGoBack && !canGoHome) {
        this.webView.goBack()
      } else {
        this.props.navigation.goBack()
      }
    } else if (canGoBack && !canGoHome) {
      this.webView.goBack()
    } else {
      this.props.navigation.goBack()
    }
  }

  goback = () => {
    const { canGoHome, isReorder } = this.state
    this.props.cartRequest(null, this.voucherCheck)
    if (isReorder) {
      this.props.reorderCartInit()
      this.props.navigation.navigate('Order', { data: { from: 'Confirmation' } })
    } else if (canGoHome) {
      this.props.getOrderList()
      this.props.navigation.navigate('Homepage', { screen: 'Home' })
    }
    return true
  }

  alertDiscount (voucherName, voucherAmount) {
    Alert.alert(
      'Keluar halaman ini?',
      'Tunggu dulu, Kamu bisa dapat potongan Rp' + NumberWithCommas(voucherAmount) + ' dari voucher ' + voucherName + ' loh jika lanjut.',
      [
        { text: 'Kembali', onPress: () => this.props.navigation.goBack() },
        { text: 'Lanjut Transaksi' }
      ]
    )
    this.setState({ isDone: true })
    return true
  }

  alertErr () {
    Alert.alert(
      'Pesan',
      'Terjadi Kesalahan Koneksi',
      [
        { text: 'Kembali' },
        { text: 'Coba lagi', onPress: () => this.refreshWebView() }
      ]
    )
  }

  render () {
    const { checkoutLink } = this.state
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <HeaderSearchComponent back pageName={'Pembayaran'} refresh leftAction={this.goback.bind(this)} rightAction={this.refreshWebView.bind(this)} navigation={this.props.navigation} />
        <WebView
          ref={ref => { this.webView = ref }}
          source={{ uri: checkoutLink }}
          style={{ flex: 1 }}
          onNavigationStateChange={this._onNavigationStateChange}
          userAgent={Platform.OS}
          // renderLoading={() => <Lottie />}
          onError={() => this.alertErr()}
          renderError={(e) => <View style={{ backgroundColor: 'white', height }} />}
        />
        <Toast
          ref='toast'
          style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
          position='top'
          positionValue={0}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        />
        {(this.props.cart.fetching === true)
          ? <Modal
            animationType='fade'
            transparent
            visible={this.props.cart.fetching}
          >
            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.7)' }}>
              <Lottie />
            </View>
          </Modal>
          : null
        }
        <RatingStore ref={ref => (this.ratingStore = ref)} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  auth: state.auth,
  cart: state.cart,
  reorder: state.reorder
})

const mapDispatchToProps = (dispatch) => ({
  reorderCartInit: () => dispatch(ReorderActions.reorderCartInit()),
  cartRequest: (data, callback) => dispatch(CartActions.cartRequest(data, callback)),
  getOrderList: () => dispatch(OrderActions.orderListRequest()),
  resetCart: () => dispatch(CartActions.cartTypeRequest()),
  reorderInit: () => dispatch(ReorderActions.reorderInit())

})

export default connect(mapStateToProps, mapDispatchToProps)(PaymentPage)
