import React, { Component } from 'react'
import { View, Text, TextInput, Dimensions, SafeAreaView, FlatList, Linking, TouchableOpacity, Platform } from 'react-native'
// import config from '../../config'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
// import AddToCartButton from '../Components/AddToCartButton'
import map from 'lodash/map'
import ceil from 'lodash/ceil'
import sortBy from 'lodash/sortBy'
import get from 'lodash/get'
import { getDistance } from 'geolib'
import RNLocation from 'react-native-location'

// Styles
import styles from '../Containers/Styles/ProductDetailPageStyles'
import styled from 'styled-components'

// Redux Action
import LocationActions from '../Redux/LocationRedux'

class PickupModal extends Component {
  constructor (props) {
    super(props)
    this.LocationSubs = [{}]
    this.state = {
      searchTerm: '',
      activePickup: '',
      locationSubs: {}
    }
  }

  setModalVisible (visible) {
    this.props.setModalVisible(visible)
  }

  searchUpdated (term) {
    this.setState({ searchTerm: term })
  }

  getDistanceKm (geo) {
    const { locationSubs } = this.state
    let ipLocation = this.props.ipLocation || {}
    var res = geo.split(',')
    let latitude = locationSubs.latitude || ipLocation.latitude || -6.1906
    let longitude = locationSubs.longitude || ipLocation.longitude || 106.7436
    let des = getDistance(
      { latitude, longitude },
      { latitude: res[0] || '', longitude: res[1] || '' },
      0.01
    )
    return ceil(des / 1000, 2)
  }

  componentWillUnmount () {
    this.LocationSubs = null
  }

