import React from 'react'
import { Text, View, TouchableOpacity, Image, Platform } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import { useSelector } from 'react-redux'

const imageNonFocus = {
  IndexSearch: require('../assets/images/ruparupa-mobile-app-bottom-menu/search-non-active.webp'),
  Home: require('../assets/images/ruparupa-mobile-app-bottom-menu/home-non-active.webp'),
  Wishlist: require('../assets/images/ruparupa-mobile-app-bottom-menu/wishlist.webp'),
  Scan: require('../assets/images/ruparupa-mobile-app-bottom-menu/scan.webp'),
  Order: require('../assets/images/ruparupa-mobile-app-bottom-menu/order-non-active.webp'),
  Profil: require('../assets/images/ruparupa-mobile-app-bottom-menu/profile-non-active.webp')
}
const imageFocus = {
  IndexSearch: require('../assets/images/ruparupa-mobile-app-bottom-menu/search-active.webp'),
  Home: require('../assets/images/ruparupa-mobile-app-bottom-menu/home-active.webp'),
  Wishlist: require('../assets/images/ruparupa-mobile-app-bottom-menu/wishlist-active.webp'),
  Scan: require('../assets/images/ruparupa-mobile-app-bottom-menu/scan-active.webp'),
  Order: require('../assets/images/ruparupa-mobile-app-bottom-menu/order-active.webp'),
  Profil: require('../assets/images/ruparupa-mobile-app-bottom-menu/profile-active.webp')
}
const tabBarLabel = {
  IndexSearch: 'Cari'
}
const isIos = Platform.OS === 'ios'
const TabBar = ({ state, descriptors, navigation }) => {
  const { wishlist } = useSelector(state => state.user)
  const focusedOptions = descriptors[state.routes[state.index].key].options
  if (focusedOptions.tabBarVisible === false) {
    return null
  }
  const badge = () => {
    let badge = wishlist.items.length
    if (badge < 100) return badge
    else return '99+'
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 8, paddingBottom: (isIos ? 20 : 8), borderTopWidth: 1, borderColor: '#F0F2F7' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key]
        const isFocused = state.index === index

        const label = tabBarLabel[route.name] || route.name
        const image = isFocused ? imageFocus[route.name] : imageNonFocus[route.name]

        const onPress = () => {
          if (route.name === 'Scan') navigation.navigate('ScanPage')
          else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key
          })
        }
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole='button'
            accessibilityStates={isFocused ? ['selected'] : []}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ alignItems: 'center', width: '25%' }}
          >
            <View style={{ alignItems: 'center' }}>
              {route.name === 'Wishlist' && wishlist && !isEmpty(wishlist.items) &&
              <View style={{ position: 'absolute', right: -2, top: -2, backgroundColor: '#008CCF', zIndex: 1, borderRadius: 10, paddingVertical: 1, paddingHorizontal: 2 }}>
                <Text style={{ fontSize: 10, color: 'white' }}>{badge()}</Text>
              </View>}
              <Image style={{ width: 20, height: 20, zIndex: 0 }} source={image} />
              <Text style={{ color: isFocused ? '#F26525' : '#757885', fontFamily: 'Quicksand-Regular', fontSize: 10, paddingLeft: 2 }}>
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default TabBar
