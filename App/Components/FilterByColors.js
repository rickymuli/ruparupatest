import React, { useState, useMemo } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView } from 'react-native'
import uniq from 'lodash/uniq'
import { UpperCase, ReplaceArray } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { colorImage } from '../Model/ColorImage'
import Checkbox from './Checkbox'

// Styled
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'
const FilterByColors = (props) => {
  const { filterData, setNewData, colors } = props
  const [selected, setSelected] = useState(colors)
  const initialColors = useMemo(() => filterData.map((item) => ({ ...item, isChecked: selected.includes(item.value_id) })), [filterData])
  const [modColor, setModColor] = useState(initialColors)
  const [modal, setModal] = useState(false)
  const colorPressed = (index) => {
    setModColor(state => (ReplaceArray(state, index, { ...state[index], isChecked: !state[index].isChecked })))
    if (!modColor[index].isChecked) setSelected((state = []) => uniq([...state, modColor[index].value_id]))
    else setSelected((state = []) => state.filter((o) => o !== modColor[index].value_id))
  }
  const submit = () => {
    setNewData(state => ({ ...state, colors: selected }))
    setModal(false)
  }

  const renderColorItem = (color) => {
    let imageSource = colorImage[color.value]
    return (
      <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
        {(!imageSource) ? <ColorSample backgroundColor={color.extra_information} />
          : <View style={{ borderRadius: 100 / 2, marginHorizontal: 20 }}>
            <ImageBackground imageStyle={{ borderRadius: 50 }} source={imageSource} style={{ height: 35, width: 35, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }} />
          </View>
        }
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16 }}>{UpperCase(color.value)}</Text>
      </SafeAreaView>
    )
  }

  const renderModalColors = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name='arrow-left' color='#757885' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Warna</Text>
        <TouchableOpacity onPress={() => setModColor((state) => ({ ...state, isChecked: false }))}>
          <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {modColor.map((color, index) => (
          <TouchableOpacity onPress={() => colorPressed(index)} key={`colors${color.value}${index}`} style={styles.colorView}>
            {renderColorItem(color)}
            <Checkbox
              onPress={() => colorPressed(index)}
              selected={color.isChecked}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.buttonApplyCard} onPress={() => submit()}>
        <Text style={styles.btnText}>Simpan</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )

  return (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
      <TouchableOpacity
        onPress={() => setModal(true)}
        style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
        <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 18 }}>Warna</Text>
        <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Lihat Semua</Text>
      </TouchableOpacity>
      <ScrollView horizontal>
        {modColor.map((color, index) => (color.isChecked &&
        <Capsules key={`selected colors ${index}`}>
          <Text style={{ fontFamily: 'Quicksand-Regular', paddingVertical: 5, paddingHorizontal: 15 }}>{color.value}</Text>
          <TouchableOpacity onPress={() => colorPressed(index)}>
            <Icon name='close-circle' size={30} color='#D4DCE6' />
          </TouchableOpacity>
        </Capsules>
        ))}
      </ScrollView>
      <Modal
        animationType='slide'
        visible={modal}
        onRequestClose={() => { setModal(false) }}>
        {renderModalColors()}
      </Modal>
    </View>
  )
}

export default FilterByColors

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

const ColorSample = styled.View`
    backgroundColor: ${props => props.backgroundColor};
    width: 35;
    height: 35;
    borderRadius: 50;
    borderWidth: 1;
    borderColor: #E5E9F2;
    justifyContent: center;
    alignItems: center;
    paddingLeft: 12;
    paddingRight: 12;
    marginHorizontal: 20;
`
