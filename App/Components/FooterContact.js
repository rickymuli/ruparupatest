import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Icon } from 'native-base'

// Styles
import styles from './Styles/FooterStyles'
import { fonts } from '../Styles'

export default class FooterContact extends Component {
  render () {
    return (
      <View style={{ flexDirection: 'column', borderTopWidth: 1, borderColor: '#d8d8d8' }}>
        <Text style={styles.footerContactHeader}>Hubungi Kami</Text>
        <View style={styles.footerContainer}>
          <View style={styles.footerItems}>
            <Icon name='mail' />
            <Text style={styles.textStyle}> help@ruparupa.com</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
          <View style={styles.footerItems}>
            <Icon name='ios-phone-portrait' />
            <Text style={styles.textStyle}> 021 - 582 9191</Text>
          </View>
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerItems}>
            <Icon name='headset' />
            <Text style={styles.textStyle}> Live Chat</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}>Senin - Jumat (kecuali hari libur nasional)</Text>
          </View>
          <View style={styles.footerItems}>
            <Text style={styles.textStyle}> * </Text>
          </View>
        </View>
        <Text style={{ textAlign: 'center', fontSize: 16, fontFamily: fonts.regular }}>Pukul 09:00 - 17:00 WIB</Text>
      </View>
    )
  }
}
