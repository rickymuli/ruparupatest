import { Component } from 'react'
import analytics from '@react-native-firebase/analytics'
// import * as Sentry from '@sentry/react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import has from 'lodash/has'

class HeadGtm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pageType: props.pageType
    }
  }

  componentDidMount () {
    analytics().setAnalyticsCollectionEnabled(true)
    this.setState({ pageType: this.props.pageType })
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (nextState.pageType === this.state.pageType) {
      return false
    } else {
      return true
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    const { pageType, productDetail, categoryDetail, auth } = nextProps
    let visitorEmail, customerID, gender, age
    if (auth && auth.user && auth.user.email) {
      visitorEmail = nextProps.auth.user.email
      customerID = nextProps.auth.user.customer_id
      gender = nextProps.auth.user.gender
      if (!isEmpty(nextProps.auth.user.birth_date)) {
        age = new Date().getFullYear() - new Date(nextProps.auth.user.birth_date).getFullYear()
      } else {
        age = 'none'
      }
      analytics().setUserProperties({
        visitorEmail,
        customerID,
        gender,
        age: age.toString()
      })
    }

    if (pageType) {
      analytics().setCurrentScreen(pageType)
      switch (pageType) {
        case 'product':
          if (has(productDetail, 'payload.variants[0]')) {
            const variant = productDetail.payload.variants[0]
            let metaPrice = variant.prices[0].special_price > 0 ? parseInt(variant.prices[0].special_price) : parseInt(variant.prices[0].price)
            let gtmDataLayer = {
              PageType: 'product_detail',
              productID: variant.sku,
              CriteoProductID: variant.sku,
              criteoPageType: 'ProductPage',
              email: visitorEmail,
              customerID,
              gender,
              age,
              product: {
                name: productDetail.payload.name,
                id: variant.sku,
                price: metaPrice,
                brand: productDetail.payload.brand.name.replace('\'', ''),
                category: productDetail.payload.categories[0].name
              }
            }
            analytics().logEvent('product_detail', gtmDataLayer)
            //  analytics().logEvent('view_item', { item_id: variant.sku, item_location_id: gtmDataLayer.product.category })
            // Sentry.addBreadcrumb({
            //   type: "current_screen",
            //   category: "view_item",
            //   data: gtmDataLayer
            // });
            analytics().logEvent('view_item', {
              currency: 'IDR',
              value: gtmDataLayer.product.price,
              items: [{
                item_id: gtmDataLayer.productID,
                item_brand: gtmDataLayer.product.brand || 'no-brand',
                item_name: gtmDataLayer.product.name,
                item_category: gtmDataLayer.product.category,
                price: gtmDataLayer.product.price
              }]
            })
          }
          break
        case 'category':
          const categoryData = (categoryDetail && categoryDetail.data) ? categoryDetail.data : null
          if (categoryData) {
            let gtmDataLayer = {
              PageType: 'product_catelog',
              CatID: categoryData.category_id,
              categoryKey: categoryData.url_key,
              email: visitorEmail,
              customerID,
              RTBProductList: 'productList',
              productIDList: 'productList'
            }
            analytics().logEvent('product_catalog', gtmDataLayer)
            // analytics().logEvent('view_item_list', { item_category: gtmDataLayer.categoryKey })
            // Sentry.addBreadcrumb({
            //   type: "navigation",
            //   category: "view_item",
            //   message: JSON.stringify(gtmDataLayer),
            //   level: Sentry.Severity.Info,
            // });
            analytics().logEvent('view_item_list', {
              item_list_id: gtmDataLayer.CatID,
              item_list_name: gtmDataLayer.categoryKey
            })
          }
          break
        default :
          let gtmDataLayer = {
            pageType,
            email: visitorEmail,
            customerID,
            gender,
            age
          }
          // Sentry.addBreadcrumb({
          //   type: "current_screen",
          //   category: pageType,
          //   data: JSON.stringify(gtmDataLayer)
          // });
          // Alert.alert('gtmDataLayer', gtmDataLayer)
          analytics().logEvent('view_pages', gtmDataLayer)
          break
      }
    }
    return null
  }

  render () {
    return null
  }
}

const stateToProps = (state) => ({
  productDetail: state.productDetail,
  categoryDetail: state.categoryDetail,
  auth: state.auth
})

export default connect(stateToProps)(HeadGtm)
