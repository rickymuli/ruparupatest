import React, { Component } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { RowItem, ProductCardDescriptionContainer, ProductName, FormS, DistributeSpaceBetween, FontSizeM, Container, ReviewContainer } from '../Styles/StyledComponents'
import config from '../../config'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import includes from 'lodash/includes'
import { connect } from 'react-redux'
import { WithContext } from '../Context/CustomContext'

// Components
import EasyModal from './EasyModal'
import Loading from './LoadingComponent'

class RefundTypeComponent extends Component {
  constructor () {
    super()
    this.state = {
      reasonName: ''
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEmpty(props.returnMethods[props.index])) {
      if (!isEqual(state.reasonName, props.returnMethods[props.index].reasonName)) {
        returnObj = {
          ...returnObj,
          reasonName: props.returnMethods[props.index].reasonName
        }
      }
    }
    return returnObj
  }

  setReturnType = (method) => {
    let payload = {
      reasonType: method.value,
      reasonName: method.name
    }
    this.props.setupState('returnMethods', payload, this.props.index)
    this.refs.child.setModal(false)
  }

  render () {
    const { reasonName } = this.state
    const { item, returnRefund } = this.props
    const supportCancelReturnStatus = ['new', 'ready_to_pickup']
    return (
      <>
        <RowItem>
          <Image style={{ width: 100, height: 100 }} source={{ uri: `${config.imageURL}w_150,h_150,f_auto${item.image_url}` }} />
          <ProductCardDescriptionContainer>
            <ProductName>{UpperCase(item.name.toLowerCase())}</ProductName>
          </ProductCardDescriptionContainer>
        </RowItem>
        <FormS>
          {(returnRefund.fetchingReturnMethod)
            ? <Loading />
            : <TouchableOpacity onPress={() => this.refs.child.setModal(true)}>
              <DistributeSpaceBetween>
                <View style={{ alignSelf: 'center' }}>
                  <FontSizeM>{!isEmpty(reasonName) ? reasonName : 'Pilih metode pengembalian'}</FontSizeM>
                </View>
                <Icon name='menu-down' size={30} />
              </DistributeSpaceBetween>
            </TouchableOpacity>
          }
        </FormS>
        <EasyModal ref='child' size={80}>
          <Container>
            <ReviewContainer>
              <TouchableOpacity onPress={() => this.refs.child.setModal(false)}>
                <DistributeSpaceBetween>
                  <View style={{ alignSelf: 'center' }}>
                    <FontSizeM>Pilih metode pengembalian</FontSizeM>
                  </View>
                  <Icon name='menu-up' size={30} />
                </DistributeSpaceBetween>
              </TouchableOpacity>
            </ReviewContainer>
            <ReviewContainer>
              {(includes(supportCancelReturnStatus, item.shipmentStatus) || item.status_fulfillment === 'incomplete')
                ? <TouchableOpacity onPress={() => this.setReturnType({ value: 'cancel_refund', name: 'Batalkan Pesanan' })}>
                  <Container>
                    <FontSizeM>Batalkan Pesanan</FontSizeM>
                  </Container>
                </TouchableOpacity>
                : <TouchableOpacity onPress={() => this.setReturnType({ value: 'return_refund', name: 'Pengembalian Dana' })}>
                  <Container>
                    <FontSizeM>Pengembalian Dana</FontSizeM>
                  </Container>
                </TouchableOpacity>
              }
            </ReviewContainer>
            {/* {(returnRefund.returnMethod.map((method, index) => (
              <ReviewContainer key={`return method ${index}`}>
                <TouchableOpacity onPress={() => this.setReturnType(method)}>
                  <Container>
                    <FontSizeM>{method.name}</FontSizeM>
                  </Container>
                </TouchableOpacity>
              </ReviewContainer>
            )))} */}
          </Container>
        </EasyModal>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  returnRefund: state.returnRefund
})

export default WithContext(connect(mapStateToProps)(RefundTypeComponent))
