import React, { useState, useMemo } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native'
import uniq from 'lodash/uniq'
import { UpperCase, ItemFilter, ReplaceArray } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Checkbox from './Checkbox'

// Styles
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'
import { PrimaryText, LightTertiaryTextMedium, fonts } from '../Styles'

const FilterByBrands = (props) => {
  const { filterData, setNewData, brands } = props
  const [selected, setSelected] = useState(brands)
  const initialBrands = useMemo(() => filterData.map((item) => ({ ...item, isChecked: selected.includes(item.value_id) })), [filterData])
  const [modBrand, setModBrand] = useState(initialBrands)
  const [searchBrand, setSearchBrand] = useState('')
  const [modal, setModal] = useState(false)
  const filteredBrands = useMemo(() => ItemFilter(modBrand, searchBrand, 'value'), [searchBrand, modBrand])

  const brandPressed = (index) => {
    setModBrand(state => (ReplaceArray(state, index, { ...state[index], isChecked: !state[index].isChecked })))
    if (!modBrand[index].isChecked) setSelected((state = []) => uniq([...state, modBrand[index].value_id]))
    else setSelected((state = []) => state.filter((o) => o !== modBrand[index].value_id))
  }
  const submit = () => {
    setNewData(state => ({ ...state, brands: selected }))
    setModal(false)
  }

  const renderModalBrands = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name='arrow-left' color='#757885' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Brands</Text>
        <TouchableOpacity onPress={() => setModBrand((state) => ({ ...state, isChecked: false }))}>
          <LightTertiaryTextMedium>Reset</LightTertiaryTextMedium>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
        <TextInput
          style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10 }}
          value={searchBrand}
          onChangeText={(e) => setSearchBrand(e)}
        />
      </View>
      <ScrollView>
        {filteredBrands.map((brand, index) => (
          <TouchableOpacity onPress={() => brandPressed(index)} key={`brand ${brand.value}${index}`} style={styles.brandView}>
            <Checkbox
              onPress={() => brandPressed(index)}
              selected={brand.isChecked}
            />
            <Text style={{ fontFamily: fonts.medium, fontSize: 16, marginLeft: 15 }}>{UpperCase(brand.value)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.buttonApplyCard} onPress={() => submit()}>
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
    </SafeAreaView>)

  return (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
      <TouchableOpacity
        onPress={() => setModal(true)}
        style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <PrimaryText style={{ fontSize: 18 }}>Brand</PrimaryText>
        <Text style={{ fontFamily: fonts.bold, color: '#008CCF' }}>Lihat Semua</Text>
      </TouchableOpacity>
      <ScrollView horizontal>
        {modBrand.map((brand, index) => (brand.isChecked &&
        <Capsules key={`selected brands ${index}`}>
          <Text style={{ fontFamily: fonts.regular, paddingVertical: 5, paddingHorizontal: 15 }}>{brand.value}</Text>
          <TouchableOpacity onPress={() => brandPressed(index)}>
            <Icon name='close-circle' size={30} color='#D4DCE6' />
          </TouchableOpacity>
        </Capsules>
        ))}
      </ScrollView>
      <Modal
        animationType='slide'
        visible={modal}
        onRequestClose={() => { setModal(false) }}>
        {renderModalBrands()}
      </Modal>
    </View>
  )
}

export default FilterByBrands

const Capsules = styled.View`
  border-width: 1;
  border-color: #D4DCE6;
  borderRadius: 50;
  margin-top: 10;
  margin-right: 5;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
