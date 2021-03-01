import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const ScanGuide = props => {
  return <View style={{ backgroundColor: 'white', padding: 15, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontFamily: 'Quicksand-Bold', marginBottom: 12, fontSize: 18 }}>Panduan scan produk</Text>
    <Image source={require('../assets/images/new-retail/scan.webp')} style={{ height: 101, width: 102 }} />
    <View style={{ backgroundColor: '#e5f7ff', padding: 10, justifyContent: 'flex-start', flexDirection: 'row', marginVertical: 10 }}>
      <Icon name={'information'} size={20} />
      <View style={{ flex: 1, paddingLeft: 4 }}>
        <Text style={{ fontFamily: 'Quicksand-Regular' }}>1. Arahkan kamera pada barcode produk.</Text>
        <Text style={{ fontFamily: 'Quicksand-Regular' }}>2. Jika barcode bermasalah, coba scan barcode pada label harga atau hubungi staf toko kami.</Text>
      </View>
    </View>
    <TouchableOpacity onPress={() => props.setParentState({ isVisible: false })} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Mengerti</Text>
    </TouchableOpacity>
  </View>
}

export default ScanGuide
