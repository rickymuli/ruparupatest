import React, { PureComponent } from 'react'
import { View, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'

// Component
import StepIndicator from 'react-native-step-indicator'

class ShipmentProgressBar extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      shipment: props.shipment || null
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEqual(props.shipment, state.shipment)) {
      returnObj = {
        ...returnObj,
        shipment: props.shipment
      }
    }

    if (!isEqual(props.order, state.order)) {
      returnObj = {
        ...returnObj,
        order: props.order
      }
    }
    return returnObj
  }

  render () {
    const { shipment } = this.state
    const { order } = this.props
    const orderData = order.data
    let status = shipment.shipment_status
    let deliveryMethod = shipment.details[0].delivery_method
    if (typeof status === 'undefined' && orderData.status !== 'expire' && orderData.status !== 'canceled') {
      status = 'pending'
    } else if (orderData.status === 'expire' || orderData.status === 'canceled') {
      status = 'canceled'
    }
    const labels = ['Pesanan kami terima', 'Pembayaran diterima', 'Persiapan barang', 'Pengiriman', 'Pesanan anda diterima']
    let currentPosition = 0
    let progressColor = '#F3251D'
    switch (status) {
      case 'canceled':
        if (shipment.reorder && shipment.reorder.action === 'reorder' && shipment.reorder.status === 'completed') {
          labels[0] = 'Pesanan Direorder'
        }
        currentPosition = 0
        progressColor = '#F3251D'
        break
      case 'new':
        currentPosition = 1
        progressColor = '#F5A623'
        break
      case 'processing':
      case 'standby':
      case 'stand_by':
      case 'hold':
        currentPosition = 2
        progressColor = '#F5A623'
        break
      case 'ready_to_pickup':
        progressColor = '#F5A623'
        if (deliveryMethod === 'pickup') {
          labels[3] = 'Siap Diambil'
          currentPosition = 3
        } else {
          currentPosition = 2
        }
        break
      case 'picked':
        progressColor = '#F5A623'
        currentPosition = 3
        break
      case 'shipped':
        progressColor = '#F5A623'
        currentPosition = 3
        break
      case 'received':
        currentPosition = 4
        progressColor = '#049372'
        break
      default:
        currentPosition = 0
        progressColor = '#F5A623'
    }

    const customStyles = {
      stepIndicatorSize: 27,
      currentStepIndicatorSize: 27,
      separatorStrokeWidth: 4,
      currentStepStrokeWidth: 5,
      stepStrokeCurrentColor: progressColor,
      stepStrokeWidth: 4,
      stepStrokeFinishedColor: progressColor,
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: progressColor,
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#ffffff',
      stepIndicatorUnFinishedColor: '#aaaaaa',
      stepIndicatorCurrentColor: progressColor,
      stepIndicatorLabelFontSize: 15,
      currentStepIndicatorLabelFontSize: 15,
      stepIndicatorLabelCurrentColor: 'transparent',
      stepIndicatorLabelFinishedColor: 'transparent',
      stepIndicatorLabelUnFinishedColor: 'transparent',
      labelColor: '#999999',
      labelSize: 15,
      currentStepLabelColor: progressColor,
      labelAlign: 'flex-start',
      labelFontFamily: 'Quicksand-Bold'
    }

    const { height } = Dimensions.get('screen')

    return (
      <View style={{ marginVertical: 20, height: height * 0.3 }}>
        <StepIndicator
          customStyles={customStyles}
          stepCount={labels.length}
          currentPosition={currentPosition}
          labels={labels}
          direction='vertical'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order
})

export default connect(mapStateToProps)(ShipmentProgressBar)
