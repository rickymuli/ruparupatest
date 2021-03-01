import React, { Component } from 'react'
import { View, Image, TouchableOpacity, TextInput } from 'react-native'
import { ReviewContainer, RowItem, Bold, ProductCardDescriptionContainer, ProductName, FormS, FontSizeM, Container, DistributeSpaceBetween } from '../Styles/StyledComponents'
import config from '../../config'
import { UpperCase } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'

// Context
import { WithContext } from '../Context/CustomContext'

// Components
import EasyModal from './EasyModal'
import Loading from './LoadingComponent'

class ProductReturnReason extends Component {
  constructor () {
    super()
    this.state = {
      reason: 'Pilih alasan pengembalian',
      notes: ''
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.reasons[props.index])) {
      if (props.reasons[props.index].reasonName !== state.reason) {
        returnObj = {
          ...returnObj,
          reason: props.reasons[props.index].reasonName
        }
      }
      if (props.reasons[props.index].notes !== state.notes) {
        returnObj = {
          ...returnObj,
          notes: props.reasons[props.index].notes
        }
      }
    }
    return returnObj
  }

  setReason = (value) => {
    let payload = {
      reasonId: value.refund_reason_id,
      reasonName: value.name,
      notes: this.state.notes
    }
    this.props.setupState('reasons', payload, this.props.index)
    this.refs.child.setModal(false)
  }

  setNotes = (e) => {
    let payload = {
      ...this.props.reasons[this.props.index],
      notes: e
    }
    this.props.setupState('reasons', payload, this.props.index)
  }

  sendToParent = () => {
    const { item } = this.props
    const { reason, notes } = this.state
    return { sku: item.sku, reason, notes }
  }

  render () {
    const { reason, notes } = this.state
    const { item, returnRefund } = this.props
    let itemAttribute = JSON.parse(item.attributes)
    return (
      <>
        <RowItem>
          <Image style={{ width: 100, height: 100 }} source={{ uri: `${config.imageURL}w_150,h_150,f_auto${item.image_url}` }} />
          <ProductCardDescriptionContainer>
            <ProductName>{UpperCase(item.name.toLowerCase())}{(!isEmpty(itemAttribute)) ? ` - ${itemAttribute[0].attribute_label}: ${itemAttribute[0].attribute_value}` : '' }</ProductName>
            {(!isEmpty(item.promo_items)) &&
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontSizeM>Produk Promo </FontSizeM>
                <Icon name='information' color='#F26525' />
                <Bold style={{ fontSize: 14, color: '#F26525' }}>{`Buy ${(item.discount_step === 0) ? 1 : item.discount_step} Get ${(item.discount_step === 0) ? 1 : item.discount_step}`}</Bold>
              </View>
            }
          </ProductCardDescriptionContainer>
        </RowItem>
        <FormS>
          <TouchableOpacity onPress={() => this.refs.child.setModal(true)}>
            <DistributeSpaceBetween>
              <View style={{ alignSelf: 'center' }}>
                <FontSizeM>{reason}</FontSizeM>
              </View>
              <Icon name='menu-down' size={30} />
            </DistributeSpaceBetween>
          </TouchableOpacity>
        </FormS>
        <FormS>
          <TextInput
            textAlignVertical='top'
            placeholder='Tulis detail alasan Anda disini'
            style={{ height: 100, fontFamily: 'Quicksand-Regular' }}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={(e) => this.setNotes(e)}
          />
        </FormS>
        <EasyModal ref='child' size={80}>
          <Container>
            <ReviewContainer>
              <TouchableOpacity onPress={() => this.refs.child.setModal(false)}>
                <DistributeSpaceBetween>
                  <View style={{ alignSelf: 'center' }}>
                    <FontSizeM>Pilih alasan pengembalian</FontSizeM>
                  </View>
                  <Icon name='menu-up' size={30} />
                </DistributeSpaceBetween>
              </TouchableOpacity>
            </ReviewContainer>
            {(!isEmpty(returnRefund.reasons)
              ? returnRefund.reasons.map((value, index) => (
                <ReviewContainer key={`reasons ${index}`}>
                  <TouchableOpacity onPress={() => this.setReason(value)}>
                    <Container>
                      <FontSizeM>{value.name}</FontSizeM>
                    </Container>
                  </TouchableOpacity>
                </ReviewContainer>
              ))
              : returnRefund.fetchingReason &&
                <Loading />
            )}
          </Container>
        </EasyModal>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund
})

export default WithContext(connect(mapStateToProps)(ProductReturnReason))
