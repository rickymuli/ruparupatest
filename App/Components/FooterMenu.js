import React, { Component } from 'react'
import { Text, View } from 'react-native'

// Styles
import styles from './Styles/FooterStyles'

export default class FooterMenu extends Component {
  render () {
    return (
      <View style={{ flexDirection: 'column', margin: '3%' }}>
        <View style={styles.footerContainer}>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Cara Belanja</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Pembayaran</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Pendaftaran Seller</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Pengembalian</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Pengiriman & Pengembalian Barang</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>FAQ</Text>
          </View>
        </View>
      </View>
    )
  }
}
