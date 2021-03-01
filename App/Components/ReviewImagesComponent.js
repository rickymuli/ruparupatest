import React, { PureComponent } from 'react'
import { FlatList, Image, Modal } from 'react-native'
import { HeaderReviewLarge, ImageReviewContainer, ImageMainContainer, ImageMainContainerWithBorder } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
// PlaceHolder
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import ImagePreviewModal from './ImagePreviewModal'

export default class ReviewImagesComponent extends PureComponent {
  constructor () {
    super()
    this.state = {
      modalVisible: false,
      selectedIndex: 0
    }
  }

  selectImage = (index) => {
    this.setState({ modalVisible: true, selectedIndex: index })
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  render () {
    const { title } = this.props
    let MainContainer = ImageMainContainer
    if (!isEmpty(title)) {
      MainContainer = ImageMainContainerWithBorder
    }
    return (
      <MainContainer>
        {(!isEmpty(title)) &&
          <HeaderReviewLarge>{title}</HeaderReviewLarge>
        }
        <FlatList
          data={this.props.images}
          horizontal
          renderItem={({ item, index }) => <RenderImage selectImage={this.selectImage} index={index} item={item} />}
          keyExtractor={(item, index) => `review images ${index}`}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}>
          <ImagePreviewModal setModalVisible={this.setModalVisible} images={this.props.images} selectedIndex={this.state.selectedIndex} />
        </Modal>
      </MainContainer>
    )
  }
}

class RenderImage extends PureComponent {
  constructor () {
    super()
    this.state = {
      isfetched: false
    }
  }

  render () {
    const { item, index } = this.props
    return (
      <ImageReviewContainer onPress={() => this.props.selectImage(index)}>
        <ShimmerPlaceHolder
          autoRun
          visible={this.state.isfetched}
          width={100}
          height={100}>
          <Image source={{ uri: item.image_url }} style={{ height: 100, width: 100, alignSelf: 'center' }} onLoad={() => { this.setState({ isfetched: true }) }} />
        </ShimmerPlaceHolder>
      </ImageReviewContainer>
    )
  }
}
