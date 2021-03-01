import React, { Component } from 'react'
import { View, TouchableOpacity, Keyboard, Text, TextInput, Image, FlatList, Dimensions, Platform } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import Geocoder from 'react-native-geocoding'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'
import styled from 'styled-components'
import RNGooglePlaces from 'react-native-google-places'
// import firebase from '@react-native-firebase/app'
import crashlytics from '@react-native-firebase/crashlytics'
import analytics from '@react-native-firebase/analytics'
import RNLocation from 'react-native-location'

// Styles
import styles from '../Containers/Styles/AddressStyles'

// Component
import Loading from '../Components/LoadingComponent'

const { height } = Dimensions.get('screen')
class SetLocation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      action: '',
      addressData: '',
      addressMap: '',
      searchAddress: '',
      searchResults: [],
      searching: false,
      firstUpdate: true,
      region: {
        latitude: -6.1906502,
        longitude: 106.7437259,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      },
      changePinPoint: true
    }
    this.onRegionChange = debounce(this.onRegionChange, 1000)
    this.onChangeSearchDebounce = debounce(this.onChangeSearchDebounce, 500)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let stateGeo = prevState.region.latitude + ',' + prevState.region.longitude
    if (!isEmpty(nextProps.geolocation) && nextProps.geolocation !== stateGeo) {
      const [lat, lng] = nextProps.geolocation.split(',')
      let region = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      }
      return { region }
    }
    return null
  }

  setAddressLocation () {
    const { modal } = this.props
    analytics().logEvent('google_maps_save', { address: this.state.addressMap })
    analytics().logEvent('view_set_maps', { latitude: this.state.region.latitude.toString(), longitude: this.state.region.longitude.toString() })
    modal.setModal(false)
  }

  // componentDidMount () {
  //   const { item, geolocation, initGeoAddress, setGeolocation } = this.props
  //   Geocoder.init(item)
  //   //analytics().logEvent('view_open_maps')
  //   if (isEmpty(geolocation)) {
  //     fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${initGeoAddress}&key=${item}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         const { lat, lng } = data.results[0].geometry.location
  //         //analytics().logEvent('google_maps_set', { latitude: lat, longitude: lng })
  //         //analytics().logEvent('view_first_open_maps', { latitude: lat.toString(), longitude: lng.toString() })
  //         let region = {
  //           latitude: lat,
  //           longitude: lng,
  //           latitudeDelta: 0.05,
  //           longitudeDelta: 0.05
  //         }
  //         setGeolocation(`${lat},${lng}`, data.results[0].formatted_address, () => {
  //           this.setState({ region })
  //           this.map.animateToRegion(region, 300)
  //         })
  //       })
  //       .catch((err) => console.log('err', err))
  //   }
  // }

  getCurrentLocationByAddress = () => {
    const { item, initGeoAddress, setGeolocation } = this.props
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${initGeoAddress}&key=${item}`)
      .then((response) => response.json())
      .then((data) => {
        const { lat, lng } = data.results[0].geometry.location
        analytics().logEvent('google_maps_set', { latitude: lat, longitude: lng })
        analytics().logEvent('view_first_open_maps', { latitude: lat.toString(), longitude: lng.toString() })
        let region = {
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }
        setGeolocation(`${lat},${lng}`, data.results[0].formatted_address, () => {
          this.setState({ region })
          this.map.animateToRegion(region, 300)
        })
      })
      .catch((err) => console.log('err', err))
  }

  getCurrentLocation = () => {
    const { setGeolocation } = this.props
    RNLocation.getLatestLocation({ timeout: null }).then(location => {
      if (isEmpty(location)) return this.getCurrentLocationByAddress()
      const userRegion = {
        latitude: location?.latitude ?? this.state.region.latitude,
        longitude: location?.longitude ?? this.state.region.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
      }
      Geocoder.from(userRegion.latitude, userRegion.longitude)
        .then((json) => {
          let address = json.results[0].formatted_address
          let newGeo = userRegion.latitude + ',' + userRegion.longitude
          analytics().logEvent('google_maps_set', { address })
          analytics().logEvent('view_first_open_maps', { latitude: userRegion?.latitude?.toString(), longitude: userRegion?.longitude?.toString() })
          setGeolocation(newGeo, address, () => {
            this.setState({ addressMap: address, firstUpdate: false, changePinPoint: false })
            this.map && this.map.animateToRegion(userRegion, 300)
          })
        })
        .catch((error) => console.log(error))
    })
  }

  async componentDidMount () {
    const { item, geolocation } = this.props
    const permissionInit = {
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'fine' // or 'coarse'
      }
    }
    Geocoder.init(item)
    RNLocation.configure({
      desiredAccuracy: {
        ios: 'best',
        android: 'highAccuracy'
      },
      interval: 3000,
      maxWaitTime: 3000
    })
    if (isEmpty(geolocation)) {
      const isPermissionGranted = await RNLocation.checkPermission(permissionInit)
      if (!isPermissionGranted) {
        RNLocation.requestPermission(permissionInit)
          .then(granted => {
            if (granted) this.getCurrentLocation()
            if (!granted) this.getCurrentLocationByAddress()
          })
          .catch(error => console.log(error))
      }
      if (isPermissionGranted) this.getCurrentLocation()
    }
  }

  onRegionChange = (region) => {
    const { setGeolocation, geolocation } = this.props
    if (!geolocation) return null
    let newGeo = region.latitude + ',' + region.longitude
    const [lat] = geolocation.split(',')
    if ((!isEmpty(lat) && region.latitude !== parseFloat(lat)) || this.state.firstUpdate) {
      const self = this
      Geocoder.from(region.latitude, region.longitude)
        .then((json) => {
          let address = json.results[0].formatted_address
          analytics().logEvent('google_maps_set', { address })
          analytics().logEvent('view_change_maps', { latitude: region?.latitude?.toString(), longitude: region?.longitude?.toString() })
          setGeolocation(newGeo, address, () => {
            self.setState({ addressMap: address, firstUpdate: false, changePinPoint: false })
            this.map && this.map.animateToRegion(region, 300)
          })
        })
        .catch((error) => console.log(error))
    }
  }

  onChangePinPoint = () => {
    if (!this.state.changePinPoint) return this.setState({ addressMap: 'Sedang Mencari...', changePinPoint: true })
    return null
  }

  onChangeSearchDebounce = () => {
    RNGooglePlaces.getAutocompletePredictions(this.state.searchAddress, {
      country: 'ID'
    })
      .then((place) => {
        this.setState({ searchResults: place, searching: true })
        analytics().logEvent('view_search_maps')
        // place represents user's selection from the
        // suggestions and it is a simplified Google Place object.
      })
      .catch(error => {
        crashlytics().log('RN Google Places error')
        if (__DEV__) {
          console.log('google places error: ', error)
        }
      }) // error is a Javascript Error object
  }

  // onChangeSearch = (address) => {
  //   this.setState({ searchAddress: address, searching: true }, () => {
  //     RNGooglePlaces.getAutocompletePredictions(this.state.searchAddress, {
  //       country: 'ID'
  //     })
  //       .then((place) => {
  //         this.setState({ searchResults: place })
  //         // place represents user's selection from the
  //         // suggestions and it is a simplified Google Place object.
  //       })
  //       .catch(error => {
  //         crashlytics().log('RN Google Places error')
  //         if (__DEV__) {
  //           console.log('google places error: ', error)
  //         }
  //       }) // error is a Javascript Error object
  //   })
  // }

  onChangeSearch = (address) => {
    this.setState({ searchAddress: address, searchResults: [{ fullText: 'Sedang Mencari...' }] }, this.onChangeSearchDebounce)
  }

  selectAddress = (address) => {
    Keyboard.dismiss()
    RNGooglePlaces.lookUpPlaceByID(address.placeID)
      .then((results) => {
        let newRegion = {
          latitude: results.location.latitude,
          longitude: results.location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }
        analytics().logEvent('view_select_search_maps')
        this.onRegionChange(newRegion)
        this.setState({
          // addressMap: address.fullText,
          addressMap: 'Menuju lokasi...',
          searchAddress: address.fullText,
          searching: false
        })
      })
      .catch((error) => console.log(error.message))
  }

  renderSearchResult = () => {
    const { searching, searchResults, searchAddress } = this.state
    const { width } = Dimensions.get('screen')
    if (searching && searchAddress.length > 0) {
      return (
        <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', borderBottomEndRadius: 5, width: width * 0.94, zIndex: 1, position: 'absolute', top: 50, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#e5e9f2' }}>
          <FlatList
            keyboardShouldPersistTaps={'always'}
            data={searchResults}
            renderItem={({ item }) => {
              return (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#e5e9f2' }}>
                  <TouchableOpacity onPress={() => this.selectAddress(item)} style={{ height: 20, overflow: 'hidden', flex: 1, paddingLeft: 25, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 14, fontFamily: 'Quicksand-Regular' }}>{item.fullText}</Text>
                    <IconSearch>
                      <Icon name='magnify' color='#757886' size={16} />
                    </IconSearch>
                  </TouchableOpacity>
                </View>
              )
            }}
            keyExtractor={(item, index) => `search reasult ${item.placeID} ${index}`}
          />
          <TouchableOpacity onPress={() => this.setState({ searching: false })} style={{ paddingVertical: 14 }}>
            <Text style={{ fontSize: 14, color: 'red', textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Tutup Pencarian</Text>
          </TouchableOpacity>
        </View>
      )
    } else return null
  }

  render () {
    const { addressMap, searchAddress, region } = this.state
    return (
      <View style={[styles.container, { height: height * 0.8, justifyContent: 'space-between', padding: 10 }]}>
        <ContentContainer>
          <MapGeoView>
            <TextInput
              underlineColorAndroid='transparent'
              style={{ fontSize: 16, width: '90%', height: 40, color: 'black' }}
              placeholderTextColor='#b2bec3'
              placeholder='Cari alamat Anda..'
              selectionColor='rgba(242, 101, 37, 1)'
              value={searchAddress}
              onChangeText={(text) => this.onChangeSearch(text)}
            />

            {(!isEmpty(searchAddress)) &&
            <Icon size={20} name='close-circle'
              onPress={() => { this.setState({ searchAddress: '' }) }} />
            }
          </MapGeoView>
          {this.renderSearchResult()}
          <View style={{ width: '100%', height: height * 0.62, borderRadius: 8, overflow: 'hidden', marginTop: 20 }}>
            <MapView style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              ref={r => (this.map = r)}
              initialRegion={region}
              onRegionChangeComplete={this.onRegionChange}
              onPanDrag={this.onChangePinPoint}
              rotateEnabled={false}
              draggable={Platform.OS !== 'ios'}
              provider={PROVIDER_GOOGLE}
            />
            {/* <MarkerMapLocation> */}
            <View style={{ justifyContent: 'center', alignItems: 'center', top: ((height * 0.62) / 2) - 116 }}>
              <View style={{ justifyContent: 'center', paddingHorizontal: 20, alignItems: 'center' }}>
                {(addressMap === '')
                  ? <View style={{ height: 70, justifyContent: 'flex-end' }}>
                    <Loading />
                  </View>
                  : <View style={{ height: 70, backgroundColor: 'white', borderRadius: 4, padding: 8, borderWidth: 1, borderColor: '#F0F2F7', justifyContent: 'center' }}>
                    <Text numberOfLines={3} style={{ fontSize: 14, fontFamily: 'Quicksand-Regular', maxWidth: 300 }}>
                      {addressMap}
                    </Text>
                  </View>
                }
              </View>
              <Image
                source={require('../assets/images/ruparupa-marker.webp')}
                style={{ height: 41, width: 41, marginTop: 5 }}
              />
            </View>
            {/* </MarkerMapLocation> */}
          </View>
          {/* Current Address Text */}
        </ContentContainer>
        <View style={{ paddingTop: 15, paddingBottom: 10 }}>
          <TouchableOpacity disabled={!!this.state.changePinPoint} onPress={() => this.setAddressLocation()} style={{ padding: 10, backgroundColor: this.state.changePinPoint ? 'lightgray' : '#F26525', borderRadius: 3 }}>
            <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', fontFamily: 'Quicksand-Medium' }}>Atur Lokasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default SetLocation

const ContentContainer = styled.View`
  flexDirection: column;
`

const MapGeoView = styled.View`
  flex-direction: row; 
  align-items: center;
  justify-content: space-between;
  backgroundColor: white;
  borderRadius: 5;
  border: 1px #e5e9f2 solid;
  height: 40px;
  padding-horizontal: 8px;
`
// const MarkerMapLocation = styled.View`
//   /* top: 30%; */
//   justifyContent: center;
//   alignItems: center;
// `

const IconSearch = styled.View`
  position: absolute;
  top: 0px;
  left: 5px;
`
