import React, { Component } from 'react'
import { TouchableOpacity, Modal, Image, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Style
import GoSendTnc from './GoSendTnc'
import { TextModal, ModalHeader } from '../Styles/StyledComponents'

export default class GojekPdp extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  setModalVisible (visible) {
    this.setState({ showModal: visible })
  }

  render () {
    const { canDelivery } = this.props

    return (
      <>
        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
          {(canDelivery && canDelivery.can_delivery_gosend && canDelivery.courier_list.some(e => e.courier_id === 7))
            ? <Image source={require('../assets/images/delivery-logo/instant-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, marginRight: 10, marginTop: 10, height: 40, flexWrap: 'wrap' }} />
            : <Image source={require('../assets/images/delivery-logo/instant-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, marginRight: 10, marginTop: 10, height: 40, flexWrap: 'wrap' }} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.setModalVisible(true)}>
          {(canDelivery && canDelivery.can_delivery_gosend && canDelivery.courier_list.some(e => e.courier_id === 8))
            ? <Image source={require('../assets/images/delivery-logo/same-day-active.webp')} style={{ width: Dimensions.get('screen').width * 0.3, marginRight: 10, marginTop: 10, height: 40, flexWrap: 'wrap' }} />
            : <Image source={require('../assets/images/delivery-logo/same-day-inactive.webp')} style={{ width: Dimensions.get('screen').width * 0.3, marginRight: 10, marginTop: 10, height: 40, flexWrap: 'wrap' }} />
          }
        </TouchableOpacity>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.showModal}
          onRequestClose={() => { this.setModalVisible(false) }}
        >
          <SafeAreaView>
            <ScrollView>
              <ModalHeader>
                <Icon name='close-circle' size={24} color='white' />
                <TextModal>Informasi Pengiriman</TextModal>
                <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => {
                  this.setModalVisible(false)
                }} />
              </ModalHeader>
              <GoSendTnc />
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </>
    )
  }
}
