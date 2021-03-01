import React, { Component } from 'react'
import { View, Dimensions, RefreshControl } from 'react-native'
import { createFilter } from 'react-native-search-filter'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import styled from 'styled-components'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'

// Components
import OrderItem from './OrderItem'

// Redux
import OrderActions from '../Redux/OrderRedux'

const KEYS_TO_FILTERS = ['order_no', 'grand_total']

class SearchOrderList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '',
      hasSearch: false,
      refresh: false,
      product: []
    }
    this._layoutProvider = new LayoutProvider((i) => {
      return 'NORMAL'
    }, (type, dim) => {
      switch (type) {
        case 'NORMAL':
          dim.width = Dimensions.get('window').width
          dim.height = 120
          break
        default:
          dim.width = 0
          dim.height = 0
      }
    })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!nextProps.fetching) {
      return {
        fetching: false
      }
    }
  }

  delayState = (term) => {
    setTimeout(() => {
      this.setState({
        hasSearch: true,
        searchTerm: term
      })
    }, 200)
  }

  _rowRenderer = (type, data) => {
    return (
      <OrderItem navigation={this.props.navigation} filteredOrderList={data} email={this.props.email} />
    )
  }

  refreshOrderList = () => {
    this.setState({
      refresh: true
    }, () => {
      this.props.getOrderList()
    })
  }

  render () {
    const { orderList } = this.props
    const { refresh } = this.state
    let filteredOrderList = []
    if (orderList.length > 0) {
      filteredOrderList = orderList.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
    }
    let dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(filteredOrderList)
    return (
      <View style={{ flexDirection: 'column', backgroundColor: 'white', paddingHorizontal: 5, flex: 1 }}>
        <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eee', paddingHorizontal: 10 }}>
          <SearchPesanan onChangeText={this.delayState} underlineColorAndroid='transparent' placeholderTextColor='#b2bec3' placeholder='Cari nomor transaksi Anda..' />
          <IconInnerSearch>
            <Icon name='magnify' size={25} />
          </IconInnerSearch>
        </View>
        <RecyclerListView
          layoutProvider={this._layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={this._rowRenderer}
          scrollViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={refresh}
                onRefresh={() => this.refreshOrderList()}
              />
            )
          }}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  order: state.order,
  data: state.order.data
})

const mapDispatchToProps = (dispatch) => ({
  getOrderList: () => dispatch(OrderActions.orderListRequest()),
  getOrderDetail: (orderId, email) => dispatch(OrderActions.orderRequest(orderId, email)),
  getOrderData: () => dispatch(OrderActions.orderSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchOrderList)

const IconInnerSearch = styled.View`
 position: absolute;
 zIndex: 1;
 right: 20px;
`

const SearchPesanan = styled.TextInput`
 borderWidth: 1;
 borderColor: #D4DCE6;
 borderRadius: 3;
 marginVertical: 8;
 paddingLeft: 20;
 paddingVertical: 5;
 font-family:Quicksand-Regular;
 height: 40;
`
