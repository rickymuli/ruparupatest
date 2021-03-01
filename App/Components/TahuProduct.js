import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import Inspiration from './Inspiration'
import TahuVoucher from './TahuVoucher'
import StoreCategory from './StoreCategory'
import TahuProductNoVoucher from './TahuProductNoVoucher'
import TahuProductVoucher from './TahuProductVoucher'

// Components by type
const Components = {
  inspiration: Inspiration,
  voucher: TahuVoucher,
  product: TahuProductNoVoucher,
  'promo-brand': StoreCategory,
  'product-and-voucher': TahuProductVoucher
}

class TahuProduct extends Component {
  constructor (props) {
    super(props)
    this.state = {
      EventComponent: Components[props.type]
    }
  }

  render () {
    const { data, callSnackbar, toggleWishlist, navigation, orientation, useVoucher } = this.props
    const { EventComponent } = this.state
    if (!EventComponent) return null
    return (
      <View>
        <EventComponent
          toggleWishlist={toggleWishlist}
          navigation={navigation}
          titleLarge
          data={data}
          orientation={orientation}
          useVoucher={useVoucher}
          renderCount={data.inspiration_qty}
          callSnackbar={callSnackbar}
          fromTahu
        />
      </View>
    )
  }
}

export default TahuProduct
