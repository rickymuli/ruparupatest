import React, { Component } from 'react'
import { Image, TouchableOpacity, Dimensions, View } from 'react-native'
import { RowItem, ProductCardDescriptionContainer, ProductName, FontSizeS, MiniContainerWithBorder } from '../Styles/StyledComponents'
import config from '../../config'
import { UpperCase } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import styled from 'styled-components'

// Context
import { WithContext } from '../Context/CustomContext'

// Components
import Loading from './LottieComponent'

class UploadImageReturnRefund extends Component {
  constructor () {
    super()
    this.state = {
      isfetched: false
    }
  }
  captureImage = (imageIndex) => {
    if (!this.props.fetchingImageUrl) {
      let data = {
        qtyIndex: this.props.qtyIndex, // Qty Index
        origin: 'return-refund',
        imageIndex, // Image Index
        itemIndex: this.props.index + 1,
        salesOrderItemId: this.props.item.sales_order_item_id
      }
      this.props.navigation.navigate('CameraPage', { data })
    }
  }

  renderImage = (index, desc) => {
    const { images, fetchingImageUrl } = this.props
    let imageURL = ''
    images.map((imageData) => {
      if (!isEmpty(imageData)) {
        // if the first 2 character of the id starts with the and the image index and item index
        if (imageData.id.startsWith(`${(this.props.qtyIndex) * 3 + (index + 1)}${this.props.index + 1}`)) {
          imageURL = imageData.output
        }
      }
    })
    return (
      <>
        {(fetchingImageUrl)
          ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <Loading />
          </View>
          : (!isEmpty(imageURL))
            ? <ShimmerPlaceHolder
              autoRun
              style={{ marginTop: 7 }}
              width={100}
              height={100}
              visible={this.state.isfetched}
            >
              <Image onLoad={() => this.setState({ isfetched: true })} source={{ uri: imageURL }} style={{ width: 100, height: 100 }} />
            </ShimmerPlaceHolder>
            : <>
              <Icon name='plus' size={26} />
              <FontSizeS style={{ textAlign: 'center' }}>{desc}</FontSizeS>
            </>
        }
      </>
    )
  }

  render () {
    const { item, errImageUpload } = this.props
    const imageDesc = ['Foto keseluruhan produk', 'Foto kerusakan produk', 'Foto kondisi kemasan saat diterima']
    const { width } = Dimensions.get('screen')
    return (
      <>
        <RowItem>
          <Image style={{ width: 100, height: 100 }} source={{ uri: `${config.imageURL}w_150,h_150,f_auto${item.image_url}` }} />
          <ProductCardDescriptionContainer>
            <ProductName>{UpperCase(item.name.toLowerCase())}</ProductName>
          </ProductCardDescriptionContainer>
        </RowItem>
        {!isEmpty(errImageUpload) && <Error>{errImageUpload}</Error>}
        <RowItem>
          {imageDesc.map((desc, index) => (
            <TouchableOpacity key={`upload return refund image ${index}`} onPress={() => this.captureImage(index + 1)} style={{ borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 5 }}>
              <MiniContainerWithBorder style={{ width: width * 0.3, height: width * 0.3 }}>
                {this.renderImage(index, desc)}
              </MiniContainerWithBorder>
            </TouchableOpacity>
          ))}
        </RowItem>
      </>
    )
  }
}

export default WithContext(UploadImageReturnRefund)

const Error = styled.Text`
  text-align: center;
  color: #F3251D;
  fontSize: 14;
  fontFamily: Quicksand-Regular;
  paddingBottom: 10;
  paddingTop: 5;
`
