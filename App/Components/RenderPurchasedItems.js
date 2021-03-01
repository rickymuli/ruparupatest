import React, { Component } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native'
import { NumberWithCommas } from '../Utils/Misc'
import config from '../../config.js'
import has from 'lodash/has'
import get from 'lodash/get'

import ReviewButton from './ReviewButton'
import AddToCartButton from './AddToCartButton'

export default class RenderPurchasedItems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      item: null,
      isLoading: false
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (props.item !== state.item) {
      returnObj = {
        ...returnObj,
        item: props.item
      }
    }
    return returnObj
  }

  goToPDP = (item) => {
    if (!has(item, 'is_extended') || item.is_extended === '10') {
      const { modal } = this.props
      let itmParameter = {
        itm_source: 'OrderDetailPage',
        itm_campaign: `order-detail`,
        itm_term: item.sku
      }
      modal && modal.setModal(false)
      this.props.navigation.navigate('ProductDetailPage', {
        itemData: {
          url_key: item.url_key
        },
        itmParameter
      })
    }
  }

  objectHelper = (item) => {
    return {
      name: item.name,
      url_key: item.url_key,
      variants: [{
        images: [{
          image_url: item.primary_image_url
        }],
        prices: [{
          price: parseFloat(item.normal_price),
          special_price: (item.selling_price === item.normal_price) ? null : parseFloat(item.selling_price)
        }],
        sku: item.sku
      }],
      brand: {
        name: item.shipping_by
      }
    }
  }

  renderItem = (item) => {
    if (item.is_free_item === '0') {
      const data = this.objectHelper(item)
      const activeVariant = get(data, 'variants[0]', {})
      return (
        <View style={{ flexDirection: 'column', paddingLeft: 15, alignItems: 'flex-start' }}>
          <View style={{ width: 0.6 * Dimensions.get('screen').width }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>{item.name}</Text>
          </View>
          {(item.normal_price !== item.selling_price && item.normal_price)
            ? <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', textDecorationLine: 'line-through', color: '#757886', fontSize: 12, textDecorationColor: '#757886' }}>Rp {NumberWithCommas(item.normal_price)}</Text>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#F3251D', fontSize: 12 }}> ({Math.floor((item.normal_price - item.selling_price) / item.normal_price * 100)}%)</Text>
            </View>
            : null
          }
          <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Rp {NumberWithCommas(item.selling_price)}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'right', fontSize: 12 }}>Jumlah: {item.qty_ordered}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12 }}>Total Harga: </Text>
            <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Rp {NumberWithCommas(item.qty_ordered * item.selling_price)}</Text>
          </View>
          {item.sku !== '70000216' ? (
            <View style={{ alignSelf: 'flex-end' }}>
              <AddToCartButton page={'purchaseditem'} payload={item} activeVariant={activeVariant} quantity={1} navigation={this.props.navigation} isLoading={this.state.isLoading} />
            </View>
          ) : null}
        </View>
      )
    } else {
      return (
        <View style={{ flexDirection: 'column', paddingLeft: 15, alignItems: 'flex-start' }}>
          <Text style={{ fontFamily: 'Quicksand-Bold' }}>GRATIS</Text>
          <View style={{ width: 0.6 * Dimensions.get('screen').width }}>
            <Text style={{ fontFamily: 'Quicksand-Regular' }}>{item.name}</Text>
          </View>
          <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 12 }}>Jumlah: {item.qty_ordered} pc(s)</Text>
        </View>
      )
    }
  }

  render () {
    const { item } = this.state
    const { showReview, invoiceNumber } = this.props
    let viewBackground = item.is_free_item === '0' ? '#FFFFFF' : '#E5F7FF'
    return (
      <TouchableOpacity onPress={() => this.goToPDP(item)} disabled={item.sku === '70000216'} style={{ backgroundColor: viewBackground, justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#eee', marginBottom: 20, alignItems: 'center' }}>
        <Image source={{ uri: (item.primary_image_url) ? `${config.imageRR}w_80,h_80,f_auto,q_auto/${item.primary_image_url}` : `${config.baseURL}static/images/noimage.jpg` }} style={{ width: 80, height: 80 }} />
        <View style={{ flexDirection: 'column' }}>
          {this.renderItem(item)}
          {(showReview) && <ReviewButton productName={item.name} imageUrl={`${config.imageRR}w_170,h_170,f_auto,q_auto/${item.primary_image_url}`} invoiceNumber={invoiceNumber} sku={item.sku} />}
        </View>
      </TouchableOpacity>
    )
  }
}
