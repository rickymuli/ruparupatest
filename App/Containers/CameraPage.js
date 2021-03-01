import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  PermissionsAndroid,
  Platform,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  SafeAreaView } from 'react-native'
import { RNCamera } from 'react-native-camera'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import { Row, FontSizeL } from '../Styles/StyledComponents'
import styled from 'styled-components'
import CameraRoll from '@react-native-community/cameraroll'

// Redux
import ReviewHandlerActions from '../Redux/ReviewHandlerRedux'
import ReturnRefundHandlerActions from '../Redux/ReturnRefundHandlerRedux'

// Component
import EasyModal from '../Components/EasyModal'
import Loading from '../Components/LottieComponent'
import Snackbar from '../Components/SnackbarComponent'

class CameraPage extends Component {
  constructor () {
    super()
    this.state = {
      flashlight: false,
      images: null,
      capturedImage: null,
      selectMode: false,
      selectedImages: [],
      width: 0,
      height: 0,
      error: null
    }
  }

  confirmImage = (refName) => {
    const data = this.props.route.params?.data ?? null
    let newImage = (this.state.selectMode) ? [...this.state.selectedImages] : [this.state.capturedImage]
    if (isEmpty(data)) {
      // Review Rating
      if (!isEmpty(this.props.reviewHandler.images)) {
        newImage = [...this.props.reviewHandler.images, ...newImage]
      }
      this.props.saveImagesForUpload(newImage)
    } else {
      // Return Refund
      const { imageData } = this.props.returnHandler
      let newImageData = []
      if (!isEmpty(imageData)) {
        newImageData = [...imageData]
      }
      let currentItemImage = newImageData.find(imageDetail => {
        return imageDetail.salesOrderItemId === data.salesOrderItemId
      })

      // If item is found
      if (!isEmpty(currentItemImage)) {
        let imageExists = currentItemImage.images.find(image => {
          return image.id === `${(data.qtyIndex) * 3 + data.imageIndex}${data.itemIndex}${data.salesOrderItemId}`
        })
        // If image is found
        if (!isEmpty(imageExists)) {
          let tempImgObj = { ...imageExists }
          tempImgObj.output = newImage
          imageExists = tempImgObj
        } else {
          imageExists = {
            id: `${(data.qtyIndex) * 3 + data.imageIndex}${data.itemIndex}${data.salesOrderItemId}`,
            image: 'imageformatbase64',
            output: newImage
          }
        }
      }
      let imageObj = {
        id: `${(data.qtyIndex) * 3 + data.imageIndex}${data.itemIndex}${data.salesOrderItemId}`,
        image: 'imageformatbase64',
        output: newImage
      }
      if (data.hasOwnProperty('priority')) {
        imageObj.id = data.priority
      }
      this.props.setImageForUpload(imageObj)
    }
    if (!isEmpty(refName)) {
      this.refs.imageModal.setModal(false)
      this.refs[refName].setModal(false)
    } else {
      setTimeout(() => {
        this.refs.imageModal.setModal(false)
      }, 10)
    }
    this.props.navigation.goBack()
  }

  checkAndroidPermission = async () => {
    try {
      const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      await PermissionsAndroid.request(permission)
      Promise.resolve()
    } catch (error) {
      Promise.reject(error)
    }
  }

  getPictures = async () => {
    this.refs.imageModal.setModal(true)
    if (Platform.OS === 'android') {
      await this.checkAndroidPermission()
    }
    try {
      let result
      result = await CameraRoll.getPhotos({ first: 1000, assetType: 'Photos' })

      let photos = []
      for (let asset of result.edges) {
        try {
          photos.push(asset.node.image)
        } catch (err) {
          this.setState({
            error: 'Error RNFS: ' + err
          })
        }
      }

      this.setState({ images: photos })
    } catch (error) {
      this.setState({ error })
    }
  }

  takePicture = async (camera) => {
    try {
      const options = { quality: 0.5, base64: true, fixOrientation: true, orientation: 'portrait', pauseAfterCapture: true }
      const data = await camera.takePictureAsync(options)
      this.setState({ capturedImage: data, width: Dimensions.get('screen').width, height: Dimensions.get('screen').height })
      this.refs.viewImageModal.setModal()
    } catch (error) {
      if (__DEV__) {
        console.log('error while taking a picture', error)
      }
    }
  }

  // This method is for selecting just 1 image
  selectImage = (image) => {
    if (this.state.selectMode) {
      this.setSelectedImage(image)
    } else {
      let imageUri = image.uri
      Image.getSize(image.uri, (width, height) => {
        let heightRatio = height / width
        this.setState({ capturedImage: { uri: imageUri }, width: Dimensions.get('screen').width, height: Dimensions.get('screen').width * heightRatio })
      })
      this.refs.viewImagePreviewModal.setModal()
    }
  }

  closePreviewModal = (refName) => {
    this.camera.resumePreview()
    this.refs[refName].setModal(false)
  }

  // Remove references when unmounting
  componentWillUnmount () {
    this.camera = null
  }

  imagePreviewModal = (refName) => {
    return (
      <EasyModal closeMethod={() => this.camera.resumePreview()} ref={refName} size={100}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000' }}>
          <StatusBar hidden />
          <View style={{ flexDirection: 'row', padding: 20, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3, justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => this.closePreviewModal(refName)}>
              <Icon name='arrow-left' size={24} color='#ffffff' />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.confirmImage(refName)}>
              <Icon name='check' size={24} color='#ffffff' />
            </TouchableOpacity>
          </View>
          <ScrollView>
            <Image source={{ uri: (!isEmpty(this.state.capturedImage) ? this.state.capturedImage.uri : '') }} style={{ width: this.state.width, height: this.state.height, alignSelf: 'center', zIndex: 1 }} />
          </ScrollView>
        </SafeAreaView>
      </EasyModal>
    )
  }

