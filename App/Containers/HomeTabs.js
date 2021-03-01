import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import take from 'lodash/take'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
// Redux
import { useDispatch, useSelector } from 'react-redux'
import InspirationActions from '../Redux/InspirationRedux'

import IndexCategory from './IndexCategory'
import IndexHeader from '../Components/IndexHeader'

import Animated from 'react-native-reanimated'
function TabBar ({ state, descriptors, navigation, position }) {
  return (
    <View style={{ paddingVertical: 4 }}>
      <ScrollView horizontal>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

          const isFocused = state.index === index

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

          const inputRange = state.routes.map((_, i) => i)
          const opacity = Animated.interpolate(position, {
            inputRange,
            outputRange: inputRange.map(i => (i === index ? 1 : 0))
          })
          return (
            <TouchableOpacity
              accessibilityRole='button'
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Text style={{ paddingHorizontal: 10, fontFamily: 'Quicksand-Bold', fontSize: 14 }}>
                {label}
              </Text>
              <Animated.View style={[(isFocused && { borderColor: isFocused ? '#F26525' : 'black', borderWidth: 1, width: '40%', marginTop: 2, borderRadius: 15 }), { opacity }]} />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

// const Home = (props) => {
//   console.log('home', props)
//   return <View style={{ flex: 1 }}><Text style={{ alignSelf: 'center' }}>makan malam</Text></View>
// }

const Tab = createMaterialTopTabNavigator()
const HomeTabs = (props) => {
  const { data } = useSelector(state => state.inspiration)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(InspirationActions.inspirationServer())
  }, [])

  return (
        <>
          <IndexHeader />
          {!isEmpty(data)
            ? <Tab.Navigator tabBar={props => <TabBar {...props} />}>
              <Tab.Screen name='For you' component={IndexCategory} />
              {(take(data, 2)).map((inspirationData, index) => (
                <Tab.Screen name={inspirationData.name} component={(props) => null} />
              ))}
            </Tab.Navigator>
            : <IndexCategory />
          }

        </>
  )
}
export default HomeTabs
