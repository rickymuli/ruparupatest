import React, { Component } from 'react'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
import { fonts, colors } from '../Styles'
import Icon from 'react-native-vector-icons/FontAwesome'

// Component
import LottieComponent from './LottieComponent'
import EmptyOrder from './RenderEmptyOrder'
import SearchOrderList from './SearchOrderList'

// Redux
import OrderActions from '../Redux/OrderRedux'

class OrderList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: props.order || null
    }
  }

  componentDidMount () {
    this.props.getOrderList()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(prevState.order, nextProps.order)) {
      return {
        order: nextProps.order
      }
    }

    if (nextProps.route && nextProps.route.params) {
      if (nextProps.route.params.data) {
        if (nextProps.route.params.data.from && nextProps.route.params.data.from === 'Confirmation') {
          nextProps.getOrderList()
          // reset to clear the params from confirmation page
          nextProps.navigation.reset({
            routes: [{ name: 'Order' }]
          })
        }
      }
    }
    return null
  }

  reloadItems = () => {
    this.props.getOrderList()
  }

  render () {
    const { order } = this.state
    const { auth } = this.props

    if (order.fetching && isEmpty(order.orderList) && isEmpty(order.orderListErr)) {
      return (
        <LottieComponent />
      )
    } else if (isEmpty(order.orderListErr)) {
      if (isEmpty(order.orderList)) {
        return (
          <EmptyOrder navigation={this.props.navigation} />
        )
      } else {
        return (
          <SearchOrderList navigation={this.props.navigation} orderList={order.orderList} email={auth.user.email} />
        )
      }
    } else if (!isEmpty(order.orderListErr)) {
      return (
        <View style={{ paddingTop: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <ErrorMessage>{order.orderListErr}</ErrorMessage>
          <TouchableOpacity style={{ marginTop: 15, width: Dimensions.get('screen').width * 0.8, alignItems: 'center' }} onPress={() => this.reloadItems()}>
            <Icon name='refresh' size={20} />
          </TouchableOpacity>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order
})

const mapDispatchToProps = (dispatch) => ({
  getOrderList: () => dispatch(OrderActions.orderListRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)

const ErrorMessage = styled.Text`
  font-family: ${fonts.regular};
  color: ${colors.error};
  textAlign: center;
  font-size: 16;
`
