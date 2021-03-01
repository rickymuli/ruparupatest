import React, { Component } from 'react'
import { View, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import toLower from 'lodash/toLower'

// Styles
import styles from './Styles/NumberInputStyles'
import { WithContext } from '../Context/CustomContext'
import { ErrorText } from '../Styles'

class NumberInput extends Component {
  constructor (props) {
    super(props)
    this.state = {
      qty: props.quantity,
      maxStock: props.maxStock,
      sku: props.sku,
      error: null
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ qty: props.quantity, maxStock: props.maxStock?.max_stock ?? props.maxStock, sku: props.sku }) // eslint-disable-line
    // this.setState({ qty: quantity, maxStock: (maxStock.max_stock || maxStock), sku })
  }

  add = () => {
    const { sku, maxStock, qty } = this.state
    const { detailIndex, itemIndex, activeVariant, salesOrderItemId } = this.props
    let newNum = Number(qty) + 1
    let label = get(activeVariant, 'label') || ''
    let newMaxStock = (toLower(label) === 'buy 1 get 1') ? Math.ceil(maxStock / 2) : maxStock
    let quantityDetail = {
      qty: String(newNum),
      sku,
      itemIndex,
      detailIndex,
      errorQty: false,
      salesOrderItemId
    }
    if (Number(qty) >= newMaxStock) {
      quantityDetail['qty'] = newMaxStock
      quantityDetail['errorQty'] = true
    }
    this.props.changeQuantity(quantityDetail)
  }

  minus = () => {
    const { sku, qty } = this.state
    const { detailIndex, itemIndex, salesOrderItemId } = this.props
    let newNum = (Number(qty) <= 1) ? qty : Number(qty) - 1
    let quantityDetail = {
      qty: String(newNum),
      sku: sku,
      itemIndex,
      detailIndex,
      salesOrderItemId
    }
    this.props.changeQuantity(quantityDetail)
  }

  onChangeText = (qty) => {
    const { maxStock, sku } = this.state
    if (!isNaN(Number(qty))) {
      let quantityDetail
      if (maxStock >= Number(qty)) {
        quantityDetail = { qty, sku, errorQty: false }
      } else {
        quantityDetail = { qty: maxStock, sku, errorQty: true }
      }
      this.setState({ error: null })
      this.props.changeQuantity(quantityDetail)
    } else {
      this.setState({ error: 'Jumlah barang harus angka' })
    }
  }

  render () {
    const { qty, error } = this.state
    const { fromCart, isDigitalProduct } = this.props
    let disabled
    if (fromCart) {
      disabled = false
    } else {
      disabled = true
    }
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', marginBottom: 10 }}>
          {!isDigitalProduct
            ? <TouchableOpacity onPress={() => this.minus()} >
              <View style={(fromCart) ? styles.buttonCart : styles.button}>
                <Icon name='minus' />
              </View>
            </TouchableOpacity>
            : <TouchableWithoutFeedback>
              <View style={styles.disabledButton}><Icon name='minus' /></View>
            </TouchableWithoutFeedback>}
          <View style={(fromCart) ? styles.buttonCart : styles.button}>
            <TextInput style={{ textAlign: 'center', color: '#757885' }} editable={disabled} returnKeyType='done' underlineColorAndroid='transparent' value={String(qty)} onChangeText={(qty) => this.onChangeText(qty)} keyboardType='numeric' />
          </View>
          {!isDigitalProduct
            ? <TouchableOpacity onPress={() => this.add()}>
              <View style={(fromCart) ? styles.buttonRightCart : styles.buttonRight}>
                <Icon name='plus' />
              </View>
            </TouchableOpacity>
            : <TouchableWithoutFeedback>
              <View style={styles.disabledButton}><Icon name='plus' /></View>
            </TouchableWithoutFeedback>}
        </View>
        {(!isEmpty(error))
          ? <ErrorText>{error}</ErrorText>
          : null
        }
      </View>
    )
  }
}
export default WithContext(NumberInput)
