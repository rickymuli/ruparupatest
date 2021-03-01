import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import analytics from '@react-native-firebase/analytics'
import find from 'lodash/find'
import { Navigate } from '../Services/NavigationService'

// Styles
import { WishlistView } from '../Styles/StyledComponents'

// redux
import { useDispatch, useSelector } from 'react-redux'
import UserActions from '../Redux/UserRedux'

const ButtonWishlist = (props) => {
  const { itemData, sku, wishlistButtonPressed } = props
  const dispatch = useDispatch()
  const [isWishlist, setIsWishlist] = useState(false)

  const { wishlist } = useSelector(state => state.user)
  const { user } = useSelector(state => state.auth)

  const updateWishlist = (data) => dispatch(UserActions.userToggleWishlistRequest(data))

  useEffect(() => {
    if (wishlist && wishlist.hasOwnProperty('items') && Array.isArray(wishlist.items)) {
      let found = find(wishlist.items, ['variants[0].sku', sku])
      setIsWishlist(found)
    } else setIsWishlist(false)
  }, [wishlist])

  const toggleWishlist = () => {
    if (!user) return Navigate('Profil', { fromPDP: itemData })
    let method = 'add'
    let message = 'Berhasil menambah ke wishlist'
    let analyticTitle = 'add_to_wishlist'
    if (isWishlist) {
      method = 'delete'
      message = 'Berhasil menghapus ke wishlist'
      analyticTitle = 'remove_wishlist'
    }
    // let analyticsData = {
    //   item_id: sku,
    //   sku: sku,
    //   email: user.email,
    //   gender: user.gender
    // }
    let analyticsData = {
      // currency: 'IDR',
      // value: 0,
      items: [{
        item_id: sku
        // item_name: detail.name,
        // item_brand: detail.brand,
        // item_category: detail.category.name,
        // price: detail.subtotal,
        // quantity: detail.qty_ordered
      }]
    }
    !isWishlist && analytics().logEvent(analyticTitle, analyticsData)
    setIsWishlist(!isWishlist)
    updateWishlist({ method, sku })
    wishlistButtonPressed(message)
  }

  return (
    <WishlistView onPress={() => toggleWishlist()} hitSlop={{ bottom: 20, top: 20, left: 50, right: 50 }}>
      {isWishlist
        ? <Icon name={'heart'} size={20} color={'#F3251D'} />
        : <Icon name={'heart-outline'} size={20} color={'#F3251D'} />
      }
    </WishlistView>
  )
}

export default ButtonWishlist
