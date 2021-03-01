import React, { useState } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import Modal from 'react-native-modal'
import { Navigate } from '../Services/NavigationService'
// import AntDesign from 'react-native-vector-icons/AntDesign'

const Modal1111 = () => {
  const [state, setstate] = useState(true)
  const onPress = () => {
    setstate(false)
    let itemDetail = {
      data: {
        url_key: 'payday',
        promo_type: null,
        company_code: 'ODI'
      }
    }
    let itmData = {
      itm_source: 'homepage',
      itm_campaign: 'popup-promo',
      promo: 'payday'
    }
    Navigate('PromoPage', { itemDetail, itmData })
  }
  return (
    <Modal
      isVisible={state}
      onBackdropPress={() => setstate(false)}
    >
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => onPress()}>
          <Image
            source={require('../assets/images/promo/payday-popup-banner.webp')}
            style={{ height: 300, width: 300 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={()=> setstate(false)} style={{margin: 10}}>
                <AntDesign name={'closecircleo'} size={40} color={'#D6561D'} />
            </TouchableOpacity> */}
      </View>
    </Modal>
  )
}

export default Modal1111
