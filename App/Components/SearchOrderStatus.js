import React, { Component } from 'react'
import { Text, View, TextInput, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import { connect } from 'react-redux'

// Redux
import OrderActions from '../Redux/OrderRedux'

// Styles
import styles from './Styles/OrderStatusPageStyle'

class SearchOrderStatus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      orderId: '',
      email: '',
      searching: false,
      order: props.order || null
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.order, prevState.order)) {
      return {
        order: nextProps.order
      }
    }
    return null
  }

  componentDidUpdate () {
    const { searching, order, orderId, email } = this.state
    if (searching && !isEmpty(order.data)) {
      this.setState({
        searching: false
      }, () => {
        this.props.navigation.navigate('OrderStatusDetail', {
          orderData: {
            order_id: orderId,
            email
          }
        })
      })
    }
  }

  handleOrderStatusError = () => {
    const { order, orderId, email, searching } = this.state
    if (searching) {
      if (isEmpty(orderId) && isEmpty(email) && order.data) {
        return (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>Nomor order dan email tidak boleh kosong</Text>
          </View>
        )
      }
      if (order.data && !order.data.hasOwnProperty('cart_id')) {
        return (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>Maaf, order Anda tidak ditemukan</Text>
          </View>
        )
      } else if (order.err) {
        return (
          <View style={styles.errorMessageContainer}>
            <Text style={styles.errorMessage}>{order.err}</Text>
          </View>
        )
      }
    } else {
      return null
    }
  }

  handleSubmitOrder = () => {
    const { orderId, email } = this.state
    let handledOrderId = orderId.toUpperCase()
    let handledEmail = email.toLowerCase()
    this.props.getOrderDetail(handledOrderId, handledEmail)
    this.setState({ searching: true })
  }

  render () {
    const { orderId, email } = this.state
    const { order } = this.props
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ paddingLeft: 10, paddingTop: 20, paddingRight: 10, backgroundColor: 'white', flexDirection: 'column', borderBottomWidth: 1, borderBottomColor: '#D4DCE6', paddingBottom: 10 }}>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='magnify' color={'#D4DCE6'} />
            <TextInput
              underlineColorAndroid='transparent'
              value={orderId}
              autoCapitalize='characters'
              onChangeText={(orderId) => this.setState({ orderId })}
              placeholder='Nomor Pesanan'
              placeholderTextColor='#b2bec3'
              style={[{ fontFamily: 'Quicksand-Regular', textDecorationColor: 'white', flex: 1, height: 40, color: 'black' }]} />
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='email' color={'#D4DCE6'} />
            <TextInput
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              keyboardType='email-address'
              value={email}
              onChangeText={(email) => this.setState({ email: email.toLowerCase() })}
              placeholder='Email anda'
              placeholderTextColor='#b2bec3'
              style={[{ fontFamily: 'Quicksand-Regular', textDecorationColor: 'white', flex: 1, height: 40, color: 'black' }]} />
          </FormS>
          <TouchableOpacity onPress={() => this.handleSubmitOrder()} style={{ borderWidth: 1, borderColor: '#008CCF', borderRadius: 3, paddingTop: 10, paddingBottom: 10, paddingLeft: 20, paddingRight: 20 }}>
            <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16, color: '#008CCF', textAlign: 'center' }}>{(order && order.fetching) ? 'Mohon Menunggu...' : 'Cek Status Pesanan'}</Text>
          </TouchableOpacity>
          {this.handleOrderStatusError()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order
})

const mapDispatchToProps = (dispatch) => ({
  getOrderDetail: (orderId, email) => dispatch(OrderActions.orderRequest(orderId, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchOrderStatus)

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
