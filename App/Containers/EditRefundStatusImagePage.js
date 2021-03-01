import React, { Component } from 'react'
import { View, ScrollView, Image, Dimensions, TouchableOpacity, Text } from 'react-native'
import { Container, InfoBox, ButtonFilledPrimary, ButtonFilledText } from '../Styles/StyledComponents'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import Snackbar from '../Components/SnackbarComponent'

// Redux
import ReturnRefundHandlerActions from '../Redux/ReturnRefundHandlerRedux'
import ReturnRefundActions from '../Redux/ReturnRefundRedux'

// Components
import LottieComponent from '../Components/LottieComponent'

class EditRefundStatusImagePage extends Component {
  constructor () {
    super()
    this.state = {
      images: [],
      selectedImage: null,
      selectedIndex: 0,
      imageUpdated: false,
      isfetched: false,
      refundNo: '',
      customerId: null,
      refundItemId: '',
      qtyRefunded: 1,
      promoItems: [],
      email: '',
      orderNo: ''
    }
  }

  componentDidMount () {
    const data = this.props.route.params?.data ?? null
    if (!isEmpty(data)) {
      this.setState({
        selectedImage: data.images[0],
        images: data.images,
        customerId: data.customerId,
        refundNo: data.refundNo,
        qtyRefunded: data.qtyRefunded,
        refundItemId: data.refundItemId,
        promoItems: data.promoItems,
        email: data.customerEmail,
        orderNo: data.orderNo
      })
    }
  }

  captureImage = () => {
    if (!this.props.returnHandler.fetchingImageUrl) {
      let data = {
        ...this.state.selectedImage
      }
      this.props.navigation.navigate('CameraPage', { data })
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.returnHandler.images)) {
      let newImages = [...state.images]
      newImages.map((imageData, index) => {
        let imageTemp = { ...imageData }
        if (isEqual(imageData.priority, props.returnHandler.images.id)) {
          imageTemp = {
            ...imageData,
            image_url: props.returnHandler.images.output
          }
        }
        newImages[index] = imageTemp
      })
      let newSelectedImage = {
        ...state.selectedImage,
        image_url: props.returnHandler.images.output
      }
      returnObj = {
        ...returnObj,
        images: newImages,
        selectedImage: newSelectedImage,
        imageUpdated: true
      }
    }
    return returnObj
  }

  componentDidUpdate () {
    if (this.state.imageUpdated) {
      this.setState({
        imageUpdated: false
      }, () => {
        this.props.initImage()
      })
    }
    if (this.props.returnRefund.successEdit) {
      this.props.initEditRefund()
      this.modal.call('Success mengubah gambar', 'success', 1500, () => {
        this.props.userStatusReturnRequest(this.state.orderNo, this.state.email)
        this.props.navigation.goBack()
      })
    }
  }

  setSelectedImage = (image, index) => {
    if (!this.props.returnHandler.fetchingImageUrl) {
      this.setState({
        selectedImage: image,
        selectedIndex: index
      })
    }
  }

  componentWillUnmount () {
    this.modal = null
  }

  submitNewFoto = () => {
    let data = {
      refund_no: this.state.refundNo,
      customer_id: this.state.customerId,
      item: {
        promo_items: this.state.promoItems,
        refund_item_id: this.state.refundItemId,
        qty_refunded: this.state.qtyRefunded,
        images: this.state.images
      }
    }
    this.props.editRefundRequest(data)
  }

  render () {
    const { selectedImage, images, selectedIndex } = this.state
    return (
      <View style={{ flex: 1 }}>
        <HeaderSearchComponent back pageName={'Ubah Foto'} navigation={this.props.navigation} />
        {isEmpty(images)
          ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Tidak ada gambar ditemukan</Text>
          </View>
          : <ScrollView>
            <Container>
              <View style={{ flex: 1 }}>
                <View style={{ justifyContent: 'center' }}>
                  {(this.props.returnHandler.fetchingImageUrl)
                    ? <View style={{ width: Dimensions.get('screen').width * 0.925, height: Dimensions.get('screen').height * 0.4, justifyContent: 'center', alignItems: 'center' }}>
                      <LottieComponent />
                    </View>
                    : <ShimmerPlaceHolder
                      autoRun
                      style={{ marginTop: 7 }}
                      width={Dimensions.get('screen').width * 0.925}
                      height={Dimensions.get('screen').height * 0.4}
                      visible={this.state.isfetched}
                    >
                      <Image onLoad={() => this.setState({ isfetched: true })} source={{ uri: selectedImage.image_url }} style={{ width: Dimensions.get('screen').width * 0.925, height: Dimensions.get('screen').height * 0.4, borderRadius: 5, alignSelf: 'center' }} />
                    </ShimmerPlaceHolder>
                  }
                </View>
                <TouchableOpacity onPress={() => this.captureImage()}>
                  <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                    <Icon name='pencil' color='#008CCF' size={16} />
                    <Text style={{ fontFamily: 'Quicksand-Medium', color: '#008CCF', fontSize: 16, marginLeft: 5 }}>Ubah Foto</Text>
                  </View>
                </TouchableOpacity>
                <View style={{ width: Dimensions.get('screen').width * 0.925, borderBottomWidth: 1, borderBottomColor: '#F0F2F7', alignSelf: 'center', marginBottom: 10 }} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 10 }}>
                  {(images.map((image, index) => (
                    <TouchableOpacity style={(selectedIndex === index) ? { borderWidth: 3, borderRadius: 5, borderColor: '#F26525' } : null} onPress={() => this.setSelectedImage(image, index)} key={`refund foto ${index}`}>
                      {(selectedIndex === index && this.props.returnHandler.fetchingImageUrl)
                        ? <View style={{ width: Dimensions.get('screen').width * 0.3, height: Dimensions.get('screen').width * 0.3, justifyContent: 'center', alignItems: 'center' }}>
                          <LottieComponent />
                        </View>
                        : <Image source={{ uri: image.image_url }} style={{ width: Dimensions.get('screen').width * 0.3, height: Dimensions.get('screen').width * 0.3, borderRadius: 5 }} />
                      }
                    </TouchableOpacity>
                  )))}
                </View>
                <InfoBox>
                  <Icon name='information-outline' size={16} color='#757886' style={{ marginRight: 5, marginTop: 2 }} />
                  <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 16 }}>Klik foto lainnya untuk mengubah foto sekaligus</Text>
                </InfoBox>
                <View style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                  {!isEmpty(this.props.returnRefund.errEditRefund)
                    ? <Text style={{ fontFamily: 'Quicksand-Regular', color: '#F3251D', fontSize: 16, marginBottom: 10 }}>{this.props.returnRefund.errEditRefund}</Text>
                    : null}
                  <ButtonFilledPrimary onPress={() => this.submitNewFoto()}>
                    <ButtonFilledText style={{ fontFamily: 'Quicksand-Bold' }}>Kirim</ButtonFilledText>
                  </ButtonFilledPrimary>
                </View>
              </View>
            </Container>
          </ScrollView>
        }
        <Snackbar ref={ref => { this.modal = ref }} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  returnHandler: state.returnHandler,
  returnRefund: state.returnRefund
})

const mapDispatchToProps = (dispatch) => ({
  initImage: () => dispatch(ReturnRefundHandlerActions.initImage()),
  editRefundRequest: (data) => dispatch(ReturnRefundActions.editRefundRequest(data)),
  initEditRefund: () => dispatch(ReturnRefundActions.initEditRefund()),
  userStatusReturnRequest: (orderNo, email) => dispatch(ReturnRefundActions.userStatusReturnRequest(orderNo, email))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditRefundStatusImagePage)
