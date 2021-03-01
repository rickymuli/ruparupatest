import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { FontSizeM } from '../Styles/StyledComponents'

// Components
import EasyModal from './EasyModal'

export default class RefundStatusImageList extends Component {
  constructor () {
    super()
    this.state = {
      selectedImage: ''
    }
  }

  setSelectedImage = (image) => {
    this.setState({ selectedImage: image }, () => {
      this.refs.child.setModal()
    })
  }

  render () {
    const { images } = this.props
    const imageSize = Dimensions.get('screen').width * 0.3
    return (
      <View style={{ borderTopWidth: 1, borderTopColor: '#F0F2F7', paddingTop: 10 }}>
        <FontSizeM style={{ textAlign: 'center' }}>Foto produk yang diunggah</FontSizeM>
        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {images.map((imageData, index) => (
            <View style={{ marginBottom: 10 }} key={`status image ${index}`}>
              <TouchableOpacity key={`image product return ${index}`} onPress={() => this.setSelectedImage(imageData.image_url)}>
                <Image source={{ uri: imageData.image_url }} style={{ width: imageSize, height: imageSize }} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <EasyModal ref='child' size={100} close>
          <Image source={{ uri: this.state.selectedImage }} style={{ flex: 1 }} />
        </EasyModal>
      </View>
    )
  }
}
