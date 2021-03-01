import React, { Component } from 'react'
import { View, Text, Dimensions, Platform, TouchableOpacity } from 'react-native'
import { Picker } from '@react-native-community/picker'
import { isEmpty } from 'lodash'
import { connect } from 'react-redux'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import ReorderActions from '../Redux/ReorderRedux'
import AddressActions from '../Redux/AddressRedux'

import styled from 'styled-components'

import LoadingComponent from '../Components/LoadingComponent'
import EasyModal from '../Components/EasyModal'
import { NumberWithCommas } from '../Utils/Misc'

const { width } = Dimensions.get('screen')

class ConfirmationDelivery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      addressSelected: 0,
      addressName: 'Pilih Alamat',
      addressList: [],
      showModal: false,
      successConfirmation: false,
      successDelivery: false,
      shipping_amount: '',
      selectedAddressDetail: ''

    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnData = {}
    if (!isEmpty(props.reorder)) {
      if (props.reorder.fetching !== state.fetching) {
        returnData = { ...returnData, fetching: props.reorder.fetching }
      }
      if (props.reorder.successConfirmation !== state.successConfirmation) {
        returnData = { ...returnData, successConfirmation: props.reorder.successConfirmation }
      }
      if (props.reorder.successDelivery !== state.successDelivery) {
        if (props.reorder.cartData) {
          if (props.reorder.cartData.cart_id && props.reorder.cartData.cart_id !== state.cartId) {
            props.navigation.navigate('PaymentPage', { cart_id: props.reorder.cartData.cart_id, from: 'ConfirmationReorder' })
            // props.reorderInit()
          }
        }
        returnData = { ...returnData, successDelivery: props.reorder.successDelivery }
      }

      if (props.confirmationData && !isEmpty(props.confirmationData) && props.confirmationData.shipping_amount !== state.shippingAmount) {
        returnData = { ...returnData, shippingAmount: props.confirmationData.shipping_amount }
      }

      if (props.reorder.err !== state.errMsg) returnData = { ...returnData, errMsg: props.reorder.err }
    }

    if (!isEmpty(props.address) && !isEmpty(props.address.data) && props.address.data !== state.addressList) returnData = { ...returnData, addressList: props.address.data }

    return returnData
  }

  componentDidMount () {
    const { token } = this.props
    let data = {
      token
    }
    this.props.getAddress(data)
  }

  handleAddModalClose = () => {
    this.setState({
      addressSelected: 0,
      showModal: false
    })
  }

  handleConfirmation = (invoiceNo, email) => {
    const { addressSelected } = this.state
    let data = {
      invoice_no: invoiceNo,
      action: 'delivery',
      customer_address_id: parseInt(addressSelected),
      email: email
    }
    this.props.customerConfirmation(data)
  }

  handleDelivery = (invoiceNo, email) => {
    let data = { invoice_no: invoiceNo, email: email }
    this.props.deliveryConfirmation(data)
  }

  renderPicker = () => {
    const { addressList, addressSelected } = this.state
    const { token, customerId } = this.props
    return (<Picker
      style={{ height: width * 0.1, fontSize: 14 }}
      selectedValue={addressSelected}
      onValueChange={(value, index) => {
        if (value === 'new') {
          this.setState({ addressSelected: '0' })
          this.props.navigation.navigate('AddEditAddressPage', { data: { action: 'Tambah', address: null, from: 'Confirmation', token: token, customer_id: customerId } })
          this.refs.pick.setModal(false)
        }
        this.setState({ selectedAddressDetail: addressList[index - 1], addressSelected: value, addressName: (addressList[index] ? addressList[index].address_name : 'Pilih Alamat') })
      }}>
      {Platform.OS === 'android' && <Picker.Item label='Pilih Alamat' value='0'></Picker.Item>}
      {!isEmpty(addressList) &&
      addressList.map((address, index) => (
        <Picker.Item key={index} label={address.address_name} value={address.address_id}></Picker.Item>
      ))
      }
      <Picker.Item label='+ Tambah Alamat baru' value={'new'}></Picker.Item>
    </Picker>)
  }

  render () {
    const { addressSelected, shippingAmount, fetching, successConfirmation, addressName, selectedAddressDetail } = this.state
    const { invoiceNo, email } = this.props
    if (fetching) {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <View style={{
                flexDirection: 'row',
                marginVertical: 10
              }}>
                <View style={{ width: width * 0.9 }}>
                  <Icon
                    style={{ paddingVertical: 8, textAlign: 'left' }}
                    color={'#555761'}
                    name='arrow-left'
                    size={20}
                    onPress={() => this.props.setChangeState('isActionType', 'default')}
                  />
                </View>
                <View style={{ position: 'absolute', width: width * 0.9, zIndex: -1 }}>
                  <Text style={{
                    fontFamily: 'Quicksand-Bold',
                    fontSize: 14,
                    textAlign: 'center',
                    paddingVertical: 8 }}>
          Pilih Alamat Anda
                  </Text>
                </View>

              </View>
              <View style={{ paddingVertical: 50 }} >
                <LoadingComponent />
              </View>
            </View>

          </DelivBox>
        </View>
      )
    } else if (successConfirmation) {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{
                fontFamily: 'Quicksand-Regular',
                fontSize: 14,
                paddingVertical: 10,
                textAlign: 'center' }}>
          Jika Anda memilih pesanan Anda untuk dikirimkan maka akan terkena biaya ongkir sebanyak <Text style={{ fontFamily: 'Quicksand-Bold' }}>Rp.{NumberWithCommas(shippingAmount)}</Text>
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ width: width * 0.43 }}>
                  <ButtonSecondary onPress={() => { this.props.handleInit(); this.props.setChangeState('isActionType', 'default') }}>
                    <ButtonTextSecondary>Tidak</ButtonTextSecondary>
                  </ButtonSecondary>
                </View>
                <View style={{ width: width * 0.43 }}>
                  <ButtonPrimary onPress={() => this.handleDelivery(invoiceNo, email)}>
                    <ButtonTextPrimary>Ya</ButtonTextPrimary>
                  </ButtonPrimary>
                </View>
              </View>
            </View>
          </DelivBox>
        </View>
      )
    } else {
      return (
        <View style={{ paddingVertical: 15 }}>
          <DelivBox >
            <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
              <View style={{
                flexDirection: 'row',
                marginVertical: 10
              }}>
                <View style={{ width: width * 0.9 }}>
                  <Icon
                    style={{ paddingVertical: 8, textAlign: 'left' }}
                    color={'#555761'}
                    name='arrow-left'
                    size={20}
                    onPress={() => this.props.setChangeState('isActionType', 'default')}
                  />
                </View>
                <View style={{ position: 'absolute', width: width * 0.9, zIndex: -1 }}>
                  <Text style={{
                    fontFamily: 'Quicksand-Bold',
                    fontSize: 16,
                    textAlign: 'center',
                    paddingVertical: 8 }}>
          Pilih Alamat Anda
                  </Text>
                </View>
              </View>

              <View style={{ position: 'relative', backgroundColor: 'white', marginVertical: 10 }}>
                {Platform.OS === 'android' ? this.renderPicker()
                  : <TouchableOpacity onPress={() => this.refs.pick.setModal(true)} style={{ height: width * 0.1, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 14, textAlign: 'center' }}>{addressName}</Text>
                  </TouchableOpacity>
                }
              </View>
              {selectedAddressDetail && !isEmpty(selectedAddressDetail)
                ? <View style={{ marginTop: 10, marginBottom: 5 }}>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Nama Penerima</Text>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>{selectedAddressDetail.first_name}</Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Email</Text>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>{email}</Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Alamat</Text>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>{selectedAddressDetail.address_name + ' - ' + selectedAddressDetail.full_address.charAt(0).toUpperCase() + selectedAddressDetail.full_address.toLowerCase().slice(1) + ' ' + selectedAddressDetail.kecamatan.kecamatan_name.charAt(0).toUpperCase() + selectedAddressDetail.kecamatan.kecamatan_name.toLowerCase().slice(1) },{ ' ' + selectedAddressDetail.city.city_name.charAt(0).toUpperCase() + selectedAddressDetail.city.city_name.toLowerCase().slice(1) }</Text>
                  </View>
                  <View style={{ marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Bold' }}>No Telepon</Text>
                    <Text style={{ fontFamily: 'Quicksand-Regular' }}>{selectedAddressDetail.phone}</Text>
                  </View>
                </View>
                : null
              }

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                <View style={{ width: width * 0.43 }}>
                  {addressSelected === 0 || addressSelected === 'new'
                    ? <ButtonDisabled><ButtonTextDisabled>Pilih</ButtonTextDisabled></ButtonDisabled>
                    : <ButtonSecondary onPress={() => this.handleConfirmation(invoiceNo, email)}>
                      <ButtonTextSecondary>Pilih</ButtonTextSecondary>
                    </ButtonSecondary>
                  }
                </View>
              </View>
            </View>
          </DelivBox>
          <EasyModal ref='pick' size={45} title={'Pilih alamat'} close>
            <View style={{ paddingHorizontal: 20, justifyContent: 'space-between', flexDirection: 'column' }}>
              {this.renderPicker()}
            </View>
          </EasyModal>
        </View>
      )
    }
  }
}

const stateToProps = (state) => ({
  reorder: state.reorder,
  address: state.address,
  confirmationData: state.reorder.confirmationData

})

const dispatchToProps = (dispatch) => ({
  getAddress: (data) => dispatch(AddressActions.addressRequest(data)),
  reorderInit: () => dispatch(ReorderActions.reorderInit()),
  customerConfirmation: (data) => dispatch(ReorderActions.confirmationRequest(data)),
  deliveryConfirmation: (data) => dispatch(ReorderActions.confirmationDeliveryRequest(data))
})

export default connect(stateToProps, dispatchToProps)(ConfirmationDelivery)

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
const ButtonDisabled = styled.TouchableOpacity`
   background-color: #E5E9F2;
   borderRadius: 5;
   padding: 10px;
   marginBottom: 10px;
`

const ButtonTextDisabled = styled.Text`
  fontFamily: Quicksand-Regular;
  textAlign: center;
  fontSize: 14;
  `
