import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

import ReorderActions from '../Redux/ReorderRedux'
import { View, Text } from 'react-native'

import styled from 'styled-components'
import LoadingComponent from '../Components/LoadingComponent'
import { fonts, dimensions } from '../Styles'
export class ConfirmationRefund extends Component {
  constructor (props) {
    super(props)
    this.state = {
      errMsg: '',
      success: false,
      fetching: false
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

    return returnData
  }

  handleRefund = (invoiceNo, email) => {
    let data = {
      invoice_no: invoiceNo,
      action: 'refund',
      email: email
    }
    this.props.customerConfirmation(data)
  }

  render () {
    const { invoiceNo, email } = this.props
    const { fetching, errMsg, success } = this.state
    if (fetching) {
      return <LoadingComponent style={{ flex: 1, paddingVertical: 20 }} />
    } else if (success) {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                fontFamily: fonts.regular,
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
           Terima kasih. Pengembalian dana akan segera kami proses.
              </Text>

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
                fontFamily: fonts.regular,
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
                fontFamily: fonts.regular,
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
              Apakah Anda yakin ingin melakukan pengembalian dana?
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ width: dimensions.width * 0.43, marginHorizontal: 10 }}>
                  <ButtonSecondary onPress={() => this.props.setChangeState('isActionType', 'default')}>
                    <ButtonTextSecondary>Tidak</ButtonTextSecondary>
                  </ButtonSecondary>
                </View>
                <View style={{ width: dimensions.width * 0.43, marginHorizontal: 10 }}>
                  <ButtonPrimary onPress={() => this.handleRefund(invoiceNo, email)}>
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
  reorder: state.reorder
})

const mapDispatchToProps = (dispatch) => ({
  customerConfirmation: (data) => dispatch(ReorderActions.confirmationRequest(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationRefund)

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
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: white;
  fontSize: 14;
`

const ButtonSecondary = styled.TouchableOpacity`
  backgroundColor: #008CCF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`
const ButtonTextSecondary = styled.Text`
  fontFamily: ${fonts.regular};
  textAlign: center;
  color: white;
  fontSize: 14;
`
