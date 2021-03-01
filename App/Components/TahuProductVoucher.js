import React from 'react'
import { View } from 'react-native'

// Components
import TahuVoucher from './TahuVoucher'

const TahuProductVoucher = (props) => {
  const { data, callSnackbar, toggleWishlist, navigation, orientation, useVoucher } = props
  return (
    <View>
      <TahuVoucher
        toggleWishlist={toggleWishlist}
        noVoucher={!useVoucher}
        navigation={navigation}
        orientation={orientation}
        titleLarge
        data={data}
        renderCount={data.inspiration_qty}
        callSnackbar={callSnackbar}
        hideShowMore
        fromTahu
      />
    </View>
  )
}

export default TahuProductVoucher
