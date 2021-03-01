import React, { Component } from 'react'
import { Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'

// Redux
import OrderActions from '../Redux/OrderRedux'

class RenderEmptyOrder extends Component {
  refreshData = () => {
    this.props.getOrderList()
  }

  render () {
    const screenDimension = Dimensions.get('screen')
    const ratio = (screenDimension.width * 0.8) / 976
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/images/keranjang-kosong.webp')}
          style={{ width: screenDimension.width * 0.8, height: ratio * 562 }}
        />
        <View style={{ paddingTop: 15 }}>
          <Text style={{ fontFamily: 'Quicksand-Medium', color: '#757886', fontSize: 16 }}><Icon name='information' size={20} /> Maaf Anda belum memiliki transaksi</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.refreshData()}
          style={{ borderWidth: 1, borderColor: '#E0E6ED', borderRadius: 3, paddingVertical: 5, paddingHorizontal: 15, marginTop: 15, width: Dimensions.get('screen').width * 0.8 }}
        >
          <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 16, textAlign: 'center' }}><Icon name='refresh' size={18} /> Refresh</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getOrderList: () => dispatch(OrderActions.orderListRequest())
})

export default connect(null, mapDispatchToProps)(RenderEmptyOrder)
