import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { ButtonSecondaryOutlineM, ButtonSecondaryOutlineText, FontSizeM } from '../Styles/StyledComponents'

// Components
import RefundStatusImageList from '../Components/RefundStatusImageList'

export default class RefundStatusImage extends Component {
  constructor () {
    super()
    this.state = {
      showImage: false
    }
  }

  setImageForEdit = (item) => {
    let data = {
      images: item.item.images,
      customerId: item.customer_id,
      refundNo: item.refund_no,
      refundItemId: item.item.refund_item_id,
      qtyRefunded: item.item.qty_refunded,
      promoItems: item.item.promo_items,
      customerEmail: item.customer_email,
      orderNo: item.order_no
    }
    this.props.navigation.navigate('EditRefundStatusImagePage', { data })
  }

  render () {
    const { item } = this.props
    return (
      <>
        <TouchableOpacity onPress={() => this.setState({ showImage: !this.state.showImage })}>
          <View style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }} >
            <FontSizeM>Foto produk yang diunggah</FontSizeM>
            <Icon name={`chevron-${(this.state.showImage) ? 'up' : 'down'}`} size={20} />
          </View>
        </TouchableOpacity>
        {(this.state.showImage)
          ? <>
            <RefundStatusImageList navigation={this.props.navigation} images={item.item.images} />
            {(item.status === 'new')
              ? <ButtonSecondaryOutlineM onPress={() => this.setImageForEdit(item)}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name='pencil' color='#008CCF' />
                  <ButtonSecondaryOutlineText>Ubah Foto</ButtonSecondaryOutlineText>
                </View>
              </ButtonSecondaryOutlineM>
              : null
            }
            </>
          : null
        }
      </>
    )
  }
}
