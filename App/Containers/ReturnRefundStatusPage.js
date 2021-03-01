import React, { Component } from 'react'
import { FlatList, View, Platform } from 'react-native'
import { connect } from 'react-redux'
// import { ContainerBorder } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
// Redux
import ReturnRefundActions from '../Redux/ReturnRefundRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ReturnRefundProgressLine from '../Components/ReturnRefundProgressLine'
import LottieComponent from '../Components/LottieComponent'
// import RefundStatusDetail from '../Components/RefundStatusDetail'
// import RefundStatusImage from '../Components/RefundStatusImage'

class ReturnRefundStatusPage extends Component {
  constructor () {
    super()
    this.state = {
      refresh: false
    }
  }

  componentDidMount () {
    const { orderData } = this.props.route.params
    this.props.userStatusReturnRequest(orderData.order_id, orderData.email)
    if (!isEmpty(this.props.returnRefund.estimationData)) {
      this.props.initEstimationData()
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.returnRefund.statusReturn) && state.refresh) {
      returnObj = {
        ...returnObj,
        refresh: false
      }
    }
    return returnObj
  }

  refreshItems = () => {
    const orderData = this.props.route.params.orderData

    this.setState({ refresh: true })
    this.props.userStatusReturnRequest(orderData.order_id, orderData.email)
    this.props.initEstimationData()
  }

  renderProgressLine = (status) => {
    let step = 0
    if (status === 'approved') {
      step = 1
    } else if (status === 'ship_from_customer' || status === 'store_approved') {
      step = 2
    } else if (status === 'generated' || status === 'recheck' || status === 'waiting_finance' || status === 'refunded') {
      step = 3
    } else {
      step = 0
    }

    return (
      <ReturnRefundProgressLine position={step} status={status} />
    )
  }

  render () {
    const { returnRefund } = this.props
    const { refresh } = this.state
    console.log(returnRefund.statusReturn)
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <View style={{ flex: 1 }}>
        <HeaderSearchComponent logo back navigation={this.props.navigation} />
        {(returnRefund.fetchingStatusReturn)
          ? <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <LottieComponent />
          </View>
          : <FlatList
            data={returnRefund.statusReturn}
            refreshing={refresh}
            onRefresh={() => this.refreshItems()}
            maxToRenderPerBatch={2}
            removeClippedSubviews={removeClippedSubviews}
            renderItem={({ item }) => {
              console.log(item)
              return null
            }}
            // renderItem={({ item }) => (
            //   <ContainerBorder>
            //     {this.renderProgressLine(item.status)}
            //     <RefundStatusDetail refundData={item} item={item.item} noRefund={item.refund_no} />
            //     <RefundStatusImage navigation={this.props.navigation} item={item} />
            //   </ContainerBorder>
            // )}
          />
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
  returnRefund: state.returnRefund
})

const mapDispatchToProps = (dispatch) => ({
  userStatusReturnRequest: (orderNo, email) => dispatch(ReturnRefundActions.userStatusReturnRequest(orderNo, email)),
  initEstimationData: () => dispatch(ReturnRefundActions.initEstimationData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReturnRefundStatusPage)
