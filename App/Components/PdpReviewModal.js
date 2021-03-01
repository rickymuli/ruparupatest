import React, { Component } from 'react'
import { Modal, View, Image, SafeAreaView, FlatList, Platform, Dimensions } from 'react-native'
import { connect } from 'react-redux'
import config from '../../config'
import { UpperCase, NumberWithCommas } from '../Utils/Misc'
import
{
  ButtonSecondaryOutlineM,
  ButtonSecondaryOutlineText,
  RowItem,
  Row,
  ProductCardDescriptionContainer,
  ProductName,
  OldPrice,
  DiscountText,
  PriceText,
  ReviewContainer,
  ReviewContainerNoBorder,
  // ButtonFilledPrimary,
  // ButtonFilledText,
  Bold,
  FontSizeL
} from '../Styles/StyledComponents'

// Components
import RatingChart from './RatingChart'
import RatingStars from './RatingStars'
import ReviewImagesComponent from './ReviewImagesComponent'
import SortReviewContainer from './SortReviewContainer'
import ReviewCard from './ReviewCard'
import Loading from './LottieComponent'
import HeaderSearchComponent from './HeaderSearchComponent'
import AddToCartButton from './AddToCartButton'

class PdpReviewModal extends Component {
  constructor () {
    super()
    this.state = {
      reviewModal: false
    }
    this.onEndReachedCalledDuringMomentum = false
  }

  renderPrice = (price) => {
    let discount = 0
    if (price.special_price !== 0) {
      discount = ((price.price - price.special_price) / price.price) * 100
    }
    return (
      <View style={{ marginBottom: 5 }}>
        {(discount > 0) &&
        <Row marginVertical={5}>
          <OldPrice>Rp {NumberWithCommas(price.price)}</OldPrice>
          <DiscountText>{`${Math.floor(discount)}% off`}</DiscountText>
        </Row>
        }
        <PriceText>Rp {NumberWithCommas((discount > 0) ? price.special_price : price.price)}</PriceText>
      </View>
    )
  }

  _renderEmptyComponent = () => {
    return (
      <View style={{ height: Dimensions.get('screen').height * 0.5, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ margin: 20 }}>
          <FontSizeL>Tidak ada Review</FontSizeL>
        </View>
      </View>
    )
  }

  setModalVisible = (visible) => {
    this.setState({
      reviewModal: visible
    })
  }

  _renderHeaderComponent = () => {
    const { activeVariant, name, reviewRating } = this.props
    return (
      <View>
        <ReviewContainer>
          <RowItem>
            <Image style={{ width: 150, height: 150 }} source={{ uri: `${config.imageURL}w_150,h_150,f_auto${activeVariant.images[0].image_url}` }} />
            <ProductCardDescriptionContainer>
              <ProductName>{UpperCase(name.toLowerCase())}</ProductName>
              {this.renderPrice(activeVariant.prices[0])}
              <RatingStars rating={reviewRating.data.product_rating.average_star} total={`(${reviewRating.data.product_rating.total})`} />
            </ProductCardDescriptionContainer>
          </RowItem>
          <AddToCartButton
            page={'reviewrating'}
            buttonText={'Tambah ke Keranjang'}
            activeVariant={activeVariant}
            quantity={1}
            modalHide={this.setModalVisible.bind(this)}
          />
          {/* <ButtonFilledPrimary onPress={() => this.goToCart()}>
            <ButtonFilledText>Tambah ke Keranjang</ButtonFilledText>
          </ButtonFilledPrimary> */}
        </ReviewContainer>
        <RatingChart />
        <ReviewContainer>
          <SortReviewContainer sku={activeVariant.sku} />
        </ReviewContainer>
        <ReviewContainerNoBorder>
          <ReviewImagesComponent title={'Editor & Customer Photos'} images={reviewRating.data.product_review_images} />
          <Bold>Reviews</Bold>
        </ReviewContainerNoBorder>
      </View>
    )
  }

  render () {
    const { reviewRating } = this.props
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <View>
        <ButtonSecondaryOutlineM onPress={() => this.setState({ reviewModal: true })}>
          <ButtonSecondaryOutlineText>Lihat Semua Review</ButtonSecondaryOutlineText>
        </ButtonSecondaryOutlineM>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.reviewModal}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}>
          <SafeAreaView style={{ backgroundColor: '#FFF', flex: 1 }}>
            <HeaderSearchComponent leftAction={() => this.setModalVisible(false)} back pageName={'Review'} />
            <FlatList
              data={reviewRating.sortData.reviews}
              removeClippedSubviews={removeClippedSubviews}
              ListHeaderComponent={this._renderHeaderComponent}
              ListEmptyComponent={this._renderEmptyComponent}
              initialNumToRender={10}
              maxToRenderPerBatch={5}
              renderItem={({ item }) => {
                if (reviewRating.fetching) {
                  return (
                    <Loading />
                  )
                } else {
                  return (
                    <View style={{ paddingHorizontal: 15, backgroundColor: '#fff' }}>
                      <ReviewCard data={item} />
                    </View>
                  )
                }
              }}
            />
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  reviewRating: state.reviewRating
})

export default connect(mapStateToProps)(PdpReviewModal)
