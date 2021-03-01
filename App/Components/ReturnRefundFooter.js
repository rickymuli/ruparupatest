import React, { Component } from 'react'
import { View, Dimensions, Text, TouchableOpacity, FlatList, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { Container, FontSizeM, Input, FormS, BR, DistributeSpaceBetween, Bold, ButtonFilledTextDisabled, ButtonFilledText, ButtonFilledPrimary, ButtonFilledDisabled } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import ReturnRefundHandlerActions from '../Redux/ReturnRefundHandlerRedux'

// Components
import EasyModal from '../Components/EasyModal'
import HeaderSearchComponent from './HeaderSearchComponent'
import PickerLocation from './PickerLocation'

class ReturnRefundFooter extends Component {
  constructor () {
    super()
    this.state = {
      selectedAddress: 'Tambah alamat penjemputan',
      addressName: '',
      name: '',
      phone: '',
      postalCode: '',
      fullAddress: '',
      selectedProvince: '',
      selectedCity: '',
      selectedKecamatan: '',
      provinceName: '',
      cityName: '',
      kecamatanName: '',
      kecamatanCode: '',
      countryId: '102',
      addressId: 0
    }
  }

  setAddress = (addressData) => {
    this.setState({
      selectedAddress: addressData.address_name,
      addressId: addressData.address_id,
      addressName: (addressData.address_name.toLowerCase() === 'tambah alamat penjemputan' && addressData.address_id === 0) ? '' : addressData.address_name,
      name: `${addressData.first_name} ${!isEmpty(addressData.last_name) ? addressData.last_name : ''}`,
      phone: addressData.phone,
      postalCode: addressData.post_code,
      fullAddress: addressData.full_address,
      selectedProvince: addressData.province.province_id,
      selectedCity: addressData.city.city_id,
      selectedKecamatan: addressData.kecamatan.kecamatan_id,
      provinceName: addressData.province.province_name,
      cityName: addressData.city.city_name,
      kecamatanName: addressData.kecamatan.kecamatan_name,
      kecamatanCode: addressData.kecamatan.kecamatan_code
    })
    this.refs.child.setModal(false)
  }

  submitData = () => {
    const { addressName, name, phone, postalCode, fullAddress, addressId, countryId, selectedProvince, provinceName, selectedCity, cityName, selectedKecamatan, kecamatanName, kecamatanCode } = this.state
    let addressData = {
      customer_id: this.props.customerId,
      address_id: addressId,
      address_name: addressName,
      first_name: name.split(' ')[0],
      last_name: name.substring(name.split(' ')[0].length, name.length),
      phone,
      full_address: fullAddress,
      country_id: countryId,
      province_id: selectedProvince,
      province_name: provinceName,
      city_id: selectedCity,
      city_name: cityName,
      kecamatan_id: selectedKecamatan,
      kecamatan_code: kecamatanCode,
      kecamatan_name: kecamatanName,
      post_code: postalCode
    }
    const { invoices, orderDate, selectedItems, itemQty } = this.props
    let listOfProducts = []
    let listOfInvoices = []
    selectedItems.forEach((data, index) => {
      let shippingCost = {
        shippingAmount: 0,
        handlingFee: 0
      }
      itemQty.forEach((qtyData) => {
        if (!isEmpty(invoices[data.invoiceIndex])) {
          if (qtyData.salesOrderItemId === invoices[data.invoiceIndex].items[data.itemIndex].sales_order_item_id) {
            shippingCost.shippingAmount += invoices[data.invoiceIndex].items[data.itemIndex].shipping_amount * qtyData.qty
            shippingCost.handlingFee += invoices[data.invoiceIndex].items[data.itemIndex].handling_fee_adjust * qtyData.qty
          }
        }
      })
      let itemQtyIndex = itemQty.findIndex(qtyData => qtyData.salesOrderItemId === invoices[data.invoiceIndex].items[data.itemIndex].sales_order_item_id)
      let qty = 1
      if (itemQtyIndex >= 0) {
        qty = itemQty[itemQtyIndex].qty
      }
      if (!isEmpty(invoices[data.invoiceIndex])) {
        listOfProducts.push({
          ...invoices[data.invoiceIndex].items[data.itemIndex],
          invoiceNo: invoices[data.invoiceIndex].invoice_no,
          orderDate,
          shipmentStatus: invoices[data.invoiceIndex].shipment_status,
          qty
        })
        let invoiceItem = {
          invoiceNo: invoices[data.invoiceIndex].invoice_no,
          deliveryMethod: invoices[data.invoiceIndex].delivery_method,
          shipmentStatus: invoices[data.invoiceIndex].shipment_status,
          shippingAmount: shippingCost.shippingAmount,
          handlingFee: shippingCost.handlingFee
        }
        if (isEmpty(find(listOfInvoices, invoiceItem))) {
          listOfInvoices.push(invoiceItem)
        }
      }
    })
    this.props.setProductForReturn(listOfProducts, listOfInvoices, addressData)
    this.props.navigation.navigate('ReturnRefundDetailPage')
  }

  setAddressData = (param, data) => this.setState({ [param]: data })

  setShippingLocation = (selectedProvince, selectedCity, selectedKecamatan, province, city, kecamatan) => {
    const { province_name: provinceName } = find(province, ['province_id', selectedProvince]) || {}
    const { city_name: cityName } = find(city, ['city_id', selectedCity]) || {}
    const { kecamatan_name: kecamatanName } = find(kecamatan, ['kecamatan_id', selectedKecamatan]) || {}
    this.setState({
      selectedProvince,
      selectedCity,
      selectedKecamatan,
      cityName,
      provinceName,
      kecamatanName
    })
    this.submitData()
  }

  renderPicker = (address) => {
    let extraAddressData = {
      address_id: 0,
      address_name: 'Tambah alamat penjemputan',
      first_name: '',
      province: {},
      city: {},
      kecamatan: {}
    }
    return (
      <FlatList
        data={address}
        ListFooterComponent={() => (
          <TouchableOpacity onPress={() => this.setAddress(extraAddressData)} style={{ marginHorizontal: 12, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row', borderBottomColor: '#E0E6ED', borderBottomWidth: 1 }}>
            <Text style={{ color: '#757885', fontFamily: 'Quicksand-Regular', fontSize: 16 }}>Tambah alamat penjemputan</Text>
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this.setAddress(item)} style={{ marginHorizontal: 12, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row', borderBottomColor: '#E0E6ED', borderBottomWidth: 1 }}>
            <Text style={{ color: '#757885', fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{item.address_name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => `address item ${index}`}
      />
    )
  }

  setParentState = (state) => {
    this.setState({ state })
  }

  render () {
    const { showData, totalItemSelected, address } = this.props
    const { name, selectedAddress, addressName, phone, postalCode, fullAddress, selectedProvince, selectedCity, selectedKecamatan } = this.state
    let obj = {
      province: {
        province_id: selectedProvince
      },
      city: {
        city_id: selectedCity
      },
      kecamatan: {
        kecamatan_id: selectedKecamatan
      }
    }
    let success = true
    const skippedStates = ['selectedProvince', 'selectedCity', 'selectedKecamatan', 'provinceName', 'cityName', 'kecamatanName', 'kecamatanCode', 'addressId']
    for (let key of Object.keys(this.state)) {
      if (isEmpty(this.state[key]) && !skippedStates.includes(key)) {
        success = false
      }
    }
    let ButtonComponent = (showData && success) ? ButtonFilledPrimary : ButtonFilledDisabled
    let ButtonTextComponent = (showData && success) ? ButtonFilledText : ButtonFilledTextDisabled
    return (
      <Container>
        {(showData) &&
          <>
            <FontSizeM>Alamat Penjemputan</FontSizeM>
            <FormS>
              <TouchableOpacity style={{ padding: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }} onPress={() => this.refs.child.setModal(true)}>
                <FontSizeM>{selectedAddress}</FontSizeM>
                <Icon name='menu-down' size={24} />
              </TouchableOpacity>
            </FormS>
            {selectedAddress.toLowerCase() === 'tambah alamat penjemputan'
              ? <>
                <FontSizeM>Nama Alamat</FontSizeM>
                <FormS>
                  <Input style={{ color: '#555761' }} value={addressName} onChangeText={(e) => this.setAddressData('addressName', e)} />
                </FormS>
            </>
              : null
            }
            <FontSizeM>Nama Lengkap</FontSizeM>
            <FormS>
              <Input style={{ color: '#555761' }} value={name} onChangeText={(e) => this.setAddressData('name', e)} />
            </FormS>
            <FontSizeM>No telepon</FontSizeM>
            <FormS>
              <Input style={{ color: '#555761' }} keyboardType='numeric' value={phone} onChangeText={e => this.setAddressData('phone', e)} />
            </FormS>
            <FontSizeM>Kode Pos</FontSizeM>
            <FormS>
              <Input style={{ color: '#555761' }} keyboardType='numeric' maxLength={5} value={postalCode} onChangeText={e => this.setAddressData('postalCode', e)} />
            </FormS>
            <PickerLocation setParentState={this.setParentState} pickerRef={ref => { this.pickerRef = ref }} address={obj} handleSubmit={this.setShippingLocation} />
            <FontSizeM>Alamat Lengkap</FontSizeM>
            <FormS>
              <TextInput
                style={{ color: '#555761', height: 100, fontFamily: 'Quicksand-Regular' }}
                value={fullAddress}
                multiline
                numberOfLines={8}
                textAlignVertical='top'
                onChangeText={e => this.setAddressData('fullAddress', e)}
              />
            </FormS>
          </>
        }
        <DistributeSpaceBetween>
          <View style={{ width: Dimensions.get('screen').width * 0.6 }}>
            <FontSizeM>Jumlah produk yang akan dikembalikan</FontSizeM>
          </View>
          <Bold>{totalItemSelected} pcs</Bold>
        </DistributeSpaceBetween>
        <BR />
        <ButtonComponent onPress={() => this.submitData()}>
          <ButtonTextComponent>Lanjut</ButtonTextComponent>
        </ButtonComponent>
        <EasyModal ref='child' size={80}>
          <HeaderSearchComponent pageName='Pilih Alamat' close rightAction={() => this.refs.child.setModal(false)} />
          {!isEmpty(address) && this.renderPicker(address)}
        </EasyModal>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  setProductForReturn: (products, invoices, address) => dispatch(ReturnRefundHandlerActions.setProductForReturn(products, invoices, address))
})

export default connect(null, mapDispatchToProps)(ReturnRefundFooter)
