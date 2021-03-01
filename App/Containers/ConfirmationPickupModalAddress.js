import React, { Component } from 'react'
import { View, Modal, SafeAreaView, Text, TouchableOpacity, Platform, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'

import Toast from 'react-native-easy-toast'
import { connect } from 'react-redux'

import { RemoteConfig } from '../Services/Firebase'

import EasyModal from '../Components/EasyModal'
import SetLocation from '../Components/SetLocation'
import PickerLocation from '../Components/PickerLocation'

import MiscActions from '../Redux/MiscRedux'
import AddressActions from '../Redux/AddressRedux'

import isEmpty from 'lodash/isEmpty'

class ConfirmationPickupModalAddress extends Component {
  constructor (props) {
    super(props)
    this.pickerRef = null
    this.state = {
      name: '',
      fullAddress: '',
      phone: '',
      postCode: '',
      addressName: '',
      addressData: [],
      mapView: false,
      showModal: false,
      geoAddress: '',
      initGeoAddress: ''

    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnData = {}
    if (props.address !== state.address) {
      returnData = { ...returnData, address: props.address }
    }

    if (props.showModal !== state.showModal) {
      returnData = { ...returnData, showModal: props.showModal }
    }

    return returnData
  }

  setParentState = (state) => this.setState(state)

  setGeolocation = (geolocation, geoAddress, callback) => {
    this.setState({ geolocation, geoAddress }, () => {
      callback && callback()
    })
  }

  resetGeo () {
    const { geoTemp } = this.state
    this.setState(geoTemp)
    this.modal.setModal(false)
  }

  openLocationModal () {
    const { geolocation, geoAddress } = this.state
    this.setState({ geoTemp: { geolocation, geoAddress } }, () => this.modal.setModal(true))
  }

  checkMapView () {
    RemoteConfig('map')
      .then((data) => {
        if (data.active) this.setState({ mapView: true, item: data.item })
      })
      .catch(e => console.log(e))
  }

  componentDidMount () {
    this.props.getProvince()
    this.checkMapView()
  }

  initAddress = () => {
    this.setState({
      name: '',
      fullAddress: '',
      phone: '',
      postCode: '',
      addressId: 0,
      addressName: ''
    })
  }

  handleSubmit = (selectedProvince, selectedCity, selectedKecamatan) => {
    const { name, fullAddress, phone, postCode, addressName, geoAddress, geolocation } = this.state
    const { auth } = this.props
    let firstName = name.trim()
    let lastName = ''
    let splitName = name.trim().split(/ (.+)/, 2)
    if (splitName.length > 1) {
      firstName = splitName[0]
      lastName = splitName[1]
    }

    let data = {
      customer_id: auth.user.customer_id,
      first_name: firstName,
      last_name: lastName,
      full_address: fullAddress,
      phone: phone,
      post_code: postCode,
      province: {
        province_id: selectedProvince
      },
      city: {
        city_id: selectedCity
      },
      kecamatan: {
        kecamatan_id: selectedKecamatan
      },
      address_name: addressName,
      geolocation_address: geoAddress,
      geolocation
    }

    this.props.createAddress(data)
    this.initAddress()
    this.props.getAddress()
    this.props.handleAddModalClose()
  }

  render () {
    const { showModal } = this.state

    const { addressName, name, phone, fullAddress, postCode, addressData, geolocation, mapView, item, initGeoAddress } = this.state
    const { address } = this.state

    return (
      <View style={{ flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22 }}>
        <Modal
          animationType='slide'
          transparent={false}
          visible={showModal}
          onRequestClose={() => { this.props.handleAddModalClose() }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <ModalHeader>
              <Icon name='close-circle' size={24} color='white' />
              <TextModal>Tambahkan Alamat Pengiriman</TextModal>
              <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => { this.props.handleAddModalClose() }} />
            </ModalHeader>

            <ScrollView keyboardShouldPersistTaps={'always'} keyboardDismissMode='on-drag'>
              <ContentContainer>
                <ItemContainer>
                  <Input placeholderTextColor='#b2bec3' placeholder='Simpan Alamat Sebagai…' underlineColorAndroid='transparent' value={addressName} onChangeText={(addressName) => this.setState({ addressName })} />
                </ItemContainer>
                <ItemContainer>
                  <Input placeholderTextColor='#b2bec3' placeholder='Nama Penerima' underlineColorAndroid='transparent' value={name} onChangeText={(name) => this.setState({ name })} />
                </ItemContainer>
                <ItemContainer>
                  <Input placeholderTextColor='#b2bec3' placeholder='No Telepon' underlineColorAndroid='transparent' value={phone} onChangeText={(phone) => this.setState({ phone })} maxLength={15} keyboardType='numeric' returnKeyType='done' />
                </ItemContainer>
                <ItemContainer>
                  <Input style={{ height: 50 }} textContentType='addressCityAndState' underlineColorAndroid='transparent' multiline={Platform.OS !== 'ios'} numberOfLines={4} placeholder='Alamat' placeholderTextColor='#b2bec3' value={fullAddress} onChangeText={(fullAddress) => this.setState({ fullAddress })} />
                </ItemContainer>
                <PickerLocation setParentState={this.setParentState} pickerRef={ref => { this.pickerRef = ref }} address={addressData} handleSubmit={this.handleSubmit} />
                <ItemContainer>
                  <Input
                    returnKeyType='done'
                    underlineColorAndroid='transparent'
                    placeholderTextColor='#b2bec3'
                    placeholder='Kode Pos' value={postCode}
                    onChangeText={(postCode) => this.setState({ postCode })}
                    keyboardType='numeric'
                    maxLength={5} />
                </ItemContainer>
                {(mapView && !isEmpty(initGeoAddress)) &&
                  <View>
                    <TouchableOpacity onPress={() => this.openLocationModal()}>
                      <MarginVertical>
                        <Text style={{ color: '#757885', fontSize: 16, fontFamily: 'Quicksand-Regular' }}><Icon name='map-marker' color='#757885' size={18} />{!isEmpty(geolocation) ? `(Pinpoint sudah diatur)` : 'Pilih Koordinat Lokasi Untuk Go-Send'}</Text>
                        {/* {!isEmpty(geoAddress) && <Text style={{ color: '#757885', fontSize: 16, fontFamily: 'Quicksand-Regular' }}>{geoAddress}</Text>} */}
                      </MarginVertical>
                    </TouchableOpacity>
                  </View>
                }
                <View style={{ padding: 15, backgroundColor: '#E5F7FF' }}>
                  <Text style={{ fontSize: 16, color: '#757885', textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>Pilih lokasi kordinat untuk dapat menggunakan GOSEND. Pastikan lokasi yang kamu pilih tidak berbeda jauh dengan alamat yang kamu isi</Text>
                </View>
              </ContentContainer>
              {(!isEmpty(address.err)) &&
            (
              <WarningTitle>
                <TextWarningAdress>{address.err}</TextWarningAdress>
              </WarningTitle>
            )
              }
              <View style={{ padding: 10 }}>
                <TouchableOpacity onPress={() => this.pickerRef()} style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
                  <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Simpan</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <EasyModal ref={(ref) => { this.modal = ref }} size={96}>
              <View style={{ paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row-reverse', justifyContent: 'space-between' }} >
                <TouchableOpacity onPress={() => this.resetGeo()} >
                  <Icon name={'close'} size={24} />
                </TouchableOpacity>
                <Text style={{ color: '#757886', fontFamily: 'Quicksand-Bold', fontSize: 20 }}>{'Atur lokasi GO-SEND'}</Text>
              </View>
              <SetLocation initGeoAddress={initGeoAddress} geolocation={geolocation} item={item} navigation={this.props.navigation} modal={this.modal} setGeolocation={this.setGeolocation.bind(this)} />
            </EasyModal>
            <Toast
              ref='toast'
              style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
              position='top'
              positionValue={0}
              fadeInDuration={750}
              fadeOutDuration={1500}
              opacity={1}
              textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
            />
          </SafeAreaView>

        </Modal>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  address: state.address,
  province: state.misc.province,
  city: state.misc.city,
  kecamatan: state.misc.kecamatan,
  misc: state.misc,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  createAddress: (data) => (dispatch(AddressActions.addressCreateRequest(data))),
  getProvince: () => (dispatch(MiscActions.miscProvinceRequest())),
  resetSuccess: () => (dispatch(AddressActions.addressResetSuccess())),
  getAddress: () => dispatch(AddressActions.addressRequest())
})

export default connect(stateToProps, dispatchToProps)(ConfirmationPickupModalAddress)

const ModalHeader = styled.View`
flex-direction:row;
justify-content:space-between;
width: 100%;
border-bottom-width: 1px;
border-bottom-color: #D4DCE6;
padding: 15px;
`

const TextModal = styled.Text`
text-align:center;
flex-grow:1;
font-size:16px;
color: #757886;
font-family: Quicksand-Bold;
`

const ContentContainer = styled.View`
  flexDirection: column;
  padding: 10px;
`

const WarningTitle = styled.View`
  borderWidth: 1;
  borderColor: #ebccd1;
  backgroundColor: #f2dede;
  padding: 15px;
  borderRadius: 4;
  marginBottom: 20 ;
`
const TextWarningAdress = styled.Text`
  color: #a94442 ;
  font-family: Quicksand-Regular
`

const ItemContainer = styled.View`
  borderColor: #E0E6ED;
  borderWidth: 1;
  borderRadius: 3;
  marginBottom: 10;
  padding-left: 10px;
`

const MarginVertical = styled.View`
  marginVertical:15px;
`

const Input = styled.TextInput`
  color: #757885;
  height: 40;
`
