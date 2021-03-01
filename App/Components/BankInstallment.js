import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Modal, ScrollView, Image, SafeAreaView } from 'react-native'
import { NumberWithCommas } from '../Utils/Misc'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PrimaryText, TertiaryTextMedium, fonts, colors } from '../Styles'

import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

// Model
import BankImage from '../Model/BankImage'

// Redux
import MiscActions from '../Redux/MiscRedux'

// Components
import Loading from './LoadingComponent'

// Styles
import styles from './Styles/BankInstallmentStyles'
import styled from 'styled-components'

class BankInstallment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bankInstallment: props.bankInstallment,
      selectedIndex: 0,
      modalVisible: false,
      price: props.price
    }
  }

  componentDidMount () {
    const { bankInstallment, fetchBankInstallment } = this.props
    !bankInstallment && fetchBankInstallment()
  }

  changeSelectedIndex = (index) => {
    this.setState({ selectedIndex: index, modalVisible: false })
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.bankInstallment, prevState.bankInstallment)) {
      return {
        bankInstallment: nextProps.bankInstallment
      }
    }
    return null
  }

  renderModal = () => {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ModalHeader>
          <Icon name='close-circle' size={24} color='white' />
          <TextModal>Pilih Simulasi Bank</TextModal>
          <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => this.setModalVisible(false)} />
        </ModalHeader>
        <ScrollView>
          {this.state.bankInstallment.map((bankDetail, index) => (
            <TouchableOpacity onPress={() => this.changeSelectedIndex(index)} key={`bankInstallment list ${bankDetail.bank_logo}${index}`}>
              <View style={styles.list}>
                <Image source={BankImage(bankDetail.bank_name)} style={styles.bankIcon} />
                <PrimaryText>{bankDetail.bank_name}</PrimaryText>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    )
  }

  renderTenor = (tenor) => {
    const price = this.state.price
    let actualPrice = ''
    if (tenor && tenor.tenor_length) {
      actualPrice = `Rp ` + NumberWithCommas(parseFloat(price) / parseFloat(tenor.tenor_length))
    }
    return <PrimaryText>{tenor.text} - {actualPrice} / bulan</PrimaryText>
  }

  renderInstallment = () => {
    let selectedBank = this.state.bankInstallment[this.state.selectedIndex]
    return (
      <View>
        {selectedBank.tenor.map((installmentDetail, index) => (
          <View style={{ justifyContent: 'center', marginBottom: 5 }} key={`listInstallments ${installmentDetail.text}${index}`}>
            { this.renderTenor(installmentDetail) }
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => this.setModalVisible(true)}>
          <Image source={BankImage(selectedBank.bank_name)} style={styles.bankIcon} />
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Icon
              name='pencil'
              color='#008ED1'
              size={16}
            />
            <TertiaryTextMedium style={{ fontSize: 12 }}> Ubah</TertiaryTextMedium>
          </View>
        </TouchableOpacity>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}
        >
          {this.renderModal()}
        </Modal>
      </View>
    )
  }

  setModalVisible (visible) {
    this.setState({ modalVisible: visible })
  }

  render () {
    const { bankInstallment } = this.state
    if (isEmpty(bankInstallment)) {
      return (
        <Loading />
      )
    } else {
      return (
        <View style={styles.productInfoBoard}>
          <Text style={styles.title}>Cicilan 0%</Text>
          { this.renderInstallment() }
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  bankInstallment: state.misc.bankInstallment
})

const mapDispatchToProps = (dispatch) => ({
  fetchBankInstallment: () => dispatch(MiscActions.miscBankInstallmentRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(BankInstallment)

const ModalHeader = styled.View`
flex-direction:row;
justify-content:space-between;
width: 100%;
border-bottom-width: 1px;
border-bottom-color: #D4DCE6;
padding: 15px;
`

const TextModal = styled.Text`
text-align:center;
flex-grow:1;
font-size:16px;
color: ${colors.primary};
font-family:${fonts.bold};
`
