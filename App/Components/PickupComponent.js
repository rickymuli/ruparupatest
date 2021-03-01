import React, { Component } from 'react'
import { View, Text, Modal, Image } from 'react-native'
import PickupModal from './PickupModal'

export default class PickupComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false
    }
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  render () {
    return (
      <View>
        <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, paddingVertical: 4 }}>Pengambilan di Toko</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={{ width: 40, height: 50, marginRight: 4 }} source={require('../assets/images/icon/pickup-pdp.webp')} />
          {/* <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Regular', flex: 1, flexWrap: 'wrap' }}>Tanpa antri di kasir! Produk tersedia untuk diambil sendiri di <Text style={{ fontWeight: 'bold' }}>{stockFiltered.length} Store</Text> Ace Hardware/ Informa/ Toys Kingdom terdekat</Text> */}
          <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Regular', flex: 1, flexWrap: 'wrap' }}>{'Belanja tanpa perlu antri di kasir, \nProduk ini dapat Anda ambil sendiri di toko kami'}</Text>
        </View>
        {/* <TouchableOpacity onPress={() => this.setModalVisible(true)} style={{ paddingHorizontal: 40, paddingVertical: 10, borderRadius: 3, borderWidth: 1, borderColor: '#E5E9F2', marginTop: 20 }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757885', fontSize: 16, textAlign: 'center' }}>Pilih Lokasi Pickup ({stockFiltered.length} Store)</Text>
        </TouchableOpacity> */}
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { this.setModalVisible(false) }}
        >
          <PickupModal {...this.props} setModalVisible={this.setModalVisible.bind(this)} />
        </Modal>
      </View>
    )
  }
}
