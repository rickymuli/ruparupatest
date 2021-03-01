import React, { Component } from 'react'
import { View, Dimensions, FlatList, Platform, Text } from 'react-native'
import { connect } from 'react-redux'
import { BR } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

// Redux
import ReturnRefundActions from '../Redux/ReturnRefundRedux'
import MiscActions from '../Redux/MiscRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ReturnRefundHeader from '../Components/ReturnRefundHeader'
import OrderInfo from '../Components/OrderInfo'
import Loading from '../Components/LottieComponent'
import InvoiceList from '../Components/InvoiceList'
import ReturnRefundFooter from '../Components/ReturnRefundFooter'

class ReturnRefundPage extends Component {
  constructor () {
    super()
    this.state = {
      refresh: false,
      selectedItems: [],
      customerId: '',
      itemQty: [],
      totalItems: 0
    }
  }

  componentDidMount () {
    const itemDetail = this.props.route.params?.itemDetail ?? {}
    if (!isEmpty(itemDetail)) {
      this.props.orderDataRequest(itemDetail.data.order_no, itemDetail.data.email)
    }
    this.props.getProvince()
  }

  changeQty = (newQty, salesOrderItemId) => {
    let qty = newQty
    if (Number(qty) < 1) {
      qty = 1
    }
    let selectedIndex = this.state.itemQty.findIndex(data => data.salesOrderItemId === salesOrderItemId)
    let tempItemQty = JSON.parse(JSON.stringify(this.state.itemQty))
    tempItemQty[selectedIndex].qty = qty
    let originalQty = 0
    this.state.itemQty.map((qtyData) => {
      this.state.selectedItems.map((item) => {
        if (this.props.returnRefund.data.invoices[item.invoiceIndex].items[item.itemIndex].sales_order_item_id === qtyData.salesOrderItemId && qtyData.salesOrderItemId !== salesOrderItemId) {
          originalQty += qtyData.qty
        }
      })
    })
    this.state.selectedItems.map((item) => {
      if (this.props.returnRefund.data.invoices[item.invoiceIndex].items[item.itemIndex].sales_order_item_id === salesOrderItemId) {
        originalQty += qty
      }
    })
    this.setState({ itemQty: tempItemQty, totalItems: originalQty })
  }

  componentWillUnmount () {
    this.props.initReturnRefundData()
  }

  refreshItem = () => {
    const itemDetail = this.props.route.params?.itemDetail ?? {}
    this.setState({ refresh: true }, () => {
      this.props.orderDataRequest(itemDetail.data.order_no, itemDetail.data.email)
    })
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (state.customerId === '' && !isEmpty(props.returnRefund.data)) {
      let itemQty = []
      props.returnRefund.data.invoices.map((invoice) => {
        invoice.items.map((item) => {
          itemQty.push({ salesOrderItemId: item.sales_order_item_id, qty: 1 })
        })
      })
      returnObj = {
        customerId: props.returnRefund.data.customer_id,
        itemQty
      }
    }
    return returnObj
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.state.refresh) {
      if (!this.props.returnRefund.fetching) {
        this.setState({ refresh: false })
      }
    }
    if (prevState.customerId !== this.state.customerId) {
      this.props.userAddressRequest(this.props.returnRefund.data.customer_token)
    }
  }

  selectItem = (invoiceIndex, itemIndex, salesOrderItemId) => {
    let tempArr = [...this.state.selectedItems]
    let newObj = { invoiceIndex, itemIndex }
    let totalItems = this.state.totalItems
    if (tempArr.some(data => isEqual(data, newObj))) {
      let index = tempArr.findIndex(data => isEqual(data, newObj))
      let qtyItemSelected = this.state.itemQty.find(data => data.salesOrderItemId === salesOrderItemId)
      totalItems -= qtyItemSelected.qty
      tempArr.splice(index, 1)
    } else {
      let qtyItemSelected = this.state.itemQty.find(data => data.salesOrderItemId === salesOrderItemId)
      totalItems += qtyItemSelected.qty
      tempArr.push(newObj)
    }
    this.setState({ selectedItems: tempArr, totalItems })
  }

  _headerComponent = () => {
    const { returnRefund } = this.props
    return (
      <>
        <BR />
        <ReturnRefundHeader orderNo={returnRefund.data.order_no} shipmentSummary={returnRefund.data.shipment_summary} />
        <OrderInfo data={returnRefund.data} />
      </>
    )
  }

  render () {
    const { returnRefund } = this.props
    const { itemQty, selectedItems, refresh, customerId, totalItems } = this.state
    const win = Dimensions.get('screen')
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <View style={{ flex: 1, height: win.height }}>
        <HeaderSearchComponent back logo navigation={this.props.navigation} />
        {(returnRefund.fetching)
          ? <>
            <Loading />
          </>
          : (isEmpty(returnRefund.data))
            ? (isEmpty(returnRefund.err))
              ? null
              : <View style={{ backgroundColor: '#f2dede', borderWidth: 1, borderColor: '#ebccd1', borderRadius: 5, justifyContent: 'center', padding: 10, margin: 10 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', color: '#a94442', fontSize: 16, textAlign: 'center' }}>{returnRefund.err}</Text>
              </View>
            : <FlatList
              initialNumToRender={3}
              ListHeaderComponent={this._headerComponent}
              ListFooterComponent={() => (
                <ReturnRefundFooter
                  navigation={this.props.navigation}
                  customerId={customerId}
                  address={returnRefund.address}
                  invoices={returnRefund.data.invoices}
                  orderDate={returnRefund.data.order_date}
                  totalItemSelected={totalItems}
                  showData={!isEmpty(this.state.selectedItems)}
                  selectedItems={this.state.selectedItems}
                  itemQty={itemQty}
                />
              )}
              maxToRenderPerBatch={10}
              refreshing={refresh}
              onRefresh={() => this.refreshItem()}
              removeClippedSubviews={removeClippedSubviews}
              data={returnRefund.data.invoices}
              extraData={[selectedItems, returnRefund.address, itemQty, returnRefund.data, totalItems]}
              renderItem={({ item, index }) => {
                return (
                  <InvoiceList
                    selectItem={this.selectItem}
                    invoice={item}
                    itemQty={itemQty}
                    changeQty={this.changeQty}
                    index={index}
                    selectedItems={this.state.selectedItems} />
                )
              }}
              keyExtractor={(data, index) => `invoice list ${index}`}
            />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund
})

const mapDispatchToProps = (dispatch) => ({
  getProvince: () => (dispatch(MiscActions.miscProvinceRequest())),
  orderDataRequest: (orderNo, email) => dispatch(ReturnRefundActions.orderDataRequest(orderNo, email)),
  userAddressRequest: (customerToken) => dispatch(ReturnRefundActions.userAddressRequest(customerToken)),
  initReturnRefundData: () => dispatch(ReturnRefundActions.initReturnRefundData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReturnRefundPage)
