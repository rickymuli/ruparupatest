import React, { Component } from 'react'
import { View, SafeAreaView, TouchableOpacity, Platform } from 'react-native'
import Swiper from 'react-native-swiper'
import PhotoView from 'react-native-photo-view'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import map from 'lodash/map'

// Styles
import styles from './Styles/PDPStyles'

// Components
import Loading from './LoadingComponent'

export default class ImagePreviewModal extends Component {
  constructor () {
    super()
    this.state = {
      imageModalLoaded: false
    }
  }
  renderPhotoView (image, index) {
    const { imageModalLoaded } = this.state
    return (
      <View style={styles.slide2} key={`show images ${index} ${image.image_url}`}>
        <PhotoView
          source={{ uri: image.image_url }}
          minimumZoomScale={1}
          maximumZoomScale={8}
          androidScaleType='fitCenter'
          style={styles.imageInModal}
          onLoadStart={() => { this.setState({ imageModalLoaded: false }) }}
          onLoadEnd={() => { this.setState({ imageModalLoaded: true }) }}
        />
        {(!imageModalLoaded) &&
          <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: '48%', left: '48%' }}>
            <Loading />
          </View>
        }
      </View>
    )
  }

  render () {
    const { images, selectedIndex } = this.props
    let styleHead = images.length >= 2 ? styles.modalHeader : styles.modalImageViewHeader
    return (
      <SafeAreaView style={styles.modalContainer}>
        <View style={styleHead}>
          <TouchableOpacity style={styles.closeIcon} onPress={() => this.props.setModalVisible(false)}>
            <Icon name='close-circle' color='#D4DCE6' size={24} />
          </TouchableOpacity>
        </View>
        { images.length >= 2
          ? <Swiper
            loop={Platform.OS !== 'ios'}
            index={selectedIndex}
            containerStyle={styles.wrapperModal}
            showsButtons
          >
            {map(images, (v, i) => this.renderPhotoView(v, i))}
          </Swiper>
          : this.renderPhotoView(images[0], 1)
        }
      </SafeAreaView>
    )
  }
}
