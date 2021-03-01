import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import SearchOrderStatus from '../Components/SearchOrderStatus'
import OrderList from '../Components/OrderList'

class IndexOrderStatusPage extends Component {
  // componentDidMount () {
  //   this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
  //   this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
  // }

  // keyboardWillShow = event => {
  //   this.props.navigation.setParams({
  //     keyboard: false
  //   })
  // }

  // keyboardWillHide = event => {
  //   this.props.navigation.setParams({
  //     keyboard: true
  //   })
  // }

  render () {
    const { auth, route } = this.props
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white' }}>
        <HeaderSearchComponent pageName={'Pesanan Saya'} pageType={'order-status-page'} navigation={this.props.navigation} />
        {isEmpty(auth.user)
          ? <SearchOrderStatus navigation={this.props.navigation} />
          : <OrderList navigation={this.props.navigation} email={auth.user.email} route={route} />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(IndexOrderStatusPage)
