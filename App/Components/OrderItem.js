import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { formatLLL } from '../Services/Day'
// Component
import Loading from './LoadingComponent'
export default class OrderItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filteredOrderList: props.filteredOrderList || null,
      email: props.email || null
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (props.filteredOrderList !== state.filteredOrderList) {
      returnObj = {
        ...returnObj,
        filteredOrderList: props.filteredOrderList
      }
    }
    return returnObj
  }

  // componentWillReceiveProps (newProps) {
  //   const { filteredOrderList } = newProps
  //   this.setState({ filteredOrderList })
  // }

  handleOpenOrderDetail = (order) => {
    const { email } = this.state
    this.props.navigation.navigate('OrderStatusDetail', {
      orderData: {
        order_id: order.order_no,
        email
      }
    })
  }

  renderOrderItem = (order) => {
    let backgroundColor
    if (order.to_render_class_name === 'danger') {
      backgroundColor = '#d9534f'
    } else if (order.to_render_class_name === 'success') {
      backgroundColor = '#238B22'
    } else if (order.to_render_class_name === 'info') {
      backgroundColor = '#5bc0de'
    } else {
      backgroundColor = '#F5A623'
    }
    return (
      <TouchableOpacity onPress={() => this.handleOpenOrderDetail(order)} style={{ flexDirection: 'column', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' }} >
        <Text style={{ fontSize: 16, fontFamily: 'Quicksand-Bold', color: '#757886' }}>{order.order_no}</Text>
        <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10 }}>
          <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular', color: '#757886' }}><Icon name='calendar-range' /> Dipesan pada: {formatLLL(order.created_at)}</Text>
          <Icon name='chevron-right' size={20} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
          <View style={{ marginTop: 10, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: backgroundColor, borderRadius: 3 }}>
            <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', fontFamily: 'Quicksand-Bold' }}>{order.to_render_status}</Text>
          </View>
        </View>
      </TouchableOpacity >
    )
  }

  render () {
    const { filteredOrderList } = this.state
    if (filteredOrderList.length === 0) {
      return (
        <Loading />
      )
    } else {
      return (
        <View style={{ paddingHorizontal: 10 }}>
          {this.renderOrderItem(filteredOrderList)}
          {/* {filteredOrderList.map((order, index) => (
            this.renderOrderItem(order, userEmail, index)
          ))} */}
        </View>
      )
    }
  }
}
