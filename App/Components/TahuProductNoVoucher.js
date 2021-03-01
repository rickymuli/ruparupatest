import React, { Component } from 'react'
import { View } from 'react-native'

// Components
import TahuVoucher from './TahuVoucher'

export default class TahuProductNoVoucher extends Component {
  render () {
    const { data, callSnackbar, toggleWishlist, navigation } = this.props
    return (
      <View>
        <TahuVoucher
          toggleWishlist={toggleWishlist}
          noVoucher
          navigation={navigation}
          titleLarge
          data={data}
          renderCount={data.inspiration_qty}
          callSnackbar={callSnackbar}
          fromTahu
        />
      </View>
    )
  }
}
