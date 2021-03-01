import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Navigate } from '../Services/NavigationService'
import { useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import find from 'lodash/find'
import get from 'lodash/get'
// import LottieComponent from '../Components/LottieComponent'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import UserActions from '../Redux/UserRedux'

import { WithContext } from '../Context/CustomContext'

const ShareAndWishlist = (props) => {
  const { itemData, shareLink, activeVariant = {}, callSnackbarWithAction } = props
  const route = useRoute()
  const dispatch = useDispatch()
  const [isWishlist, setIsWishlist] = useState(false)

  const { wishlist } = useSelector(state => state.user)
  const { user } = useSelector(state => state.auth)
  const { data: storeNewRetailData } = useSelector(state => state.storeNewRetail)

  const updateWishlist = (data) => dispatch(UserActions.userToggleWishlistRequest(data))

  useEffect(() => {
    if (wishlist && wishlist.hasOwnProperty('items') && Array.isArray(wishlist.items)) {
      let found = find(wishlist.items, ['variants[0].sku', activeVariant?.sku ?? ''])
      setIsWishlist(!!found)
    } else setIsWishlist(false)
  }, [wishlist])

  const toggleWishlistButton = () => {
    if (!user) return Navigate('Profil', { params: { fromPDP: itemData } })
    let isProductScanned = route.params?.isScanned ?? false
    let method = 'add'
    let message = 'Berhasil menambah ke wishlist'
    if (isWishlist) {
      method = 'delete'
      message = 'Berhasil menghapus ke wishlist'
    }
    let storeCodeNewRetail = get(storeNewRetailData, 'store_code', '')
    setIsWishlist(!isWishlist)
    updateWishlist({ method, sku: activeVariant.sku, isProductScanned: isProductScanned ? 10 : 0, storeCodeNewRetail })
    callSnackbarWithAction(message, 'Lihat Wishlist')
  }

  return (
    <View style={{ padding: 5, flexDirection: 'row', backgroundColor: 'white', marginBottom: 10 }}>
      <TouchableOpacity onPress={() => toggleWishlistButton()} style={{ flexDirection: 'row', paddingTop: 10, opacity: 0.7 }}>
        <Text style={{ fontSize: 12, color: '#757885', fontFamily: 'Quicksand-Regular' }}>Wishlist </Text>
        <View>
          {isWishlist
            ? <Icon name={'heart'} size={20} color={'#F3251D'} />
            : <Icon name={'heart-outline'} size={20} color={'#F3251D'} />
          }
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => shareLink()} style={{ flexDirection: 'row', paddingTop: 10, opacity: 0.7 }}>
        <Text style={{ fontSize: 12, color: '#757885', paddingLeft: 10, fontFamily: 'Quicksand-Regular' }}> Share </Text>
        <Icon name='share-variant' size={16} color='#757885' />
      </TouchableOpacity>
    </View>
  )
}

export default WithContext(ShareAndWishlist)
