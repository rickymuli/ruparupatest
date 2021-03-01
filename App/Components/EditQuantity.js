import React, { Component } from 'react'
import { Text, View, Image, Dimensions } from 'react-native'
// import config from '../../config'
import Number from './NumberInput'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import { WithContext } from '../Context/CustomContext'
import EasyModal from './EasyModal'
import { fonts, PrimaryText } from '../Styles'

import { TouchableOpacity } from 'react-native-gesture-handler'

const { width } = Dimensions.get('screen')
class EditQuantity extends Component {
  constructor (props) {
    super(props)
    this.modal = null
    this.state = {
      maxStock: 0
    }
  }

  renderLogo () {
    const { isLowestPrice } = this.props
    if (isLowestPrice) {
      return (
        <TouchableOpacity onPress={() => this.modal.setModal(true)} style={{ width: width * 0.3, flexDirection: 'row', justifyContent: 'center' }}>
          <View style={{ flex: 1 }}>
            <Image source={{ uri: 'https://res.cloudinary.com/ruparupa-com/image/upload/v1593757518/invalid_voucher_blocfv.png' }} style={{ height: width * 0.2 / 361 * 181 }} resizeMode='contain' />
          </View>
          <PrimaryText style={{ flex: 2, flexWrap: 'wrap', alignSelf: 'center' }}>Voucher tidak berlaku</PrimaryText>
        </TouchableOpacity>
      )
      // } else if (!isEmpty(ownFleet)) {
      // let image = ownFleet === 'AHI' ? require('../assets/images/delivery-logo/delivery-ace.webp') : require('../assets/images/delivery-logo/delivery-informa.webp')
      // return <Image source={image} style={{ width: width * 0.3, height: width * 0.3 / 361 * 181 }} />
      // } else if (config.enableGosend && activeVariant && activeVariant.can_gosend && activeVariant.can_gosend.length > 0 && canDelivery && canDelivery.can_delivery_gosend) {
      //   return <Image source={require('../assets/images/delivery-logo/gosend.webp')} style={{ width: width * 0.3, height: width * 0.3 / 361 * 181 }} />
    } else {
      return null
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEmpty(nextProps.maxStock) && !isEqual(nextProps.maxStock, prevState.maxStock)) {
      return {
        maxStock: nextProps.maxStock.max_stock
      }
    }
    return null
  }

  componentDidMount () {
    this.GetMaxStock()
  }

  componentDidUpdate (prevProps, prevState) {
    const { payload, fetchingMaxStock, activeVariant } = this.props
    if ((payload !== prevProps.payload && !fetchingMaxStock) || prevProps.activeVariant !== activeVariant) {
      this.GetMaxStock()
    }
  }

  GetMaxStock () {
    const { payload, kecamatan, route, activeVariant, actions } = this.props
    let kecamatanValue = kecamatan ? kecamatan.kecamatan_id : 'CGK10104KEMBANGAN'
    if (get(payload, 'variants[0].sku')) {
      let isProductScanned = ((route.params?.isScanned ?? false) === true) ? 10 : 0
      actions.getMaxStock(activeVariant.sku, kecamatanValue, isProductScanned)
      // this.props.fetchProductGetMaxStock(activeVariant.sku, kecamatanValue, isProductScanned)
    }
  }

  changeQuantity = (quantityDetail) => {
    const { callSnackbar, setParentState } = this.props
    quantityDetail.errorQty && callSnackbar(`Produk ini hanya tersedia ${this.props.maxStock?.max_stock} buah`, 'error', 2500) // eslint-disable-line
    setParentState({ quantity: quantityDetail.qty })
  }

  render () {
    const { payload, quantity, maxStock } = this.props
    // const { maxStock } = this.state
    return (
      <View>
        {(!isEmpty(payload.events) && payload.events[0].url_key === 'flash-sale')
          ? <View style={{ borderWidth: 1, borderColor: '#D4DCE6', padding: 10, width: 75 }}>
            <Text style={{ textAlign: 'center', fontFamily: fonts.regular }}>{quantity}</Text>
          </View>
          : <View style={{ flexDirection: 'row', paddingBottom: 25, paddingTop: 10, justifyContent: 'space-between', alignItems: 'center' }}>
            <Number maxStock={maxStock} changeQuantity={this.changeQuantity.bind(this)} />
            {this.renderLogo()}
          </View>
        }
        <EasyModal ref={(ref) => { this.modal = ref }} size={20} title='Voucher Tidak Berlaku' close>
          <View style={{ margin: 10 }}>
            <PrimaryText>Voucher promo tidak dapat digunakan untuk pembelian produk ini, kecuali voucher penukaran poin rewards dan voucher pengembalian dana.</PrimaryText>
          </View>
        </EasyModal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  kecamatan: state.location.kecamatan
})

export default WithContext(connect(mapStateToProps, null)(EditQuantity))
