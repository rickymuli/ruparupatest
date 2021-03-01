import React, { Component } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import ReorderActions from '../Redux/ReorderRedux'
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'

import styled from 'styled-components'
import LoadingComponent from '../Components/LoadingComponent'
import styles from '../Components/Styles/ConfirmationPickupStyles'

const { width } = Dimensions.get('screen')

export class ConfirmationPickup extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errMsg: '',
      success: false,
      fetching: false,
      orderNo: props.orderNo
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnData = {}

    if (!isEmpty(props.reorder)) {
      if (props.reorder.fetching !== state.fetching) returnData = { ...returnData, fetching: props.reorder.fetching }
      if (props.reorder.successConfirmation !== state.success) {
        returnData = { ...returnData, success: props.reorder.success }
      }
      if (props.reorder.err !== state.errMsg) returnData = { ...returnData, errMsg: props.reorder.err }
    }

    if (props.confirmationData && !isEmpty(props.confirmationData)) {
      if (props.confirmationData.new_order_no && props.confirmationData.new_order_no !== state.orderNo) {
        returnData = { ...returnData, orderNo: props.confirmationData.new_order_no, confirmationData: props.confirmationData }
      }
    }

    return returnData
  }

  handlePickup = (invoiceNo, email) => {
    let data = {
      invoice_no: invoiceNo,
      action: 'pickup',
      email: email
    }
    this.props.customerConfirmation(data)
  }

  render () {
    const { success, fetching, errMsg, orderNo } = this.state
    const { invoiceNo, storeNew, email } = this.props
    if (fetching) {
      return <LoadingComponent style={{ flex: 1, paddingVertical: 20 }} />
    } else if (success) {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
            Terima kasih. Silahkan mengambil pesanan Anda di <Text style={{ fontFamily: 'Quicksand-Bold' }}>{storeNew.store_name} </Text>
            dengan nomor orderan: </Text>
              <Text
                onPress={() => this.props.handleOpenOrderDetail(orderNo)}
                style={{ fontFamily: 'Quicksand-Bold',
                  fontSize: 14,
                  textAlign: 'center',
                  textDecorationLine: 'underline' }}>{orderNo}</Text>

              <Text style={[styles.textNormal, { paddingVertical: 5 }]}>
                Alamat Toko:
              </Text>
              <Text style={styles.textBold}>{storeNew.address_line_2}</Text>
              <TouchableOpacity onPress={() => this.props.openGps(storeNew)}>
                <Text style={[styles.textNormal, {
                  textDecorationLine: 'underline',
                  paddingVertical: 10,
                  marginBottom: 10
                }]}>
                  Lihat Lokasi</Text>
              </TouchableOpacity>
              <ButtonSecondary onPress={() => { this.props.navigation.navigate('Order', { data: { from: 'Confirmation' } }) }}>
                <ButtonTextSecondary>Kembali ke Status Pesanan</ButtonTextSecondary>
              </ButtonSecondary>

            </View>
          </DelivBox>
        </View>
      )
    } else if (errMsg) {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
                {errMsg || null}
              </Text>
              <ButtonSecondary onPress={() => { this.props.handleInit(); this.props.setChangeState('isActionType', 'default') }}>
                <ButtonTextSecondary>Coba Lagi</ButtonTextSecondary>
              </ButtonSecondary>
            </View>
          </DelivBox>
        </View>
      )
    } else {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
            Apakah Anda yakin akan melakukan penjemputan mandiri di <Text style={{ fontFamily: 'Quicksand-Bold' }}>{storeNew.store_name}</Text> ?
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ width: width * 0.43 }}>
                  <ButtonSecondary onPress={() => this.props.setChangeState('isActionType', 'default')}>
                    <ButtonTextSecondary>Tidak</ButtonTextSecondary>
                  </ButtonSecondary>
                </View>
                <View style={{ width: width * 0.43 }}>
                  <ButtonPrimary onPress={() => this.handlePickup(invoiceNo, email)}>
                    <ButtonTextPrimary>Ya</ButtonTextPrimary>
                  </ButtonPrimary>
                </View>
              </View>
            </View>
          </DelivBox>
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  reorder: state.reorder,
  confirmationData: state.reorder.confirmationData

})

const mapDispatchToProps = (dispatch) => ({
  customerConfirmation: (data) => dispatch(ReorderActions.confirmationRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationPickup)

const DelivBox = (props) => {
  return (
    <View style={{ backgroundColor: '#E5F7FF', padding: 10, marginTop: 4 }}>
      <View style={{ justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10 }}>
        {props.children}
      </View>
    </View>
  )
}

const ButtonPrimary = styled.TouchableOpacity`
  backgroundColor: #F26525;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`

const ButtonTextPrimary = styled.Text`
  fontFamily: Quicksand-Bold;
  textAlign: center;
  color: white;
`

const ButtonSecondary = styled.TouchableOpacity`
  backgroundColor: #008CCF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`
const ButtonTextSecondary = styled.Text`
  fontFamily: Quicksand-Regular;
  textAlign: center;
  color: white;
  fontSize: 14;
`
