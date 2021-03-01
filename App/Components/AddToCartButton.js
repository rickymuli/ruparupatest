import React, { Component } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import find from 'lodash/find'
import messaging from '@react-native-firebase/messaging'
import analytics from '@react-native-firebase/analytics'
import { trackAlgoliaConvert } from '../Services/AlgoliaAnalytics'

// Context
import { WithContext } from '../Context/CustomContext'

// Component
import AddToCartMini from './AddToCartMini'
import AddToCartPdp from './AddToCartPdp'
import { trackCart } from '../Services/Emarsys'

// Redux Action
import CartActions from '../Redux/CartRedux'
import MemberAction from '../Redux/MemberRegistrationRedux'

class AddToCartButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      snackbar: false,
      isProductScanned: props?.route?.params?.isScanned ?? false,
      showLoading: false
    }
  }

  componentDidUpdate (prevProps, prevState) {
    const { cart, callSnackbarWithAction, callSnackbar, navigation, activeVariant } = this.props
    const { snackbar } = this.state
    if (prevProps.cart.fetching !== cart.fetching) {
      if (!cart.fetching) { this.setState({ showLoading: false }) }
    }
    if (prevProps.cart !== cart && !cart.fetching && snackbar) {
      if (get(cart.data, 'errors.data')) {
        let errItem
        let errData = get(cart.data, 'errors.data') || {}
        if (errData.type === 'items') {
          errItem = find(errData.items, ['sku', activeVariant.sku])
          if (!errItem && callSnackbarWithAction) {
            callSnackbarWithAction('Tidak bisa menambahkan ke cart', 'Lihat Cart', 'error', () => navigation.navigate('CartPage'))
          }
        }
      } else {
        if (cart.err && callSnackbar) {
          callSnackbar(cart.err, 'error')
        } else if (callSnackbarWithAction) {
          callSnackbarWithAction('Berhasil menambahkan ke cart', 'Lihat Cart', () => navigation.navigate('CartPage'))
        }
      }
      this.setState({ snackbar: false })
    }
  }

  getValue = (qty = 0) => {
    const { activeVariant } = this.props
    const price = get(activeVariant, 'prices[0].price', 0)
    const specialPrice = get(activeVariant, 'prices[0].special_price', 0)
    if (specialPrice > 0) return specialPrice * qty
    return price * qty
  }

  _handleAnalytic = (data) => {
    const { route } = this.props
    // firebase analytic add_to_cart
    let itemData = route?.params?.itemData ?? {}
    let dataitems = data.items[0] ?? {}
    let addToCartData = {
      value: this.getValue(dataitems.qty_ordered),
      currency: 'IDR',
      items: [{
        item_id: dataitems.sku,
        item_brand: itemData?.brand?.name || 'no-brand',
        item_name: itemData.name,
        item_category: dataitems.utm_parameter,
        quantity: dataitems.qty_ordered
      }]
    }
    analytics().logEvent('add_to_cart', addToCartData)
  }

  onClickBuyNow = async (params = {}) => {
    if (this.props.page === 'memberUpgrade') {
      this.props.cartSuccess(true)
    }
    const { quantity, activeVariant, itmData = {}, storeCodeNewRetail, page, algoliaTrackHit = null } = this.props
    const {
      deliveryMethod = page === 'memberUpgrade' ? 'pickup' : 'delivery',
      pickupCode = '',
      storeCode = page === 'memberUpgrade' ? 'A300' : '' } = params
    let utmParameter = ''
    if (page === 'memberUpgrade') {
      utmParameter = this.props.utmParameter
    }
    if (itmData.utm_source) utmParameter = `utm_source=${itmData.utm_source}&utm_campaign=${itmData.utm_campaign}&utm_medium=${itmData.utm_medium}`
    else if (itmData.itm_source) {
      utmParameter = `itm_source=${itmData.itm_source}&itm_campaign=${itmData.itm_campaign}&itm_term=${itmData.itm_term || activeVariant.sku}`
    }

    const deviceToken = await messaging().getToken()
    let isProductScanned = this.state.isProductScanned// let isProductScanned = navigation.getParam('isScanned', false)
    const data = {
      device_token: deviceToken,
      store_code_new_retail: storeCodeNewRetail,
      items: [
        {
          sku: activeVariant.sku,
          qty_ordered: Number(quantity),
          is_product_scanned: isProductScanned ? 10 : 0,
          utm_parameter: utmParameter,
          shipping: {
            pickup: {
              pickup_code: pickupCode
            },
            delivery_method: deliveryMethod,
            store_code: storeCode
          }
        }
      ]
    }
    this.setState({ snackbar: true, showLoading: true }, () => this.props.cartUpdateRequest(data))
    const emarsysCart = (this.props.cart.data) ? this.props.cart.data.items : []
    trackCart(emarsysCart, { itemId: activeVariant.sku, unit: Number(quantity), price: page === 'memberUpgrade' ? 100000 : ((get(activeVariant, 'prices[0].price')) * Number(quantity)) })
    // itmParameter
    let itmDataAnalytics = {
      quantity: data.items[0].qty_ordered,
      item_category: data.items[0].utm_parameter,
      item_id: data.items[0].sku,
      price: get(activeVariant, 'prices[0].price')
    }
    if (page) analytics().logEvent(`add_to_cart_from_${page || 'unknown'}`, itmDataAnalytics)
    this._handleAnalytic(data)
    if (this.props.modalHide) {
      this.props.modalHide(false)
    }
    if (algoliaTrackHit) trackAlgoliaConvert(algoliaTrackHit)
  }

  render () {
    const { buttonText, activeVariant, page, route, stock, cart } = this.props

    return (
      <>
        {page
          ? <AddToCartMini
            activeVariant={activeVariant}
            buttonText={buttonText}
            page={page}
            stock={stock}
            onClickBuyNow={this.onClickBuyNow.bind(this)}
            route={route}
            cart={cart}
            loading={this.state.showLoading}
            goToPage={this.props.memberReg.cartSuccess}
          />
          : <AddToCartPdp onClickBuyNow={this.onClickBuyNow.bind(this)} route={route} />
        }
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  storeCodeNewRetail: get(state.storeNewRetail.data, 'store_code', ''),
  memberReg: state.memberRegistration
})

const dispatchToProps = (dispatch) => ({
  cartUpdateRequest: (data) => dispatch(CartActions.cartUpdateRequest(data)),
  cartSuccess: (params) => dispatch(MemberAction.memberRegCartSuccess(params))
})

export default WithContext(connect(mapStateToProps, dispatchToProps)(AddToCartButton))
