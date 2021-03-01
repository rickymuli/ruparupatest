import React, { Component } from 'react'
import { View, Image, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import {
  DistributeSpaceBetween,
  Container,
  ProductName,
  ContainerWithBorder,
  TextModal,
  ButtonPrimaryOutlineMDisabled,
  ButtonPrimaryOutlineM,
  ButtonPrimaryOutlineText,
  ButtonPrimaryOutlineTextS,
  ButtonFilledPrimary,
  ButtonFilledText,
  FontSizeM,
  Bold,
  Row } from '../Styles/StyledComponents'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'
import ReviewHandlerActions from '../Redux/ReviewHandlerRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import RatingStarsFillable from '../Components/RatingStarsFillable'
import CommentContainer from '../Components/CommentContainer'
import ReviewProductTags from '../Components/ReviewProductTags'
import ImagePreviewContainer from '../Components/ImagePreviewContainer'
import Loading from '../Components/LottieComponent'
import Snackbar from '../Components/SnackbarComponent'

class ReviewDetailPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rating: 0,
      ratingPengiriman: 0,
      ratingPackaging: 0,
      selectedData: props.navigation.getParam('data', 'nothing found...'),
      tags: [],
      description: ''
    }
  }

  setRating = (index) => {
    this.setState({ rating: index + 1 })
  }

  submitServiceReview = () => {
    const { selectedData, description, ratingPackaging, ratingPengiriman } = this.state
    let data = {
      invoice_no: selectedData.invoice_no,
      shipment_rating: ratingPengiriman,
      packing_rating: ratingPackaging,
      description
    }
    this.props.insertReviewServiceRequest(data)
  }

  submitReview = async () => {
    const { selectedData, rating, tags, description } = this.state
    const { images } = this.props.reviewHandler
    let data = {
      sku: selectedData.sku,
      invoiceNo: selectedData.invoice_no,
      reviewAs: 'customer',
      rating,
      tags: tags.map((tag) => { return tag.review_tag_id }),
      description,
      images: (!isEmpty(images)) ? images : []
    }
    this.props.insertReviewProductRequest(data)
  }

  onChangeDescription = (e) => {
    this.setState({ description: e })
  }

  onChangeTags = (tag) => {
    const { tags, rating } = this.state
    let newTags = [...tags]
    const index = newTags.indexOf(tag)
    // Delete tag
    if (rating === 3) {
      newTags = []
    } else {
      if (index > -1) {
        newTags.splice(index, 1)
      } else {
        newTags.push(tag)
      }
    }
    this.setState({ tags: newTags })
  }

  componentDidUpdate (prevProps) {
    if (this.props.reviewRating.successInsert && !prevProps.reviewRating.successInsert) {
      this.refs.child.call('Sukses mengirim review', 'success', 2500, () => {
        this.props.navigation.goBack()
      })
    } else if (!this.props.reviewRating.successInsert && !isEmpty(this.props.reviewRating.errorInsertProductReview)) {
      this.refs.child.call(this.props.reviewRating.errorInsertProductReview.toString(), 'error', 10000)
      this.props.initSuccessInsert()
    }
  }

  componentWillUnmount () {
    this.props.initSuccessInsert()
    this.props.initStates() // Reset review handler images
  }

  render () {
    const { selectedData, ratingPackaging, ratingPengiriman } = this.state
    const { reviewRating } = this.props
    const { images } = this.props.reviewHandler
    const ButtonCameraComponent = (images.length === 3) ? ButtonPrimaryOutlineMDisabled : ButtonPrimaryOutlineM
    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={(Platform.OS === 'ios') ? 'position' : null}>
        <ScrollView>
          <HeaderSearchComponent navigation={this.props.navigation} pageName={(selectedData.type === 'product') ? 'Review Produk' : 'Review Pelayanan'}close />
          {(selectedData.type === 'service') &&
          <Container>
            {(!isEmpty(selectedData.dikirim_oleh) && selectedData.dikirim_oleh.toLowerCase() === 'ruparupa')
              ? <FontSizeM><Bold>rup</Bold><Bold style={{ color: '#F26525' }}>a</Bold><Bold>rup</Bold><Bold style={{ color: '#008CCF' }}>a</Bold><Bold> via {selectedData.store_name}</Bold></FontSizeM>
              : <FontSizeM><Bold>{selectedData.dikirim_oleh}</Bold></FontSizeM>
            }
          </Container>
          }
          <Container>
            {(selectedData.type === 'product')
              ? <DistributeSpaceBetween>
                <Image style={{ width: 40, height: 40 }} source={{ uri: selectedData.image_url }} />
                <View style={{ width: Dimensions.get('screen').width * 0.8 }}>
                  <ProductName>{UpperCase(selectedData.product_name.toLowerCase())}</ProductName>
                </View>
              </DistributeSpaceBetween>
              : <ScrollView horizontal>
                <Row>
                  {selectedData.invoice_items.map((itemData, index) => (
                    <Image source={{ uri: itemData.image_url }} style={{ width: 40, height: 40, margin: 10 }} />
                  ))}
                </Row>
              </ScrollView>
            }
          </Container>
          {(selectedData.type === 'product')
            ? <ContainerWithBorder style={{ borderTopWidth: 0.5 }}>
              <TextModal>Berapa rating produk ini?</TextModal>
              <RatingStarsFillable setRating={this.setRating} rating={this.state.rating} />
            </ContainerWithBorder>
            : <>
              <ContainerWithBorder style={{ borderTopWidth: 0.5 }}>
                <TextModal>Ketepatan Pengiriman</TextModal>
                <RatingStarsFillable setRating={(index) => this.setState({ ratingPengiriman: index + 1 })} rating={ratingPengiriman} />
              </ContainerWithBorder>
              <ContainerWithBorder style={{ borderTopWidth: 0.5 }}>
                <TextModal>Kualitas Packing</TextModal>
                <RatingStarsFillable setRating={(index) => this.setState({ ratingPackaging: index + 1 })} rating={ratingPackaging} />
              </ContainerWithBorder>
        </>
          }
          {(selectedData.type === 'service' && ratingPengiriman > 0 && ratingPackaging > 0) &&
        <>
          <CommentContainer forService comment={this.state.description} changeDescription={this.onChangeDescription} />
          <Container>
            {(reviewRating.insertingReview)
              ? <View style={{ padding: 10, backgroundColor: '#D4DCE6', borderRadius: 4 }}>
                <Loading style={{ width: 18, height: 20 }} />
              </View>
              : <ButtonFilledPrimary onPress={() => this.submitServiceReview()}>
                <ButtonFilledText>Selesai</ButtonFilledText>
              </ButtonFilledPrimary>
            }
          </Container>
        </>
          }
          {(this.state.rating > 0 && selectedData.type !== 'service') &&
          <View>
            <Container>
              <ButtonCameraComponent onPress={() => this.props.navigation.navigate('CameraPage')}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 10 }}>
                  <Icon style={{ alignSelf: 'center' }} name='camera' color={(images.length === 3) ? '#757886' : '#F26525'} size={30} />
                  <ButtonPrimaryOutlineText style={[(images.length === 3) && { color: '#757886' }]}>{`Tambah (Max 3 Foto)`}</ButtonPrimaryOutlineText>
                  <ButtonPrimaryOutlineTextS style={[(images.length === 3) && { color: '#757886' }]}>{`Max. 2MB/foto, JPG/PNG`}</ButtonPrimaryOutlineTextS>
                </View>
              </ButtonCameraComponent>
            </Container>
            {(!isEmpty(images)) &&
            <ImagePreviewContainer />
            }
            <CommentContainer comment={this.state.description} changeDescription={this.onChangeDescription} />
            <ReviewProductTags tags={this.state.tags} onChangeTags={this.onChangeTags} rating={this.state.rating} />
            <Container>
              {(reviewRating.insertingReview)
                ? <View style={{ padding: 10, backgroundColor: '#D4DCE6', borderRadius: 4 }}>
                  <Loading style={{ width: 27, height: 30 }} />
                </View>
                : <ButtonFilledPrimary onPress={() => this.submitReview()}>
                  <ButtonFilledText>Selesai</ButtonFilledText>
                </ButtonFilledPrimary>
              }
            </Container>
          </View>
          }
        </ScrollView>
        <Snackbar ref='child' />
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewHandler: state.reviewHandler,
  reviewRating: state.reviewRating
})

const mapDispatchToProps = (dispatch) => ({
  insertReviewProductRequest: (data) => dispatch(ReviewRatingActions.insertReviewProductRequest(data)),
  initSuccessInsert: () => dispatch(ReviewRatingActions.initSuccessInsert()),
  insertReviewServiceRequest: (data) => dispatch(ReviewRatingActions.insertReviewServiceRequest(data)),
  initStates: () => dispatch(ReviewHandlerActions.initStates())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewDetailPage)
