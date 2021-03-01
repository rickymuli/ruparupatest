import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { View, Text } from 'react-native'
import { NumberWithCommas, NumberFormat } from '../Utils/Misc'
import { FormS, Input } from '../Styles/StyledComponents'

// Styles
import styles from './Styles/FilterAndSortStyles'
const FilterByPrice = ({ min = '', max = '' }, ref) => {
  const [minPrice, setMinPrice] = useState(min)
  const [maxPrice, setMaxPrice] = useState(max)
  const invalidPrice = Number(maxPrice) > 0 && Number(maxPrice) < Number(minPrice)
  const reset = () => {
    setMinPrice('')
    setMaxPrice('')
  }
  useImperativeHandle(ref, () => ({ minPrice, maxPrice, invalidPrice, reset }))
  return (
    <View style={styles.cardContent}>
      <Text style={styles.cardHeader}>Harga</Text>
      {invalidPrice &&
        <Text style={{ fontFamily: 'Quicksand-Regular', color: 'red' }}>Harga maximum tidak boleh lebih rendah dari harga minimum</Text>}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <FormS style={{ flexDirection: 'row', width: '45%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E9F2', padding: 6, height: 40 }}>
          <Text style={{ marginRight: 5, fontFamily: 'Quicksand-Regular', color: '#757886' }}> Rp </Text>
          <Input
            placeholder='minimum'
            placeholderTextColor='#b2bec3'
            color='#757886'
            underlineColorAndroid='transparent'
            selectionColor='rgba(242, 101, 37, 1)'
            value={NumberWithCommas(minPrice)}
            onChangeText={(e) => setMinPrice(NumberFormat(e))}
            returnKeyType='done'
            keyboardType='numeric'
          />
        </FormS>
        <FormS style={{ flexDirection: 'row', width: '45%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E9F2', padding: 6, height: 40 }}>
          <Text style={{ marginRight: 5, fontFamily: 'Quicksand-Regular', color: '#757886' }}> Rp </Text>
          <Input
            placeholder='maximum'
            placeholderTextColor='#b2bec3'
            color='#757886'
            selectionColor='rgba(242, 101, 37, 1)'
            underlineColorAndroid='transparent'
            value={NumberWithCommas(maxPrice)}
            onChangeText={(e) => setMaxPrice(NumberFormat(e))}
            returnKeyType='done'
            keyboardType='numeric'
          />
        </FormS>
      </View>
    </View>
  )
}

export default forwardRef(FilterByPrice)
