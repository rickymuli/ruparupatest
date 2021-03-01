import React, { Component } from 'react'
import { ImageBackground, TouchableOpacity, Dimensions, StatusBar, View, Image } from 'react-native'
import { Container, Row } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

// Redux
import ReviewHandlerActions from '../Redux/ReviewHandlerRedux'

// Components
import EasyModal from './EasyModal'

class ImagePreviewContainer extends Component {
  constructor () {
    super()
    this.state = {
      selectedImage: null,
      width: 0,
      height: 0
    }
  }

  selectImageForPreview = (imageUrl) => {
    Image.getSize(imageUrl, (width, height) => {
      let heightRatio = height / width
      this.setState({ selectedImage: imageUrl, width: Dimensions.get('screen').width, height: Dimensions.get('screen').width * heightRatio })
      this.refs.child.setModal()
    })
  }

  deleteImage = (index) => {
    this.props.deleteImage(index)
  }

  render () {
    const { images } = this.props.reviewHandler
    return (
      <Container>
        <Row style={{ flexWrap: 'wrap', marginVertical: 5 }}>
          {(images.map((imageData, index) => (
            <TouchableOpacity style={{ marginRight: 5 }} onPress={() => this.selectImageForPreview(imageData.uri)} key={`preview images ${index}`}>
              <ImageBackground source={{ uri: imageData.uri }} style={{ width: 100, height: 100 }}>
                <TouchableOpacity onPress={() => this.deleteImage(index)} style={{ justifyContent: 'center', alignItems: 'center', width: 25, height: 25, backgroundColor: 'white', alignSelf: 'flex-end', borderRadius: 50, opacity: 0.7 }}>
                  <Icon name='delete' size={20} color='#F3251D' />
                </TouchableOpacity>
              </ImageBackground>
            </TouchableOpacity>
          )))}
        </Row>
        <EasyModal ref='child' size={100}>
          <View style={{ flex: 1, backgroundColor: '#000000' }}>
            <StatusBar translucent />
            <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'rgba(0,0,0,0.7)' }}>
              <TouchableOpacity onPress={() => this.refs.child.setModal(false)}>
                <Icon name='arrow-left' size={24} color='#ffffff' />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: (!isEmpty(this.state.selectedImage)) && this.state.selectedImage }} style={{ width: this.state.width, height: this.state.height }} />
          </View>
        </EasyModal>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewHandler: state.reviewHandler
})

const mapDispatchToProps = (dispatch) => ({
  deleteImage: (index) => dispatch(ReviewHandlerActions.deleteImageRequest(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(ImagePreviewContainer)
