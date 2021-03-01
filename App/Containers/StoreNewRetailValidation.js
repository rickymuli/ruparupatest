import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'

// Components
import { HeaderComponent } from '../Components'

const { height, width } = Dimensions.get('screen')

class StoreNewRetailValidation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      itemData: props?.route?.params?.itemData ?? {},
      isScanned: props?.route?.params?.isScanned ?? false
    }
  }

  render () {
    const { storeNewRetail, user, navigation } = this.props
    const { itemData, isScanned } = this.state

    return (
      <View style={{ height, width }}>
        <HeaderComponent pageName={'Langkah Scan Barcode'} close pageType={'cart-page'} navigation={navigation} />
        <ScrollView style={{ shadowRadius: 2, shadowOffset: { width: 0, height: -3 }, width, shadowColor: '#000000', elevation: 4 }}>
          <View style={styles.stepInformation}>
            <Text style={styles.stepInformationText}>
                Ikuti langkah berikut sebelum melihat informasi produk
            </Text>
          </View>
          {(isEmpty(user.user))
            ? <TouchableOpacity onPress={() => navigation.replace('Homepage', { screen: 'Profil', params: { justLogin: true } })}>
              <View style={styles.stepRequired}>
                <View style={styles.stepRequiredTitle}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}> Masuk / Daftar terlebih dahulu </Text>
                </View>
                <View style={styles.stepRequiredInformation}>
                  <Image style={styles.stepRequiredInformationImage} source={require('../assets/images/ace-new-retail/login-ace-new-retail-guide.webp')} />
                  <Text style={styles.stepRequiredInformationText}>Jika Anda sudah memiliki akun di Ruparupa, silahkan masuk ke akun Anda</Text>
                </View>
                <View style={styles.stepRequiredInformation}>
                  <Image style={styles.stepRequiredInformationImage} source={require('../assets/images/ace-new-retail/daftar-ace-new-retail-guide.webp')} />
                  <Text style={styles.stepRequiredInformationText}>Jika Anda belum memiliki akun di Ruparupa, silahkan daftar terlebih dahulu</Text>
                </View>
                <View style={styles.stepRequiredButton}>
                  <Text style={styles.stepRequiredButtonText}> Masuk atau Daftar </Text>
                </View>
              </View>
            </TouchableOpacity>
            : <View style={styles.stepRequiredDone}>
              <View style={styles.stepRequiredTitle}>
                <Text style={styles.stepNumberDone}>1</Text>
                <Text style={styles.stepText}> Masuk / Daftar terlebih dahulu </Text>
                <Text style={styles.stepIcon}><Icon name={'check'} size={20} /></Text>
              </View>
            </View>
          }
          {(isEmpty(storeNewRetail.data))
            ? (isEmpty(user.user))
              ? <View style={styles.stepLocked}>
                <View style={styles.stepRequiredTitle}>
                  <Text style={styles.stepNumberDone}>2</Text>
                  <Text style={styles.stepText}> Scan kode QR toko </Text>
                </View>
              </View>
              : <TouchableOpacity onPress={() => navigation.replace('ScanQrcode', { params: { fromPDP: { itemData, isScanned } } })}>
                <View style={styles.stepRequired}>
                  <View style={styles.stepRequiredTitle}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepText}> Scan kode QR toko </Text>
                  </View>
                  <View style={styles.stepRequiredInformation}>
                    <Image style={styles.stepRequiredInformationImageAlt} source={require('../assets/images/ace-new-retail/scan-qr-first-guide.webp')} />
                    <Text style={styles.stepRequiredInformationText}>Temukan Kode QR Toko yang tersedia di:{'\n'}- Pintu Masuk{'\n'}- Stiker Lantai{'\n'}-Rak Produk</Text>
                  </View>
                  <View style={styles.stepRequiredInformation}>
                    <Image style={styles.stepRequiredInformationImageAlt} source={require('../assets/images/ace-new-retail/scan-qr-second-guide.webp')} />
                    <Text style={styles.stepRequiredInformationText}>Setelah menemukan kode  QR toko, lakukan scan</Text>
                  </View>
                  <View style={styles.stepRequiredButton}>
                    <Text style={styles.stepRequiredButtonText}> Mulai Scan Kode QR Toko </Text>
                  </View>
                </View>
              </TouchableOpacity>
            : <View style={styles.stepRequiredDone}>
              <View style={styles.stepRequiredTitle}>
                <Text style={styles.stepNumberDone}><Icon name={'check'} size={20} color={'#F3591D'} /></Text>
                <Text style={styles.stepText}> Scan kode QR toko </Text>
              </View>
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = (state) => ({
  storeNewRetail: state.storeNewRetail,
  user: state.auth
})

const dispatchToProps = (dispatch) => ({
})

export default connect(stateToProps, dispatchToProps)(StoreNewRetailValidation)

const styles = StyleSheet.create({
  stepArea: {
    flex: 1,
    backgroundColor: 'white',
    height: '100%',
    fontWeight: '400'
  },
  stepInformation: {
    marginVertical: 10,
    padding: 12
  },
  stepInformationText: {
    paddingHorizontal: 10,
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    textAlign: 'center'
  },
  stepRequired: {
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F0F2F8'
  },
  stepLocked: {
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#F0F2F8',
    backgroundColor: '#F9FAFC'
  },
  stepRequiredDone: {
    marginBottom: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    backgroundColor: '#F0F2F8',
    borderColor: '#F0F2F8'
  },
  stepRequiredTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    height: 60
  },
  stepRequiredButton: {
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F26525',
    textAlign: 'center'
  },
  stepRequiredButtonText: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    color: '#FFFFFF',
    textAlignVertical: 'bottom'
  },
  stepRequiredInformation: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F0F2F8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stepRequiredInformationImage: {
    flex: 1,
    width: width * 0.3,
    height: width * 0.3 * 105 / 148
  },
  stepRequiredInformationImageAlt: {
    flex: 1,
    width: width * 0.3,
    height: width * 0.3
  },
  stepRequiredInformationText: {
    flex: 1,
    padding: 5,
    fontFamily: 'Quicksand-Regular',
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  stepNumber: {
    textAlign: 'center',
    borderRadius: 17.5,
    backgroundColor: '#F3591D',
    width: 35,
    height: 35,
    fontFamily: 'Quicksand-Regular',
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 35
  },
  stepNumberDone: {
    textAlign: 'center',
    borderRadius: 17.5,
    backgroundColor: '#D4DCE6',
    width: 35,
    height: 35,
    fontFamily: 'Quicksand-Regular',
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 35
  },
  stepText: {
    paddingHorizontal: 10,
    fontFamily: 'Quicksand-Regular',
    fontSize: 14
  },
  stepIcon: {
    position: 'absolute',
    right: 10,
    textAlign: 'center',
    width: 35,
    height: 35,
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 35
  }
})
