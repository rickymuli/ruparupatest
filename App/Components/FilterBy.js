import React, { useState, useMemo, useEffect } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import uniq from 'lodash/uniq'
import startCase from 'lodash/startCase'
import { ReplaceArray, UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import ListOfColors from './ListOfColors'
import ListOfLabels from './ListOfLabels'
// Styled
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'

const title = {
  colors: 'Warna',
  brands: 'Brand',
  labels: 'Promo'
}

const FilterBy = ({ filterData = [], setNewData, name, initialSelected = [], key = 0 }) => {
  const [selected, setSelected] = useState(initialSelected)
  const initial = useMemo(() => filterData.map((item) => ({ ...item, isChecked: selected?.includes(item.value_id) })), [filterData])
  const [mod, setMod] = useState(initial)
  const [modal, setModal] = useState(false)
  useEffect(() => {
    const setupData = filterData.map((item) => ({ ...item, isChecked: selected?.includes(item.value_id) }))
    setMod(setupData)
    return () => null
  }, [filterData])

  const Pressed = (index, updateFilterProducts) => {
    setMod(state => (ReplaceArray(state, index, { ...state[index], isChecked: !state[index].isChecked })))
    if (!mod[index].isChecked) setSelected((state = []) => uniq([...state, mod[index].value_id]))
    else {
      let newSelected = selected.filter((o) => o !== mod[index].value_id)
      setSelected(newSelected)
      if (updateFilterProducts) setNewData(state => ({ ...state, [name]: newSelected }))
    }
  }
  const reset = () => {
    setMod((state = []) => (state.map((item) => ({ ...item, isChecked: false }))))
    setSelected([])
  }
  const submit = () => {
    setNewData(state => ({ ...state, [name]: selected }))
    setModal(false)
  }

  useEffect(() => {
    if (isEmpty(initialSelected)) reset()
    return () => null
  }, [initialSelected])

  const renderModal = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name='arrow-left' color='#757885' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title[name]}</Text>
        <TouchableOpacity onPress={reset}>
          <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
        </TouchableOpacity>
      </View>
      {name === 'colors' ? <ListOfColors mod={mod} Pressed={Pressed} /> : <ListOfLabels mod={mod} Pressed={Pressed} />}
      <TouchableOpacity style={styles.buttonApplyCard} onPress={() => submit()}>
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

  return (
    <View key={key} style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
      <TouchableOpacity
        onPress={() => setModal(true)}
        style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 18 }}>{startCase(title[name])}</Text>
        <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Lihat Semua</Text>
      </TouchableOpacity>
      <ScrollView horizontal>
        {mod.map((item, index) => (item.isChecked &&
          <Capsules key={`selected ${index}`}>
            <Text style={{ fontFamily: 'Quicksand-Regular', paddingVertical: 5, paddingHorizontal: 15 }}>{UpperCase(item.value)}</Text>
            <TouchableOpacity onPress={() => Pressed(index, true)}>
              <Icon name='close-circle' size={30} color='#D4DCE6' />
            </TouchableOpacity>
          </Capsules>
        ))}
      </ScrollView>
      <Modal
        transparent={false}
        animationType='slide'
        visible={modal}
        onRequestClose={() => { setModal(false) }}>
        {modal && renderModal()}
      </Modal>
    </View>
  )
}
export default FilterBy

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
