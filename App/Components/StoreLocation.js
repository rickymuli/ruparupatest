import React, { useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator, SafeAreaView, Platform, Linking } from 'react-native'
import RNLocation from 'react-native-location'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isArray from 'lodash/isArray'
import styled from 'styled-components'
import { caseInsensitiveFilter } from '../Utils/Misc/ItemFilter'
import { HeaderComponent } from '../Components'
// style
import styles from '../Containers/Styles/ProductDetailPageStyles'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import LocationActions from '../Redux/LocationRedux'
import StoreLocationActions from '../Redux/StoreLocationRedux'

const StoreLocation = (props) => {
  this.LocationSubs = null
  const { title } = props
  const { longLatLocation, fetchingLongLatLocation } = useSelector(state => state.location)
  const { data: storeLocations } = useSelector(state => state.storeLocation)

  const [searchStore, setSearchStore] = useState('')
  const [storeList, setStoreList] = useState([])
  const [searchbarPlaceholder, setSearchbarPlaceholder] = useState('Cari berdasarkan kota...')
  //   const [locationSubs, setLocationSubs] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (title === 'nearest-stores') setSearchbarPlaceholder('Dimana kota Anda berada?')
    dispatch(StoreLocationActions.storeLocationRequest())
    RNLocation.requestPermission({
      ios: 'whenInUse',
      android: {
        detail: 'fine'
      }
    }).then(granted => {
      if (granted && !fetchingLongLatLocation) {
        this.LocationSubs = RNLocation.subscribeToLocationUpdates(locations => {
          if (isArray(locations)) {
            let data = {
              longitude: locations[0].longitude,
              latitude: locations[0].latitude,
              store: 'AHI,HCI',
              radius: 5,
              limit: 5
            }
            dispatch(LocationActions.longLatLocationRequest(data))
          }
        })
      }
    })
    return () => {
      this.LocationSubs = null
    }
  }, [])

  useEffect(() => {
    if (!fetchingLongLatLocation && longLatLocation && searchStore <= 1) setStoreList(longLatLocation)
  }, [fetchingLongLatLocation])

  useEffect(() => {
    if (searchStore.length >= 1 && title === 'nearest-stores') {
      let filteredByCity = caseInsensitiveFilter(storeLocations, searchStore, 'name')
      setStoreList(filteredByCity)
    } else {
      setStoreList(longLatLocation)
    }
  }, [searchStore])

  const openGps = geolocation => {
    Platform.select({
      ios: () => {
        Linking.openURL('http://maps.apple.com/maps?daddr=' + geolocation)
      },
      android: () => {
        Linking.openURL('http://maps.google.com/maps?daddr=' + geolocation)
      }
    })()
  }

  const buttonAction = payload => {
    title === 'nearest-stores' ? openGps(payload.pickup_point.geolocation) : props.validateQrcodeByLocation(payload.store_code)
  }

  return <SafeAreaView style={{ flex: 1 }}>
    {
      title !== 'nearest-stores' &&
        <HeaderComponent back pageName={'Pilih Store'} leftAction={() => props.setParentState && props.setParentState({ modalFullVisible: false })} />
    }
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Icon name={'information'} size={20} />
        <Text style={{ paddingLeft: 4, fontFamily: 'Quicksand-Regular', flex: 1 }}>Pilih toko dibawah ini sesuai dengan lokasi Anda sekarang</Text>
      </View>
      <View>
        {/* { title !== 'nearest-stores' &&
          <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Icon name={'information'} size={20} />
            <Text style={{ paddingLeft: 4, fontFamily: 'Quicksand-Regular', flex: 1 }}>Pilih toko dibawah ini sesuai dengan lokasi Anda sekarang</Text>
          </View>
        } */}
        {
          title === 'nearest-stores' &&
            <View style={{ justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
              <SearchStore
                underlineColorAndroid='transparent'
                placeholderTextColor='#b2bec3'
                placeholder={searchbarPlaceholder}
                onChangeText={e => setSearchStore(e)}
                style={{ color: 'black' }}
                value={searchStore}
              />
              <IconInnerSearch>
                <Icon name='magnify' size={25} />
              </IconInnerSearch>
            </View>
        }
        <FlatList
          data={storeList}
          renderItem={({ item, index }) => (
            <View style={{ borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3, paddingVertical: 10, paddingHorizontal: 15, marginBottom: 15 }} key={`${item.store_id} stops ${index}`}>
              <Text style={{ marginBottom: 2, fontSize: 18, fontFamily: 'Quicksand-Bold' }}>{item.name}</Text>
              <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                {/* <EvilIcons name={'location'} size={16} /> */}
                {/* <Text style={{ fontFamily: 'Quicksand-Regular', paddingLeft: 2, fontSize: 16 }}>{item.distance | 0} km</Text> */}
                <Text style={{ fontFamily: 'Quicksand-Regular', paddingLeft: 2, fontSize: 16 }}>{item.pickup_point.address_line_2}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
                <TouchableOpacity onPress={() => { buttonAction(item) }} style={{
                  backgroundColor: '#F26525',
                  paddingTop: 10,
                  paddingBottom: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                  borderRadius: 5,
                  justifyContent: 'center',
                  width: '100%'
                }}>
                  <Text style={styles.buttonText}>{'Pilih Store'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={() => {
            if (fetchingLongLatLocation) return (<ActivityIndicator size={'large'} />)
            else return null
          }}
          keyExtractor={(item, index) => `${index}`}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      </View>
    </View>
  </SafeAreaView>
}

export default StoreLocation

const IconInnerSearch = styled.View`
 position: absolute;
 zIndex: 1;
 right: 20px;
`

const SearchStore = styled.TextInput`
 borderWidth: 1;
 borderColor: #D4DCE6;
 borderRadius: 3;
 marginVertical: 8;
 paddingLeft: 20;
 paddingVertical: 5;
 font-family:Quicksand-Regular;
 height: 40;
`
