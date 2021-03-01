import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import config from '../../config.js'
import { fonts, PrimaryText } from '../Styles'

class FreeShipping extends Component {
  constructor (props) {
    super(props)
    this.state = {
      stock: props.productDetail.stock || null,
      categories: props.productDetail.payload.categories || null
    }
  }

  componentWillReceiveProps (newProps: any) {
    const { productDetail } = newProps
    this.setState({
      stock: productDetail.stock,
      categories: productDetail.payload.categories
    })
  }

  renderFreeShipping = () => {
    const { stock, categories } = this.state
    const { activeVariant: variant } = this.props

    const price = (variant && variant.prices && Array.isArray(variant.prices) && variant.prices.length > 0) ? variant.prices[0] : null

    // check stock delivery and store fullfillment
    // DC,pickup_livingworld,pickup_qbig_bsd,pickup_supermall_karawaci
    let deliveryAndStorefullfillment = ['', 'pickup_livingworld', 'pickup_qbig_bsd', 'pickup_supermall_karawaci']
    if (config.freeShippingJabodetabek) {
      deliveryAndStorefullfillment = config.freeShippingJabodetabek.split(',')
    }
    let checkDeliveryJabodetabek = false

    let containerFreeShippingCategory = this.renderFreeShippingCategory()
    containerFreeShippingCategory = containerFreeShippingCategory.join(', ')
    if (stock) {
      for (let i = 0; i < stock.location.length; i++) {
        if (deliveryAndStorefullfillment.indexOf(stock.location[i].pickup_code) !== -1 && stock.location[i].qty > 0) {
          checkDeliveryJabodetabek = true
          break
        }
      }
    }

    let freeShippingCategory = config.freeShippingCategory.split(',')
    let checkCategoryIsInStock = null

    if (price && price.special_price) {
      if (price.special_price >= 500000 && checkDeliveryJabodetabek === true) {
        if (containerFreeShippingCategory.length > 0) {
          return 'Jabodetabek, ' + containerFreeShippingCategory
        } else {
          return 'Jabodetabek'
        }
      } else {
        if (categories) {
          categories.map(function (categoryIsInStock) {
            if (freeShippingCategory.indexOf(String(categoryIsInStock.category_id)) !== -1 && categoryIsInStock.is_in_stock === 1) {
              checkCategoryIsInStock = containerFreeShippingCategory
            }
          })
        }
        return checkCategoryIsInStock
      }
    } else if (price && price.price && price.price >= 500000 && checkDeliveryJabodetabek === true) {
      if (containerFreeShippingCategory.length > 0) {
        return 'Jabodetabek, ' + containerFreeShippingCategory
      } else {
        return 'Jabodetabek'
      }
    } else {
      if (categories) {
        categories.map(function (categoryIsInStock) {
          if (freeShippingCategory.indexOf(String(categoryIsInStock.category_id)) !== -1 && categoryIsInStock.is_in_stock === 1) {
            checkCategoryIsInStock = containerFreeShippingCategory
          }
        })
      }
      return checkCategoryIsInStock
    }
  }

  renderFreeShippingCategory = () => {
    const { categories } = this.state
    let freeShippingCategory = config.freeShippingCategory.split(',')
    let freeShipping
    let container = ''

    if (categories) {
      freeShipping = categories.filter(function (categoryIsInStock) {
        return freeShippingCategory.indexOf(String(categoryIsInStock.category_id)) !== -1
      })
    }
    if (freeShipping) {
      return freeShipping.map(function (category, index) {
        switch (String(category.category_id)) {
          case freeShippingCategory[0]:
            container = 'Surabaya'
            break
          case freeShippingCategory[1]:
            container = 'Bali'
            break
          case freeShippingCategory[2]:
            container = 'Medan'
            break
          case freeShippingCategory[3]:
            container = 'Makassar'
            break
          case freeShippingCategory[4]:
            container = 'Surabaya, Bandung'
            break
          default:
            container = ''
        }
        return container
      })
    } else {
      return container
    }
  }

  render () {
    const { stock } = this.state

    if (stock === null || typeof stock === 'undefined' || stock.global_stock_qty === 0) {
      return null
    }

    let freeShipping = this.renderFreeShipping()
    if (freeShipping) {
      if (freeShipping === 'Jabodetabek') {
        // return (
        //   <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
        //     <Image source={require('../assets/images/icon/free-shipping-pdp.webp')} style={{ width: 30, height: 30, marginRight: 5 }} />
        //     <View>
        //       <Text style={{ fontSize: 12, fontFamily: fonts.regular }}>Free Shipping</Text>
        //       <Text style={{ fontSize: 12, fontFamily: fonts.regular }}>{freeShipping}</Text>
        //     </View>
        //   </View>
        // )
        return (
          <View style={{ backgroundColor: '#E5F7FF', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, marginTop: 4 }}>
            <Image style={{ width: 50, height: 50, marginRight: 6 }} source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1572424232/2.1/courier/free-delivery-pdp_3x.webp' }} />
            <PrimaryText style={{ fontSize: 12, flexWrap: 'wrap', flex: 1 }}>Free Delivery area {freeShipping} dengan min pembelanjaan Rp. 500.000*</PrimaryText>
          </View>
        )
      } else {
        return (
          <View>
            <Text style={{ fontSize: 12, fontFamily: fonts.regular }}>Free Shipping</Text>
            <Text style={{ fontSize: 12, fontFamily: fonts.regular }}>{freeShipping}</Text>
          </View>
        )
      }
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => ({
  productDetail: state.productDetail
})

export default connect(mapStateToProps)(FreeShipping)
