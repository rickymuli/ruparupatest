import React, { useState } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Styled
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'
import { PrimaryText, LightTertiaryTextMedium, TertiaryTextBold } from '../Styles'

const title = {
  colors: 'Warna',
  brands: 'Brand',
  labels: 'Promo'
}

const AlgoliaFilterBy = ({ name, algolia, setAlgolia, Pressed, children }) => {
  const [modal, setModal] = useState(false)

  const reset = () => {
    setAlgolia({ ...algolia, [name]: [] })
  }
  const submit = () => {
    setModal(false)
  }

  const renderModal = () => (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <Icon name='arrow-left' color='#757885' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
        <Text style={styles.cardTitle}>{title[name]}</Text>
        <TouchableOpacity onPress={reset}>
          <LightTertiaryTextMedium>Reset</LightTertiaryTextMedium>
        </TouchableOpacity>
      </View>
      {children}
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
        <PrimaryText style={{ fontSize: 18 }}>{title[name]}</PrimaryText>
        <TertiaryTextBold>Lihat Semua</TertiaryTextBold>
      </TouchableOpacity>
      <ScrollView horizontal>
        {algolia[name].map((item, index) => (
          <Capsules key={`selected ${index}`}>
            <PrimaryText style={{ paddingVertical: 5, paddingHorizontal: 15 }}>{UpperCase(item.label)}</PrimaryText>
            <TouchableOpacity onPress={() => Pressed(name, item)}>
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
        {renderModal()}
      </Modal>
    </View>
  )
}
export default AlgoliaFilterBy

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
