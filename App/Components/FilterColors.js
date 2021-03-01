import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, ImageBackground, SafeAreaView } from 'react-native'
import { UpperCase } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Checkbox from './Checkbox'

// Styled
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'

export default class FilterColors extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      colors: props.colors
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.colors !== prevState.colors) {
      return {
        colors: nextProps.colors
      }
    }
    return null
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  renderColorItem = (color) => {
    let imageSource
    switch (color.value) {
      case 'Lainnya':
        imageSource = require('../assets/images/others-color.webp')
        break
      case 'Mix':
        imageSource = require('../assets/images/mixed-color.webp')
        break
      case 'Transparan':
        imageSource = require('../assets/images/transparant-color.webp')
        break
      default:
        break
    }
    return (
      <SafeAreaView style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, justifyContent: 'center' }}>
        {(imageSource)
          ? <View style={{
            borderRadius: 100 / 2,
            marginHorizontal: 20
          }}>
            <ImageBackground
              style={{ height: 35, width: 35, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
              imageStyle={{ borderRadius: 50 }}
              source={imageSource} />
          </View>
          : <View
            style={{
              backgroundColor: color.extra_information,
              width: 35,
              height: 35,
              borderRadius: 100 / 2,
              borderWidth: 1,
              borderColor: '#E5E9F2',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 12,
              paddingRight: 12,
              marginHorizontal: 20
            }}
          />
        }
        <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16 }}>{UpperCase(color.value)}</Text>
      </SafeAreaView>
    )
  }

  renderModalColors = () => {
    const { colors } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalFilterHeader}>
          <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Icon name='arrow-left' color='#757885' size={24} onPress={() => this.setModalVisible(false)} />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Warna</Text>
          <TouchableOpacity onPress={() => this.props.resetColors()}>
            <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          {colors.map((color, index) => (
            <TouchableOpacity onPress={() => this.props.colorPressed(index)} key={`colors${color.value}${index}`} style={styles.colorView}>
              {this.renderColorItem(color)}
              <Checkbox
                onPress={() => this.props.colorPressed(index)}
                selected={color.isChecked}
              />
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
    const { colors } = this.state
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 18 }}>Warna</Text>
          <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Lihat Semua</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {colors.map((color, index) => {
            if (!color.isChecked) {
              return null
            } else {
              return (
                <Capsules key={`selected colors ${index}`}>
                  <Text style={{ fontFamily: 'Quicksand-Regular', paddingVertical: 5, paddingHorizontal: 15 }}>{color.value}</Text>
                  <TouchableOpacity onPress={() => this.props.colorPressed(index)}>
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
          {this.renderModalColors()}
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