  componentDidMount () {
    if (!this.props.ipLocation) {
      this.props.ipLocationRequest()
    }
    try {
      RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse'
        }
      }).then(granted => {
        if (granted) {
          this.LocationSubs = RNLocation.subscribeToLocationUpdates(locations => {
            if (isArray(locations)) {
              this.setState({ locationSubs: locations[0] })
            }
          })
        }
      })
    } catch (error) {

    }
  }

  filterData (stops) {
    let data = map(stops, (v) => {
      let newData = JSON.parse(JSON.stringify(v))
      newData['distance'] = v.pickup_data.geolocation ? this.getDistanceKm(v.pickup_data.geolocation) : 'unknown'
      return newData
    })
    data = sortBy(data, ['distance'])
    return data
  }

  openGps (pickupData) {
    var res = pickupData.geolocation.split(',')
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${res[0]},${res[1]}`
    const label = pickupData.pickup_name
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    })
    Linking.openURL(url)
  }

  findKecamatan (item, keyword) {
    let startIdx = item.indexOf(keyword)
    let kecamatan = item.substring(startIdx + 4)
    return kecamatan
  }

  filterBySearchTerm (stockFiltered, searchTerm) {
    let regex = /\s/g
    let searchName = searchTerm.toString().toLowerCase().replace(regex, '')
    let filteredItem = stockFiltered.filter(item =>
      item.store.name.toLowerCase().replace(regex, '').includes(searchName) ||
      this.findIndexFrom(item.pickup_data.address_line_2.replace(regex, '').toLowerCase(), 'kec.').includes(searchName)
    )
    return filteredItem
    // return stockFiltered.filter(o =>
    //   Object.keys(o).some(k => o[k].toString().toLowerCase().includes(searchTerm.toString().toLowerCase())))
  }

  setPickup (deliveryMethod, item) {
    const { activeVariant, quantity, setPickup, setModalVisible, route } = this.props
    let data = {
      activeVariant,
      quantity,
      sku: get(activeVariant, 'sku'),
      deliveryMethod,
      storeName: get(item, 'pickup_data.pickup_name', ''),
      storeCode: get(item, 'store.store_code', ''),
      pickupCode: get(item, 'pickup_code', ''),
      distance: get(item, 'distance', ''),
      itmData: route.params?.itmParameter ?? {}
    }
    setPickup(data)
    setModalVisible(false)
  }

  renderPickupLocationList = (stops) => {
    let data = this.filterData(stops)
    return (
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <View style={{ borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 15 }} key={`${item.pickup_code} stops ${index}`}>
              <Text style={{ marginBottom: 2, fontSize: 18, fontFamily: 'Quicksand-Bold' }}>{item.pickup_data.pickup_name}</Text>
              <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                <EvilIcons name={'location'} size={16} />
                <Text style={{ fontFamily: 'Quicksand-Regular', paddingLeft: 2, fontSize: 16 }}>{item.distance} km</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
                <TouchableOpacity onPress={() => this.openGps(item.pickup_data)} style={{ justifyContent: 'center', alignItems: 'center', width: '40%' }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular', fontSize: 18, textAlign: 'center' }}>Lihat Map</Text>
                </TouchableOpacity>
                {(this.state.activePickup === item.pickup_code)
                  ? <TouchableOpacity onPress={() => this.setPickup('delivery', item)} style={styles.buttonPickup}>
                    <Text style={styles.buttonText}>{'Terpilih'}</Text>
                  </TouchableOpacity>
                  : <TouchableOpacity onPress={() => this.setPickup('pickup', item)} style={styles.buttonPickup}>
                    <Text style={styles.buttonText}>{'Pilih Toko'}</Text>
                  </TouchableOpacity>
                  // ? <AddToCartButton
                  //   page={'pickupmodal'}
                  //   itmData={this.props.navigation.getParam('itmParameter', {})}
                  //   data={{ sku, activeVariant, quantity, deliveryMethod: 'delivery', storeCode: '', pickupCode: '' }} buttonText={'Terpilih'}
                  //   modalHide={this.setModalVisible.bind(this)}
                  //   navigation={this.props.navigation} />
                  // : <AddToCartButton
                  //   itmData={this.props.navigation.getParam('itmParameter', {})}
                  //   page={'pickupmodal'}
                  //   data={{ sku, activeVariant, quantity, deliveryMethod: 'pickup', storeCode: item.store.store_code, pickupCode: item.pickup_code }} buttonText={'Pilih'}
                  //   modalHide={this.setModalVisible.bind(this)}
                  //   navigation={this.props.navigation} />
                }
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
        />
      </View>
    )
  }

  render () {
    const { searchTerm } = this.state
    let stockFiltered = this.props.stockFiltered
    if (stockFiltered && searchTerm.length > 0) stockFiltered = this.filterBySearchTerm(stockFiltered, searchTerm)

    return (
      <SafeAreaView style={{ backgroundColor: 'white', flexDirection: 'column', flex: 1 }}>
        <ModalHeader>
          <Icon name='close-circle' size={24} color='white' />
          <TextModal>Pilih Toko</TextModal>
          <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => this.setModalVisible(false)} />
        </ModalHeader>
        <FormS style={{ marginTop: 15 }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='magnify' color={'#757885'} />
          <TextInput
            selectionColor='rgba(242, 101, 37, 1)'
            underlineColorAndroid='transparent'
            onChangeText={(term) => { this.searchUpdated(term) }}
            placeholder='Pilih lokasi toko yang Anda inginkan'
            placeholderTextColor='#b2bec3'
            value={searchTerm}
            style={{ height: 40, textDecorationColor: 'white', color: '#F26525', width: Dimensions.get('screen').width * 0.85 }}
          />
        </FormS>
        <View style={{ padding: 15, backgroundColor: '#E5F7FF', marginHorizontal: 10 }}>
          <Text style={{ fontFamily: 'Quicksand-Regular' }}>
            <Icon name='information-outline' color='#757885' size={18} /> Anda memilih untuk <Text style={{ fontWeight: '700' }}>mengambil sendiri</Text> pesanan di toko pilihan Anda ACE/Informa.
          </Text>
        </View>
        <View style={{ flex: 1, paddingLeft: 10, paddingRight: 10, marginTop: 15 }}>
          {(stockFiltered.length > 0)
            ? this.renderPickupLocationList(stockFiltered)
            : <Text style={{ textAlign: 'center', fontSize: 16, color: '#757886', fontFamily: 'Quicksand-Regular' }}><Icon name='information' size={20} />Maaf, lokasi pengambilan Anda tidak ditemukan</Text>
          }
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state) => ({
  ipLocation: state.location.ipLocation
})

const dispatchToProps = (dispatch) => ({
  ipLocationRequest: () => dispatch(LocationActions.ipLocationRequest())
})

export default connect(mapStateToProps, dispatchToProps)(PickupModal)

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
font-family:Quicksand-Bold;
`

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
  margin-horizontal: 10px;
  flex-direction: row;
`
