import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native'
import Checkbox from './Checkbox'

import { UpperCase, ItemFilter } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Styles
import styles from './Styles/FilterAndSortStyles'
import styled from 'styled-components'

export default class FilterLabel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      labels: props.labels || [],
      searchLabel: ''
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let returnObj = {}
    if (nextProps.labels !== prevState.labels) {
      returnObj = {
        labels: nextProps.labels
      }
    }
    return returnObj
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  renderModalLabel = () => {
    const { labels, searchLabel } = this.state
    let filteredLabels = ItemFilter(labels, searchLabel, 'value')
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.modalFilterHeader}>
          <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            <Icon name='arrow-left' color='#757885' size={24} onPress={() => this.setModalVisible(false)} />
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Promo</Text>
          <TouchableOpacity onPress={() => this.props.resetLabels()}>
            <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={{ padding: 10, backgroundColor: '#E5E9F2' }}>
          <TextInput
            style={{ height: 50, backgroundColor: 'white', paddingHorizontal: 10 }}
            value={searchLabel}
            onChangeText={(e) => this.setState({ searchLabel: e })} />
        </View>
        <ScrollView>
          {filteredLabels.map((label, index) => (
            <TouchableOpacity onPress={() => this.props.selectedLabel(label)} key={`label ${label.value}${index}`} style={styles.brandView}>
              <Checkbox
                onPress={() => this.props.selectedLabel(label)}
                selected={label.isChecked}
              />
              <Text style={{ fontFamily: 'Quicksand-Medium', fontSize: 16, marginLeft: 15 }}>{UpperCase(label.value)}</Text>
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
    const { labels } = this.state
    return (
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#D4DCE6', flexDirection: 'column' }}>
        <TouchableOpacity
          onPress={() => this.setModalVisible(true)}
          style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', fontSize: 18 }}>Promo</Text>
          <Text style={{ fontFamily: 'Quicksand-Bold', color: '#008CCF' }}>Lihat Semua</Text>
        </TouchableOpacity>
        <ScrollView horizontal>
          {labels.map((label, index) => {
            if (!label.isChecked) {
              return null
            } else {
              return (
                <Capsules key={`selected labels ${index}`}>
                  <Text style={{ fontFamily: 'Quicksand-Regular', paddingVertical: 5, paddingHorizontal: 15 }}>{label.value}</Text>
                  <TouchableOpacity onPress={() => this.props.selectedLabel(label)}>
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
          {this.renderModalLabel()}
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
