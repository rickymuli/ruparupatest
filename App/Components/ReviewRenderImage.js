import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Dimensions, Modal, StatusBar } from 'react-native'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { isEmpty, replace } from 'lodash'
import { ScrollView } from 'react-native-gesture-handler'

export default class ReviewRenderImage extends Component {
  constructor () {
    super()
    this.state = {
      isfetched: false,
      selectedImage: '',
      modalVisible: false,
      height: 0,
      width: 0
    }
  }

  selectImageForPreview = (imageUrl) => {
    Image.getSize(imageUrl, (width, height) => {
      let ratio = height / width
      this.setState({
        selectedImage: imageUrl,
        modalVisible: true,
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').width * ratio
      })
    })
  }

  render () {
    const { isfetched } = this.state
    const { imageData } = this.props
    const imageUrl = replace(imageData.image_url, 'f_auto,fl_lossy,q_auto', `w_${Math.round(Dimensions.get('screen').width * 0.3)},f_auto,fl_lossy,q_auto`)
    return (
      <View>
        <ShimmerPlaceHolder
          autoRun
          width={Dimensions.get('screen').width * 0.3}
          height={Dimensions.get('screen').width * 0.3}
          visible={isfetched}
        >
          <TouchableOpacity onPress={() => this.selectImageForPreview(imageData.image_url)} style={{ margin: 5 }}>
            <Image
              source={{ uri: imageUrl }}
              style={{ width: Dimensions.get('screen').width * 0.3, height: Dimensions.get('screen').width * 0.3 }}
              onLoad={() => { this.setState({ isfetched: true }) }} />
          </TouchableOpacity>
        </ShimmerPlaceHolder>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false })
          }}
        >
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar hidden />
            <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3 }}>
              <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                <Icon name='arrow-left' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {!isEmpty(this.state.selectedImage) &&
              <Image source={{ uri: this.state.selectedImage }} style={{ width: this.state.width, height: this.state.height, alignSelf: 'center', zIndex: -1 }} />
              }
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}
