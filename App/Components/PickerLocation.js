import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ScrollView, ActivityIndicator, TextInput } from 'react-native'
import { connect } from 'react-redux'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import find from 'lodash/find'
import upperFirst from 'lodash/upperFirst'
import map from 'lodash/map'
import includes from 'lodash/includes'
import Icon from 'react-native-vector-icons/Ionicons'

// import Lottie from '../Components/LottieComponent'
// Redux
import MiscActions from '../Redux/MiscRedux'

// Component
import EasyModal from '../Components/EasyModal'

// Context
import { WithContext } from '../Context/CustomContext'

class PickerLocation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedCity: get(props.address, 'city.city_id', ''),
      selectedKecamatan: get(props.address, 'kecamatan.kecamatan_id', ''),
      selectedProvince: get(props.address, 'province.province_id', ''),
      selectedModal: '',
      search: '',
      translate: {
        province: 'Provinsi',
        city: 'Kota',
        kecamatan: 'Kecamatan'
      },
      address: null
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.address) && !isEqual(props.address, state.address)) {
      returnObj = {
        ...returnObj,
        address: props.address
      }
      if (!isEqual(props.address.province.province_id, state.selectedProvince)) {
        returnObj = {
          ...returnObj,
          selectedProvince: props.address.province.province_id
        }
      }
      if (!isEqual(props.address.city.city_id, state.selectedCity)) {
        returnObj = {
          ...returnObj,
          selectedCity: props.address.city.city_id
        }
      }
      if (!isEqual(props.address.kecamatan.kecamatan_id, state.selectedKecamatan)) {
        returnObj = {
          ...returnObj,
          selectedKecamatan: props.address.kecamatan.kecamatan_id
        }
      }
    }
    return returnObj
  }

  componentDidMount () {
    const { selectedProvince, selectedCity, selectedKecamatan } = this.state
    this.props.pickerRef(this.sendState)
    if (!isEmpty(selectedProvince)) this.props.getCity(selectedProvince)
    if (!isEmpty(selectedCity)) this.props.getKecamatan(selectedCity)
    if (!isEmpty(selectedKecamatan)) this.setInitGeoAddress()
  }

  componentDidUpdate (prevProps, prevState) {
    const { selectedKecamatan } = this.state
    if (this.state.selectedProvince !== prevState.selectedProvince) {
      const { selectedProvince, selectedCity } = this.state
      if (!isEmpty(selectedProvince)) this.props.getCity(selectedProvince)
      if (!isEmpty(selectedCity)) this.props.getKecamatan(selectedCity)
    }
    if (prevProps.kecamatan !== this.props.kecamatan || prevState.selectedKecamatan !== selectedKecamatan) {
      this.setInitGeoAddress()
    }
  }

  setInitGeoAddress () {
    let provinceName = this.getAddressName('province')
    let cityName = this.getAddressName('city')
    let kecamatanName = this.getAddressName('kecamatan')
    if (kecamatanName === 'Pilih Kecamatan') this.props.setParentState({ initGeoAddress: '' })
    else this.props.setParentState({ initGeoAddress: `${kecamatanName}+${cityName}+${provinceName}` })
  }

  changeLocationData = (id) => {
    const { selectedModal } = this.state
    if (selectedModal === 'province') {
      this.setState({ selectedCity: '', selectedKecamatan: '', selectedModal: 'city', search: '' }, () => this.props.getCity(id))
    } else if (selectedModal === 'city') {
      this.setState({ selectedKecamatan: '', selectedModal: 'kecamatan', search: '' }, () => this.props.getKecamatan(id))
    }
    this.setState({ [`selected${upperFirst(selectedModal)}`]: id }, () => selectedModal === 'kecamatan' && this.refs.child.setModal(false))
  }

  getAddressName (param) {
    const { translate, [`selected${upperFirst(param)}`]: key } = this.state
    const { [param]: data } = this.props
    let found = find(data, [`${param}_id`, key])
    return get(found, `${param}_name`, `Pilih ${translate[param]}`)
  }

  sendState = () => {
    const { selectedProvince, selectedCity, selectedKecamatan } = this.state
    const { province, city, kecamatan } = this.props
    this.props.handleSubmit(selectedProvince, selectedCity, selectedKecamatan, province, city, kecamatan)
  }

  renderPicker () {
    const { selectedModal, search, translate } = this.state
    const { misc, [selectedModal]: data } = this.props
    return (
      <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column', paddingBottom: 2 }}>
        <View style={{ flexDirection: 'row', marginHorizontal: 8, backgroundColor: '#F0F2F7', borderRadius: 8, paddingLeft: 4, marginBottom: 4 }}>
          <IconContainer>
            <Icon name={'ios-search'} size={20} color={'#757885'} />
          </IconContainer>
          <TextInput
            autoCapitalize='characters'
            value={search}
            autoFocus
            onChangeText={(v) => this.setState({ search: v })}
            placeholder={`Cari ${translate[selectedModal]}...`}
            placeholderTextColor='#b2bec3'
            style={{ height: 38, fontFamily: 'Quicksand-Regular', color: '#757885' }} />
        </View>
        <ScrollView keyboardShouldPersistTaps={'handled'}>
          { (misc.fetchingKecamatan || misc.fetchingCity || misc.fetching)
            ? <ActivityIndicator size={'large'} style={{ marginTop: 10, alignSelf: 'center' }} />
            : map(data, (item, i) => {
              if (includes(item[`${selectedModal}_name`], search)) {
                return (
                  <TouchableOpacity onPress={() => this.changeLocationData(item[`${selectedModal}_id`])} key={i} style={{ marginHorizontal: 12, paddingVertical: 10, justifyContent: 'space-between', flexDirection: 'row', borderBottomColor: '#E0E6ED', borderBottomWidth: 1 }}>
                    <Text style={{ color: '#757885', fontFamily: 'Quicksand-Regular', fontSize: 16 }}>{item[`${selectedModal}_name`]}</Text>
                  </TouchableOpacity>
                )
              }
            })}
        </ScrollView>
      </View>
    )
  }

  render () {
    const { selectedModal, translate } = this.state
    const { misc } = this.props
    return (
      <>
        <View>
          {map(['province', 'city', 'kecamatan'], (value, key) => (
            <ItemContainer key={key}>
              {misc[`fetching${upperFirst(value)}`]
                ? <ActivityIndicator style={{ height: 40 }} color={'#FF7F45'} />
                : <TouchableOpacity style={{ height: 40, justifyContent: 'center' }} onPress={() => this.setState({ selectedModal: value, search: '' }, () => this.refs.child.setModal())}>
                  <Text style={{ color: '#757885', fontFamily: 'Quicksand-Medium' }}> {this.getAddressName(value)} </Text>
                </TouchableOpacity>
              }
            </ItemContainer>
          ))}
        </View>
        <EasyModal ref='child' size={80}>
          <View style={{ paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row', justifyContent: 'space-between' }} >
            <Text style={{ color: '#757886', fontFamily: 'Quicksand-Bold', fontSize: 18 }}>{`Pilih ${translate[selectedModal]}`}</Text>
            <TouchableOpacity onPress={() => this.refs.child.setModal(false)} >
              <Icon name={'md-close'} size={24} />
            </TouchableOpacity>
          </View>
          {!isEmpty(selectedModal) && this.renderPicker(selectedModal)}
        </EasyModal>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  province: state.misc.province,
  city: state.misc.city,
  kecamatan: state.misc.kecamatan,
  misc: state.misc
})

const mapDispatchToProps = (dispatch) => ({
  getProvince: () => (dispatch(MiscActions.miscProvinceRequest())),
  getCity: (provinceId) => (dispatch(MiscActions.miscCityRequest(provinceId))),
  getKecamatan: (cityId) => (dispatch(MiscActions.miscKecamatanRequest(cityId)))
})

export default WithContext(connect(mapStateToProps, mapDispatchToProps)(PickerLocation))

const ItemContainer = styled.View`
  borderColor: #E0E6ED;
  borderWidth: 1;
  borderRadius: 3;
  marginBottom: 10;
  padding-left: 10px;
`

const IconContainer = styled.View`
  align-self: center;
  margin-horizontal: 8px;
`
