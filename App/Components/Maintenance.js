import React from 'react'
import { View, Dimensions, Text } from 'react-native'
import LottieView from 'lottie-react-native'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import { fonts } from '../Styles'
export default class Maintenance extends React.Component {
  render () {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }} >
        <HeaderSearchComponent back pageName={'Maintenance'} navigation={this.props.navigation} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <LottieView source={require('../assets/images/Annimation-MobileApp/maintenance.json')} autoPlay loop style={{ height: Dimensions.get('screen').height * 0.6, width: Dimensions.get('screen').width * 0.7 }} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 18, textAlign: 'center' }}>Hi, Kami sedang Maintenance saat ini </Text>
        </View>
      </View>
    )
  }
}