  // This method is for selecting more than 1 image
  setSelectedImage = (image) => {
    const { selectedImages } = this.state
    let index = selectedImages.indexOf(image)
    let newImages = [...selectedImages]
    if (index > -1) {
      newImages.splice(index, 1)
    } else if (newImages.length < 3 - this.props.reviewHandler.images.length) {
      newImages.push(image)
    }
    this.setState({ selectedImages: newImages })
  }

  render () {
    const { selectMode, selectedImages } = this.state
    const { width, height } = Dimensions.get('screen')
    let SelectText = (selectMode) ? ActiveText : NonActiveText
    const data = this.props.route.params?.data ?? null
    return (
      <View>
        <StatusBar hidden />
        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={{ width, height: (Platform.OS === 'ios') ? height - 100 : height, flexDirection: 'column' }}
          flashMode={this.state.flashlight ? RNCamera.Constants.FlashMode.auto : RNCamera.Constants.FlashMode.off}
          type={RNCamera.Constants.Type.back}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          autoFocus={RNCamera.Constants.AutoFocus.on}
        >
          {({ camera, status }) => {
            if (status !== 'READY') return <Loading />
            return (
              <View style={{ position: 'absolute', bottom: 0, height: 125, width }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <TouchableOpacity onPress={() => this.setState({ flashlight: !this.state.flashlight })}>
                    <Icon name={(this.state.flashlight) ? 'flash' : 'flash-off'} size={30} color='#ffffff' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.takePicture(camera)}>
                    <View style={{ borderWidth: 1, borderColor: '#ffffff', width: 75, height: 75, backgroundColor: 'transparent', borderRadius: 50 }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.getPictures()}>
                    <Icon name={'folder-image'} size={30} color='#ffffff' />
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        </RNCamera>
        <EasyModal ref='imageModal' size={80}>
          <View style={{ flex: 1 }}>
            <View style={{ padding: 20, flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E0E6ED', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => this.refs.imageModal.setModal(false)}>
                <Icon name='arrow-left' size={20} color='#757885' />
              </TouchableOpacity>
              <Row>
                <View>
                  {(isEmpty(data))
                    ? <TouchableOpacity onPress={() => this.setState({ selectMode: !this.state.selectMode, selectedImages: [] })}>
                      <SelectText>Select</SelectText>
                    </TouchableOpacity>
                    : null
                  }
                  {(selectMode) &&
                  <Text style={[{ fontFamily: 'Quicksand-Medium', fontSize: 14 }, (this.state.images.length === 3 - this.props.reviewHandler.images.length) && { color: '#F3251D' }]}>Selected: {selectedImages.length}/{3 - this.props.reviewHandler.images.length}</Text>
                  }
                </View>
                {(selectMode) &&
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => this.confirmImage()}>
                  <Icon name='check' size={30} color='#008CCF' />
                </TouchableOpacity>
                }
              </Row>
            </View>
            <View style={{ alignContent: 'center', flex: 1 }}>
              {(this.state.images === null && this.state.error === null)
                ? <Loading />
                : (this.state.error)
                  ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FontSizeL>{JSON.stringify(this.state.error)}</FontSizeL>
                  </View>
                  : <FlatList
                    data={(!isEmpty(this.state.images)) ? this.state.images : []}
                    extraData={[selectMode, selectedImages]}
                    numColumns={3}
                    ListEmptyComponent={() => (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <FontSizeL>No Image Found</FontSizeL>
                      </View>
                    )}
                    initialNumToRender={15}
                    maxToRenderPerBatch={9}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => this.selectImage(item)} style={[{ width: Dimensions.get('screen').width * 0.3, margin: 5 }]}>
                        <Image style={[{ width: Dimensions.get('screen').width * 0.3, height: Dimensions.get('screen').width * 0.3, flexDirection: 'column' }, (selectMode && selectedImages.includes(item)) && { borderWidth: 5, borderColor: '#008CCF' }]} source={{ uri: item.uri }} />
                        {/* <ImageBackground style={[{ width: Dimensions.get('screen').width * 0.3, height: Dimensions.get('screen').width * 0.3, flexDirection: 'column' }, (selectMode && selectedImages.includes(item)) && { borderWidth: 5, borderColor: '#008CCF' }]} source={{ uri: item.uri }}>
                          <View style={{ justifyContent: 'center', padding: 10, backgroundColor: (item.size < 2000000) ? 'white' : '#F3251D', opacity: 0.8, borderRadius: 50, alignSelf: 'flex-end' }}><FontSizeS style={{ textAlign: 'center' }}><Bold style={{ color: (item.size >= 2000000) ? '#FFFFFF' : '#757886' }}>{(item.size / 1000000).toFixed(2)} MB</Bold></FontSizeS></View>
                        </ImageBackground> */}
                      </TouchableOpacity>
                    )}
                    keyExtractor={({ item }, index) => `image ${index}`}
                  />
              }
            </View>
            {this.imagePreviewModal('viewImagePreviewModal')}
          </View>
        </EasyModal>
        {this.imagePreviewModal('viewImageModal')}
        <Snackbar ref='child' />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewHandler: state.reviewHandler,
  returnHandler: state.returnHandler
})

const mapDispatchToProps = (dispatch) => ({
  saveImagesForUpload: (imageData) => dispatch(ReviewHandlerActions.saveImagesForUpload(imageData)),
  setImageForUpload: (imageData) => dispatch(ReturnRefundHandlerActions.setImageForUpload(imageData))
})

export default connect(mapStateToProps, mapDispatchToProps)(CameraPage)

const ActiveText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 18px;
  color: #008CCF;
`

const NonActiveText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 18px;
`
