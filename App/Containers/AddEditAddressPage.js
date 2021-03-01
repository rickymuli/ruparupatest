import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, Platform } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Toast from 'react-native-easy-toast'
import { RemoteConfig } from '../Services/Firebase'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
import analytics from '@react-native-firebase/analytics'

// Redux
import MiscActions from '../Redux/MiscRedux'
import AddressActions from '../Redux/AddressRedux'

// Styles
import styles from './Styles/AddressStyles'

// Component
import SetLocation from '../Components/SetLocation'
import EasyModal from '../Components/EasyModal'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import PickerLocation from '../Components/PickerLocation'

class AddEditAddressPage extends Component {
  constructor (props) {
    super(props)
    this.pickerRef = null
    this.state = {
      name: '',
      fullAddress: '',
      phone: '',
      postCode: '',
      addressId: 0,
      addressName: '',
      action: '',
      addressData: '',
      geoAddress: '',
      initGeoAddress: '',
      item: '',
      geolocation: '',
      searching: false,
      mapView: false,
      nameError: ''
    }
  }
  static getDerivedStateFromProps (props, state) {
    const { address, route } = props
    let action = route.params.data?.action ?? 'nothing found...'
    let addressData = route.params.data?.address ?? 'nothing found...'
    let returnObj = {}
    if (action === 'Ubah') {
      if (!isEqual(state.addressData, addressData)) {
        let name = `${addressData.first_name} ${addressData.last_name || ''}`
        returnObj = {
          ...returnObj,
          name,
          fullAddress: addressData.full_address,
          phone: addressData.phone,
          postCode: addressData.post_code,
          addressId: addressData.address_id,
          addressName: addressData.address_name,
          geoAddress: addressData.geolocation_address,
          geolocation: addressData.geolocation,
          addressData
        }
      }
    }
    returnObj = {
      ...returnObj,
      action,
      address
    }
    return returnObj
  }

  componentDidUpdate () {
    const { address, navigation } = this.props
    if (address.success) {
      navigation.goBack()
    }
  }

  componentWillUnmount () {
    const { route } = this.props
    let token = ''
    if (route && route.params && route.params.data) {
      if (route.params.data.token) token = route.params.data.token
    }
    let data = {
      token
    }
    this.pickerRef = null
    this.initAddress()
    this.props.getAddress(data)
    this.props.resetSuccess()
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
    const { action, name, fullAddress, phone, postCode, addressId, addressName, geoAddress, geolocation } = this.state
    const { auth, route } = this.props
    const regex = /[^a-zA-Z ]/
    let customerId = ''
    let token = ''
    if (route && route.params && route.params.data) {
      if (route.params.data.token) token = route.params.data.token
      if (route.params.data.customer_id) customerId = route.params.data.customer_id
    } else {
      customerId = auth.user.customer_id
    }
    let firstName = name.trim()
    let lastName = ''
    let splitName = name.trim().split(/ (.+)/, 2)
    if (splitName.length > 1) {
      firstName = splitName[0]
      lastName = splitName[1]
    }
    if (isEmpty(name.match(regex))) {
      let data = {
        customer_id: customerId,
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
        geolocation,
        token: token
      }
      if (action === 'Ubah') {
        data = { ...data, address_id: addressId }
      }
      this.props.createAddress(data)
    } else {
      this.setState({ nameError: 'Nama Lengkap Tidak Valid' })
    }
  }

  openLocationModal () {
    const { geolocation, geoAddress } = this.state
    this.setState({ geoTemp: { geolocation, geoAddress } }, () => this.modal.setModal(true))
  }

  resetGeo () {
    const { geoTemp } = this.state
    this.setState(geoTemp)
    this.modal.setModal(false)
  }

  componentDidMount () {
    analytics().logEvent('view_add_or_edit_address')
    this.props.getProvince()
    this.checkMapView()
  }
  checkMapView () {
    RemoteConfig('map')
      .then((data) => {
        if (data.active) this.setState({ mapView: true, item: data.item })
      })
      .catch(e => console.log(e))
  }

  handleAddressFormClose = () => {
    this.initAddress()
    // this.props.navigation.navigate('AddressPage')
    this.props.navigation.goBack()
  }

  setGeolocation = (geolocation, geoAddress, callback) => {
    this.setState({ geolocation, geoAddress }, () => {
      callback && callback()
    })
  }

  setParentState = (state) => this.setState(state)

  render () {
    const { action, address, addressName, nameError, name, phone, fullAddress, postCode, addressData, geolocation, mapView, item, initGeoAddress } = this.state
    return (
      <Container style={styles.container}>
        <HeaderSearchComponent back pageName={`${action} Alamat`} leftAction={this.handleAddressFormClose.bind(this)} navigation={this.props.navigation} pageType='add-edit-address-page' />
        <ScrollView keyboardShouldPersistTaps={'always'} keyboardDismissMode='on-drag'>
          <ContentContainer>
            <ItemContainer>
              <Input placeholderTextColor='#b2bec3' placeholder='Simpan Alamat Sebagai…' underlineColorAndroid='transparent' value={addressName} onChangeText={(addressName) => this.setState({ addressName })} />
            </ItemContainer>
            <ItemContainer>
              {(isEmpty(nameError))
                ? <Input placeholderTextColor='#b2bec3' placeholder='Nama Penerima' underlineColorAndroid='transparent' value={name} onChangeText={(name) => this.setState({ name })} />
                : <ErrorInput placeholderTextColor='#b2bec3' placeholder='Nama Penerima' underlineColorAndroid='transparent' value={name} onChangeText={(name) => this.setState({ name })} />
              }
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
            {/* <View style={{ padding: 15, backgroundColor: '#E5F7FF' }}>
              <Text style={{ fontSize: 16, color: '#757885', textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>Pilih lokasi kordinat untuk dapat menggunakan GOSEND. Pastikan lokasi yang kamu pilih tidak berbeda jauh dengan alamat yang kamu isi</Text>
            </View> */}
          </ContentContainer>
          {(!isEmpty(address.err) || !isEmpty(nameError)) &&
            (
              <WarningTitle>
                <TextWarningAdress>{address.err ? address.err : nameError}</TextWarningAdress>
              </WarningTitle>
            )
          }
          <View style={{ padding: 10 }}>
            <TouchableOpacity onPress={() => { analytics().logEvent('view_save_address'); this.pickerRef() }} style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
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
      </Container>
    )
  }
}

const stateToProps = (state) => ({
  fetching: state.address.fetching,
  address: state.address,
  province: state.misc.province,
  city: state.misc.city,
  kecamatan: state.misc.kecamatan,
  misc: state.misc,
  auth: state.auth
})

const dispatchToProps = (dispatch) => ({
  createAddress: (data) => (dispatch(AddressActions.addressCreateRequest(data))),
  resetSuccess: () => (dispatch(AddressActions.addressResetSuccess())),
  getAddress: (data) => dispatch(AddressActions.addressRequest(data)),
  getProvince: () => (dispatch(MiscActions.miscProvinceRequest()))
})

export default connect(stateToProps, dispatchToProps)(AddEditAddressPage)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
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

const ErrorInput = styled.TextInput`
  color: red;
  height: 40;
`
