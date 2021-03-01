import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, SafeAreaView, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'

// Redux
import InspirationActions from '../Redux/InspirationRedux'

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#ffffff'
  }
})

class IntroModalContent extends Component {
  // Removing Header
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      showDone: false,
      index: 0
    }
  }

  onSlideChangeHandle = (index, total) => {
    if (index === 3 && !this.state.showDone) {
      this.setState({ showDone: true, index: 3 })
    }
  }

  onDonePressed = async () => {
    await AsyncStorage.setItem('installed', 'i have installed the app!')
    this.props.inspirationServer()
    this.props.setModalIntroVisible(false)
  }

  render () {
    const ratio = Dimensions.get('screen').width / 1080
    const { showDone } = this.state
    // const { showDone, index } = this.state
    let height = Platform.OS === 'ios' ? Dimensions.get('window').height * 0.85 : Dimensions.get('window').height * 0.9
    return (
      <SafeAreaView style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ height }}>
          <Swiper
            activeDotColor={'#008CCF'}
            loop={false}
            paginationStyle={{ bottom: 0 }}
            onIndexChanged={this.onSlideChangeHandle}>
            <View style={styles.slide}>
              <View style={{ padding: 10 }} level={10}><Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center' }}>Scan, Shop & Go</Text></View>
              <View level={1}><Image source={require('../assets/images/intro/logo-rr-woordmark.webp')} style={{ width: 29, height: 10, alignSelf: 'center' }} /></View>
              <View style={{ marginTop: 5 }} level={8}><Image source={require('../assets/images/intro/intro-mobile-app-1.webp')} style={{ width: Dimensions.get('screen').width, height: ratio * 1358 }} /></View>
            </View>
            <View style={styles.slide}>
              <View style={{ padding: 10 }} level={-10}><Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center' }}>Jadi yang pertama mengetahui penawaran kami</Text></View>
              <View level={1}><Image source={require('../assets/images/intro/logo-rr-woordmark.webp')} style={{ width: 29, height: 10, alignSelf: 'center' }} /></View>
              <View style={{ marginTop: 5 }} level={20}><Image source={require('../assets/images/intro/intro-mobile-app-2.webp')} style={{ width: Dimensions.get('screen').width, height: ratio * 1358 }} /></View>
            </View>
            <View style={styles.slide}>
              <View style={{ padding: 10 }} level={8}><Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center' }}>Pantau Transaksi Lebih Mudah dan Cepat</Text></View>
              <View level={1}><Image source={require('../assets/images/intro/logo-rr-woordmark.webp')} style={{ width: 29, height: 10, alignSelf: 'center' }} /></View>
              <View style={{ marginTop: 5 }} level={-10}><Image source={require('../assets/images/intro/intro-mobile-app-3.webp')} style={{ width: Dimensions.get('screen').width, height: ratio * 1358 }} /></View>
            </View>
            <View style={styles.slide}>
              <View style={{ padding: 10 }}level={8}><Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center' }}>Cek dan Tukar Point Rewards Ace, Informa dan Toys Kingdom dalam 1 aplikasi</Text></View>
              <View level={1}><Image source={require('../assets/images/intro/logo-rr-woordmark.webp')} style={{ width: 29, height: 10, alignSelf: 'center' }} /></View>
              <View style={{ marginTop: 5 }} level={-10}><Image source={require('../assets/images/intro/intro-mobile-app-4.webp')} style={{ width: Dimensions.get('screen').width, height: ratio * 1358 }} /></View>
            </View>
          </Swiper>
        </View>
        <View style={{ padding: 5 }}>
          {(showDone)
            ? <TouchableOpacity onPress={() => this.onDonePressed()} style={{ backgroundColor: '#F26525', borderRadius: 3, paddingVertical: 2, paddingHorizontal: 15, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontFamily: 'Quicksand-Bold', fontSize: 18 }}>Let's Go</Text>
            </TouchableOpacity>
            : null
          }
        </View>
      </SafeAreaView>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  inspirationServer: (storeCode) => dispatch(InspirationActions.inspirationServer(storeCode))
})

export default connect(null, mapDispatchToProps)(IntroModalContent)
