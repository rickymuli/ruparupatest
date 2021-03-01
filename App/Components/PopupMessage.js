import React, { Component } from 'react'
import { Text, View, Dimensions, Image, TouchableOpacity, TouchableWithoutFeedback, Linking } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ParallaxScrollView from 'react-native-parallax-scroll-view'

class PopupMessage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newsFeed: props.newsFeed
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.newsFeed !== prevState.newsFeed) {
      return {
        newsFeed: nextProps.newsFeed
      }
    }
    return null
  }

  openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error('An error occurred', err))
  }

  closeModal () {
    this.props.setModalVisible(false)
  }

  renderMaintenance = () => {
    const { newsFeed } = this.state
    return (
      <View style={{ backgroundColor: 'white', justifyContent: 'center', padding: 15 }}>
        <Image source={require('../assets/images/maintenance.webp')} style={{ width: Dimensions.get('screen').width * 0.6, height: Dimensions.get('screen').width * 0.6, alignSelf: 'center' }} />
        <View style={{ padding: 15, backgroundColor: '#E5F7FF', flexDirection: 'column', marginBottom: 15, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name='information-outline' color='#757886' size={18} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#757886', fontFamily: 'Quicksand-Regular' }}>{newsFeed.description}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.props.setModalVisible(false)} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
          <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16, color: 'white' }}>Okay</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderPromo = () => {
    const { newsFeed } = this.state
    const ratio = Dimensions.get('screen').width / 1280
    return (
      <View style={{ flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.7)', flex: 1 }}>
        <ParallaxScrollView
          backgroundColor='transparent'
          contentBackgroundColor='white'
          parallaxHeaderHeight={200}
          renderForeground={() => (
            <TouchableWithoutFeedback onPress={() => this.props.setModalVisible(false)}>
              <View style={{ height: Dimensions.get('screen').height * 0.5, flex: 1, alignItems: 'center', justifyContent: 'center' }} />
            </TouchableWithoutFeedback>
          )}
        >
          <View style={{ flexDirection: 'column', padding: 15 }}>
            <Image
              source={{ uri: newsFeed.image }}
              style={{ width: Dimensions.get('screen').width, height: ratio * 300, alignSelf: 'center', marginBottom: 10 }} />
            <View style={{ paddingVertical: 15 }}>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{newsFeed.description}</Text>
            </View>
            <TouchableOpacity onPress={() => this.openURL(newsFeed.url)} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
              <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16, color: 'white' }}>Lihat Promo!</Text>
            </TouchableOpacity>
          </View>
        </ParallaxScrollView>
        <View style={{ backgroundColor: 'white', padding: 15 }}>
          <TouchableOpacity onPress={() => this.props.setModalVisible(false)} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF7F45', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16, color: 'white' }}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { newsFeed } = this.state
    if (newsFeed.pageType === 'maintenance') {
      return (
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
          {this.renderMaintenance()}
        </View>
      )
    } else if (newsFeed.pageType === 'promo') {
      return this.renderPromo()
    } else {
      return null
    }
  }
}

export default PopupMessage
