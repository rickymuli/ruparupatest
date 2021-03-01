import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { View, Text, Image, Dimensions, TouchableOpacity, TextInput, Platform, ScrollView } from 'react-native'
import { getUniqueId } from 'react-native-device-info'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import isEmpty from 'lodash/isEmpty'
import lodashGet from 'lodash/get'
import analytics from '@react-native-firebase/analytics'

import { useSelector } from 'react-redux'
import EasyModal from '../Components/EasyModal'
import Lottie from '../Components/LottieComponent'
import Icon from 'react-native-vector-icons/AntDesign'
import useEzFetch from '../Hooks/useEzFetch'
// import useEzFetchPayment from '../Hooks/useEzFetch'
import InAppReview from 'react-native-in-app-review'
import { colors, fonts } from '../Styles'

const { width } = Dimensions.get('screen')
const RatingStore = (props, ref) => {
  const { data: CartData } = useSelector(state => state.cart)
  const uniqId = getUniqueId()
  const { get } = useEzFetch()
  const { post, fetching } = useEzFetch()
  const [star, setStar] = useState(0)
  const [desc, setDesc] = useState('')
  const [customer, setCustomer] = useState({})
  const modal = useRef(null)
  const _handleAnalytic = (data) => {
    const purchaseDataItems = []
    data.items.forEach(item => {
      item.details.forEach(detail => {
        purchaseDataItems.push({
          item_id: detail.sku,
          item_name: detail.name,
          item_brand: detail.brand,
          item_category: detail.category.name,
          price: detail.subtotal,
          quantity: detail.qty_ordered
        })
      })
    })
    let purchaseData = {
      affiliation: data.affiliate_id || '',
      coupon: JSON.stringify(data.gift_cards) || '',
      currency: 'IDR',
      items: purchaseDataItems,
      shipping: data.shipping_amount - data.shipping_discount_amount || 0,
      tax: 0,
      transaction_id: data.reserved_order_no || '',
      value: data.grand_total || 0
    }
    analytics().logEvent('purchase', purchaseData)
    analytics().logEvent('in_app_purchase_custom', purchaseData)
    let paymentData = {
      coupon: JSON.stringify(data.gift_cards) || '',
      currency: 'IDR',
      items: purchaseDataItems,
      payment_type: data.payment.type,
      value: data.total_amount_ordered || 0
    }
    analytics().logEvent('add_payment_info', paymentData)
    let shippingData = {
      currency: 'IDR',
      items: purchaseDataItems,
      shipping_tier: lodashGet(data, 'items[0].shipping.delivery_method', ''),
      value: data.total_amount_ordered || 0
    }
    analytics().logEvent('add_shipping_info', shippingData)
  }
  const checkRating = (props) => {
    if (!CartData || isEmpty(CartData.cart_id)) return null
    get(`cart/${CartData.cart_id}`, null, ({ response }) => {
      analytics().logEvent('rating_check_cart')
      const resData = response.data.data
      _handleAnalytic(resData)
      setCustomer(resData.customer)
      if (resData.cart_rules !== '[]') {
        let data = {
          'uid': uniqId,
          'phone': resData.customer.customer_phone
        }
        analytics().logEvent('rating_check_cart_valid')
        post(`payment/moapp/rating/check`, { data }, null, ({ response, state }) => {
          if (lodashGet(response.data, 'data.need_rating', null)) {
            analytics().logEvent('rating_check_device_valid')
            modal.current.setModal(true)
          } else analytics().logEvent('rating_check_device_notValid')
        })
      }
    })
  }
  const submit = (item) => {
    analytics().logEvent('generate_lead', { currency: 'IDR', value: item })
    let data = {
      'uid': uniqId,
      'customer_id': customer.customer_id,
      'email': customer.customer_email,
      'phone': customer.customer_phone,
      'rating': item || star,
      'description': desc,
      'os': Platform.OS
    }
    analytics().logEvent('rating_submit')
    post(`payment/moapp/rating`, { data }, null, ({ response, state }) => {
      modal.current.setModal(false)
    })
  }
  const submitStar = (item) => {
    setStar(item)
    if (item > 3) {
      modal.current.setModal(false)
      InAppReview.RequestInAppReview()
      if (InAppReview.isAvailable()) {
        analytics().logEvent('rating_store_Available')
        submit(item)
      } else {
        analytics().logEvent('rating_store_notAvailable')
        submit(0)
      }
    }
  }
  useImperativeHandle(ref, () => ({
    checkRating, modal
  }))
  return (
    <EasyModal ref={modal} size={(star > 0 && star <= 3) ? 80 : 70} close>
      <ScrollView>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('../assets/images/feedback-thankyou-page.webp')} style={{ width, height: width * 0.3, marginVertical: 10 }} resizeMode='contain' />
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 24 }}>Hai Ruppers !</Text>
        </View>
        <View style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 15 }}>
          <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 16 }}>Terimakasih sudah menggunakan aplikasi kami!</Text>
          <Text style={{ fontFamily: 'Quicksand-Light', fontSize: 16 }}>{`Yuk tinggalkan feedback, agar kami dapat meningkatkan layanan ruparupa :)`}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 15 }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <TouchableOpacity onPress={() => submitStar(item)} key={item}>
              <Icon name={'star'} color={(item <= star) ? '#FFF043' : '#F0F2F7'} size={40} />
            </TouchableOpacity>
          ))
          }
        </View>
        {(star > 0 && star <= 3) &&
        <TextInput
          style={{ height: 80, borderWidth: 1, borderColor: '#F0F2F7', borderRadius: 5, marginHorizontal: 15, marginTop: 15 }}
          textContentType='addressCityAndState'
          underlineColorAndroid='transparent'
          multiline={Platform.OS !== 'ios'}
          numberOfLines={4}
          placeholder='Apa yang perlu di tingkatkan ? Silahkan masukan feedback di sini.'
          placeholderTextColor='#b2bec3'
          value={desc}
          onChangeText={(e) => setDesc(e)} />
        }
        {(star > 0 && star <= 3) &&
          <TouchableOpacity style={{ alignSelf: 'center', width: '90%', marginTop: 20, backgroundColor: colors.secondary, padding: 5, borderRadius: 5 }}>
            {fetching ? <Lottie simpleLoading inlineText='SUBMIT' customSize={30} />
              : <Text style={{ color: 'white', letterSpacing: 1.5, fontFamily: fonts.medium }}>SUBMIT</Text>}
          </TouchableOpacity>
          // <Button mode='contained' loading={fetching} onPress={() => submit()} labelStyle={{ color: 'white' }} style={{ alignSelf: 'center', width: '90%', marginTop: 20 }}>Submit</Button> rnpaper
        }
      </ScrollView>
    </EasyModal>
  )
}

export default forwardRef(RatingStore)
