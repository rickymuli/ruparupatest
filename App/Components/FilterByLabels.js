import React, { useState, useMemo } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { UpperCase, ItemFilter, ReplaceArray } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import uniq from 'lodash/uniq'
import Checkbox from './Checkbox'

// Styles
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'

const FilterByLabels = (props) => {
  const { filterData, setNewData, labels } = props
  const [selected, setSelected] = useState(labels)
  const initialLabels = useMemo(() => filterData.map((item) => ({ ...item, isChecked: selected.includes(item.value_id) })), [filterData])
  const [modLabels, setModLabels] = useState(initialLabels)
  const [searchLabel, setSearchLabel] = useState('')
  const [modal, setModal] = useState(false)
  const filteredLabels = useMemo(() => ItemFilter(modLabels, searchLabel, 'value'), [searchLabel, modLabels])

  const labelPressed = (index) => {
    setModLabels(state => (ReplaceArray(state, index, { ...state[index], isChecked: !state[index].isChecked })))
    if (!modLabels[index].isChecked) setSelected((state = []) => uniq([...state, modLabels[index].value_id]))
    else setSelected((state = []) => state.filter((o) => o !== modLabels[index].value_id))
  }

  const submit = () => {
    setNewData(state => ({ ...state, labels: selected }))
    setModal(false)
  }

  const renderModalLabels = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name='arrow-left' color='#757885' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Labels</Text>
        <TouchableOpacity onPress={() => setModLabels((state) => ({ ...state, isChecked: false }))}>
          <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
        <TextInput
          style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10 }}
          value={searchLabel}
          onChangeText={(e) => setSearchLabel(e)}
        />
      </View>
      <ScrollView>
        {(filteredLabels).map((label, index) => (
          <TouchableOpacity onPress={() => labelPressed(index)} key={`label ${label.value}${index}`} style={styles.brandView}>
            <Checkbox
              onPress={() => labelPressed(index)}
              selected={label.isChecked}
            />
            <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16, marginLeft: 15 }}>{UpperCase(label.value)}</Text>
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
        <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 18 }}>Promo</Text>
        <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Lihat Semua</Text>
      </TouchableOpacity>
      <ScrollView horizontal>
        {modLabels.map((label, index) => (label.isChecked &&
          <Capsules key={`selected labels ${index}`}>
            <Text style={{ fontFamily: 'Quicksand-Regular', paddingVertical: 5, paddingHorizontal: 15 }}>{label.value}</Text>
            <TouchableOpacity onPress={() => labelPressed(index)}>
              <Icon name='close-circle' size={30} color='#D4DCE6' />
            </TouchableOpacity>
          </Capsules>
        ))}
      </ScrollView>
      <Modal
        animationType='slide'
        visible={modal}
        onRequestClose={() => { setModal(false) }}>
        {renderModalLabels()}
      </Modal>
    </View>
  )
}

export default FilterByLabels

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
