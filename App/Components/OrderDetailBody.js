import React, { PureComponent } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { NumberWithCommas } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import { fonts } from '../Styles'

// Component
import OrderTransactionLogo from './OrderTransactionLogo'
import ShipmentProgressBar from './ShipmentProgressBar'
import RenderShipment from './RenderShipment'
import RenderPurchasedItems from './RenderPurchasedItems'
import EasyModal from './EasyModal'
import ButtonPrimary from './ButtonPrimary'

// Redux
import OrderActions from '../Redux/OrderRedux'

// we set the height of item is fixed
// const getItemLayout = (data, index) => (
//   { length: 100, offset: 100 * index, index }
// )
class OrderDetailBody extends PureComponent {
  constructor (props) {
    super(props)
    this.modal = null
    this.state = {
      shipment: props.shipment || null,
      index: props.index || ''
    }
  }

  componentDidUpdate () {
    const { order } = this.props
    if (order.orderStatusUpdate === 'Success') {
      this.props.updateStatusState()
    }
    if (order.success) {
      this.setState({ shipment: this.props.shipment })
    }
  }

  receivedConfirmation = () => {
    const { shipment } = this.state
    let params = {
      shipment_id: shipment.shipment_tracking.shipment_id,
      shipment_status: 'received',
      invoice_no: shipment.invoice_no
    }
    this.props.updateStatus(params)
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEqual(props.shipment, state.shimpent)) {
      returnObj = {
        ...returnObj,
        shipment: props.shipment
      }
    }
    return returnObj
  }

  renderHeader () {
    const { shipment, index } = this.state
    return (
      <>
        <OrderTransactionLogo from='body' shipment={shipment} index={index} navigation={this.props.navigation} callSnackbar={this.props.callSnackbar} />
        {shipment.reorder && !isEmpty(shipment.reorder) && shipment.reorder.status === 'customer_confirmation' && this.renderConfirmationReorder(shipment)}
        <ShipmentProgressBar shipment={shipment} />
        <RenderShipment shipment={shipment} />
      </>
    )
  }

  handlePushConfirmation=(shipment) => {
    const orderData = this.props.order.data
    let reorder = shipment.reorder

    let email = orderData.customer.email
    let itemData = { invoiceId: shipment.invoice_no, email: email }

    if (reorder && reorder.customer_confirmation === '10' && reorder.status === 'customer_confirmation' && reorder.cart_id) {
      this.props.navigation.navigate('PaymentPage', { cart_id: reorder.cart_id, from: 'ConfirmationReorder' })
    } else this.props.navigation.navigate('ConfirmationReorder', { itemData: itemData })
  }

  renderConfirmationReorder = (shipment) => {
    return (
      <View style={{ marginVertical: 15 }}>
        <DangerInfoBox>
          {/* <TouchableOpacity > */}
          <Text style={{ fontFamily: fonts.regular }}>
          Pesanan Anda telah dialihkan ke toko lain. Silahkan lakukan konfirmasi pesanan Anda <Text onPress={() => { this.handlePushConfirmation(shipment) }} style={{ textDecorationLine: 'underline', fontFamily: fonts.bold }}>disini</Text>
          </Text>
          {/* </TouchableOpacity> */}
        </DangerInfoBox>
      </View>
    )
  }

  renderFooter () {
    const { order } = this.props
    const { shipment } = this.state
    return (
      <View style={{ flexDirection: 'column' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <Text style={{ fontFamily: fonts.regular }}>Biaya Kirim</Text>
          <Text style={{ fontFamily: fonts.regular }}>{(shipment.biaya_kirim > 0) ? `Rp ${NumberWithCommas(shipment.biaya_kirim)}` : 'Gratis' }</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <Text style={{ fontFamily: fonts.regular }}>Biaya Layanan</Text>
          <Text style={{ fontFamily: fonts.regular }}>Rp {(shipment.biaya_layanan) ? NumberWithCommas(shipment.biaya_layanan) : 0}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
          <Text style={{ fontFamily: fonts.regular }}>Total</Text>
          <Text style={{ fontFamily: fonts.regular }}>Rp {NumberWithCommas(shipment.total)}</Text>
        </View>
        {shipment.shipment_status === 'picked' ? (
          <View style={{ paddingTop: 15 }}>
            <ButtonPrimary oneButton
              text={'Konfirmasi Terima Paket'}
              disabledBtn={order.fetching}
              btnStyle={order.fetching ? { backgroundColor: '#f0f2f7' } : null}
              textStyle={order.fetching ? { color: '#8d8f96' } : null}
              onPressBtn={() => this.receivedConfirmation()} />
          </View>
        ) : null
        }
      </View>
    )
  }

  render () {
    const { shipment } = this.state
    const orderData = this.props.order.data
    let ViewComponent = (orderData.status === 'canceled') ? NegativeBody : (shipment.shipment_status === 'received') ? PositiveBody : PendingBody
    return (
      <ViewComponent>
        {this.renderHeader()}
        {(!isEmpty(shipment.details)) &&
          <View style={{ flexDirection: 'column' }}>
            {take(shipment.details, 3).map((item, index) =>
              (
                <RenderPurchasedItems
                  invoiceNumber={shipment.invoice_no}
                  showReview={false} // kalau udh live lagi, isi ini di showReview ===>>> shipment.shipment_status === 'received'
                  navigation={this.props.navigation}
                  item={item}
                  key={`purchased items ${index}`} />
              )
            )}
            {(shipment.details.length > 3) &&
              <TouchableOpacity onPress={() => this.modal.setModal(true)} style={{ borderColor: '#E0E6ED', borderWidth: 1, borderRadius: 3, padding: 10 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 18, textAlign: 'center' }}>Lihat Semua Barang</Text>
              </TouchableOpacity>
            }
          </View>
        }
        {this.renderFooter()}
        <EasyModal ref={(ref) => { this.modal = ref }} size={80} title='Daftar barang' close>
          <FlatList
            data={shipment.details}
            keyExtractor={(item, index) => `purchased item ${index}`}
            style={{ flex: 1 }}
            renderItem={({ item }) => (<RenderPurchasedItems modal={this.modal} navigation={this.props.navigation} item={item} />)}
          />
        </EasyModal>
      </ViewComponent>
    )
  }
}

const mapStateToProps = (state) => ({
  order: state.order,
  user: state.auth.user
})

const dispatchToProps = (dispatch) => ({
  updateStatus: (params) => dispatch(OrderActions.orderStatusUpdateRequest(params))
})

export default connect(mapStateToProps, dispatchToProps)(OrderDetailBody)

const DangerInfoBox = (props) => {
  return (
    <View style={{ backgroundColor: '#FCE6E6', padding: 10, marginTop: 4 }}>
      <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
        {props.children}
      </View>
    </View>
  )
}

const NegativeBody = styled.View`
  border-color: #F3251D;
  border-width: 4;
  border-radius: 5;
  flex-direction: column;
  padding-vertical: 15;
  padding-horizontal: 20;
  margin-top: 15;
`
const PositiveBody = styled.View`
  border-color: #049372;
  border-width: 4;
  border-radius: 5;
  flex-direction: column;
  padding-vertical: 15;
  padding-horizontal: 20;
  margin-top: 15;
`
const PendingBody = styled.View`
  border-color: #F5A623;
  border-width: 4;
  border-radius: 5;
  flex-direction: column;
  padding-vertical: 15;
  padding-horizontal: 20;
  margin-top: 15;
`
