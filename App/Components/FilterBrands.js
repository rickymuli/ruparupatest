import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native'
import { UpperCase, ItemFilter } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Checkbox from './Checkbox'

// Styles
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'
import { PrimaryText, LightTertiaryTextMedium, fonts } from '../Styles'

export default class FilterBrands extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      brands: props.brands || [],
      searchBrand: ''
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.brands !== prevState.brands) {
      return {
        brands: nextProps.brands
      }
    }
    return null
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  renderModalBrand = () => {
    const { brands, searchBrand } = this.state
    const filteredBrands = ItemFilter(brands, searchBrand, 'value')
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalFilterHeader}>
          <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Icon name='arrow-left' color='#757885' size={24} onPress={() => this.setModalVisible(false)} />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Brands</Text>
          <TouchableOpacity onPress={() => this.props.resetBrands()}>
            <LightTertiaryTextMedium>Reset</LightTertiaryTextMedium>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
          <TextInput
            style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10 }}
            value={searchBrand}
            onChangeText={(e) => this.setState({ searchBrand: e })}
          />
        </View>
        <ScrollView>
          {filteredBrands.map((brand, index) => (
            <TouchableOpacity onPress={() => this.props.selectedBrand(brand)} key={`brand ${brand.value}${index}`} style={styles.brandView}>
              <Checkbox
                onPress={() => this.props.selectedBrand(brand)}
                selected={brand.isChecked}
              />
              <Text style={{ fontFamily: fonts.medium, fontSize: 16, marginLeft: 15 }}>{UpperCase(brand.value)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.buttonApplyCard} onPress={() => this.setModalVisible(false)}>
          <Text style={styles.btnText}>Simpan</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }
  render () {
    const { brands } = this.state
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <PrimaryText style={{ fontSize: 18 }}>Brands</PrimaryText>
          <Text style={{ fontFamily: fonts.bold, color: '#008CCF' }}>Lihat Semua</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {brands.map((brand, index) => {
            if (!brand.isChecked) {
              return null
            } else {
              return (
                <Capsules key={`selected brands ${index}`}>
                  <Text style={{ fontFamily: fonts.regular, paddingVertical: 5, paddingHorizontal: 15 }}>{brand.value}</Text>
                  <TouchableOpacity onPress={() => this.props.selectedBrand(brand)}>
                    <Icon name='close-circle' size={30} color='#D4DCE6' />
                  </TouchableOpacity>
                </Capsules>
              )
            }
          })}
        </ScrollView>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}>
          {this.renderModalBrand()}
        </Modal>
      </View>
    )
  }
}

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
