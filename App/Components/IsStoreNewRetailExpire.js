import React, { useState, useEffect } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Modal from 'react-native-modal'
import isEmpty from 'lodash/isEmpty'
import gt from 'lodash/gt'

// Redux
import { useDispatch } from 'react-redux'
import CartActions from '../Redux/CartRedux'

const IsStoreNewRetailExpire = (props) => {
  const [isVisible, setIsVisible] = useState(false)
  const [storeData, setStoreData] = useState({})
  const dispatch = useDispatch()
  const removeStoreData = async () => {
    dispatch(CartActions.cartTypeRequest())
    setIsVisible(false)
  }

  useEffect(() => {
    // REMOVE FOR TEST PURPOSE
    // removeStoreData()
    AsyncStorage.getItem('store_new_retail_data')
      .then(value => {
        if (!isEmpty(value)) {
          let data = JSON.parse(value)
          setStoreData(data)
          setIsVisible(true)
          if (gt(new Date(), new Date(data.time_expire))) {
            setStoreData(data)
            setIsVisible(true)
          }
        }
      })
  }, [])

  return <Modal
    backdropTransitionOutTiming={1}
    isVisible={isVisible}
    animationIn={'slideInDown'}
    animationOut={'slideOutUp'}
    onBackdropPress={() => setIsVisible(false)}
  >
    <View style={{ backgroundColor: 'white', padding: 18, justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
      <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 16 }}>Konfirmasi</Text>
      <Text style={{ fontFamily: 'Quicksand-Medium', marginBottom: 12, fontSize: 14, textAlign: 'center' }}>{`Hi, waktu transaksimu di ${storeData.store_name} sudah habis`}</Text>
      <TouchableOpacity onPress={() => setIsVisible(false)} style={{ backgroundColor: '#FF7F45', alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, marginTop: 6, marginBottom: 4, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Iya</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => removeStoreData()} style={{ alignSelf: 'stretch', paddingVertical: 6, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 14 }}>Tidak</Text>
      </TouchableOpacity>
    </View>
  </Modal>
}

export default IsStoreNewRetailExpire
