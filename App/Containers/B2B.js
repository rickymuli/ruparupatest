import React, { Component } from 'react'
import { View, ScrollView, Text, Dimensions, TouchableOpacity, TextInput, Image } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import Toast, { DURATION } from 'react-native-easy-toast'

// Redux
import EmailActions from '../Redux/EmailRedux'
import OfflineActions from '../Redux/OfflineRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
// import ChatButton from '../Components/ChatButton'
import Offline from '../Components/OfflinePage'

// Styles
import styles from './Styles/B2BStyles'

class B2B extends Component {
  // Removing Header
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      emailData: props.emailData || null,
      email: '',
      name: '',
      message: '',
      phone: '',
      viewHeight: 0,
      contentHeight: 0
    }
  }

  componentDidMount () {
    this.props.offlineCheckRequest()
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(nextProps.emailData, prevState.emailData)) {
      return {
        emailData: nextProps.emailData
      }
    }
  }

  componentDidUpdate () {
    const { emailData } = this.state
    if (!isEmpty(emailData.payload) && !emailData.fetching) {
      this.refs.toast.show('Terima kasih, email Anda telah kami terima', DURATION.LENGTH_SHORT)
      this.setState({ emailData: null })
    }
  }

  sendEmail () {
    const { email, name, message, phone } = this.state
    let data = {
      email,
      name,
      phone,
      message
    }
    this.props.emailB2bRequest(data)
  }

  scrollToBottom (animated = true) {
    const { viewHeight, contentHeight } = this.state
    const scrollHeight = contentHeight - viewHeight
    const scrollResponder = this.refs.scrollView.getScrollResponder()
    scrollResponder.scrollResponderScrollTo({ x: 0, y: scrollHeight, animated })
  }

  render () {
    const { height, width } = Dimensions.get('screen')
    const { emailData, email, name, phone, message } = this.state
    const { offline } = this.props
    if (offline.status) {
      return (
        <Offline />
      )
    } else {
      return (
        <View style={styles.container}>
          <HeaderSearchComponent navigation={this.props.navigation} />
          <ScrollView
            ref='scrollView'
            style={styles.content}
            onContentSizeChange={(w, h) => this.setState({ contentHeight: h })}
            onLayout={ev => this.setState({ viewHeight: ev.nativeEvent.layout.height })}
          >
            <View style={styles.card}>
              <Text style={styles.header}>Solusi Bisnis dan Usaha</Text>
              <Text style={[styles.italic, styles.normal]}>We Design, Furnished and Complete Your Business' Needs</Text>
              <Text style={styles.normal}>Ruparupa.com menyajikan kemudahan dan beragam pilihan untuk memenuhi kebutuhan bisnis maupun usaha Anda dalam segala aspek. Kami menawarkan rangkaian pilihan produk berkualitas serta layanan desain interior oleh tenaga ahli untuk beragam lini bisnis yang Anda miliki. Dengan proses mudah dan harga yang bersaing.</Text>
              <Image source={require('../assets/images/b2b/b2b-mobile.webp')} style={{ height: height * 0.4, width: width * 0.8 }} />
              <TouchableOpacity onPress={() => this.scrollToBottom()} style={styles.buttonOutline}>
                <Text style={styles.buttonTextOutline}>Hubungi Kami</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Mengapa memilih Ruparupa?</Text>
              <Image source={require('../assets/images/b2b/b2b-info-mobile.webp')} style={{ height: height * 1.8, width: width * 0.85 }} />
            </View>
            <View style={styles.card}>
              <Text style={styles.header}>Dapatkan quote dari kami, Hubungi Kami</Text>
              {(emailData.err !== null)
                ? <Text style={styles.errorMessage}>{emailData.err}</Text>
                : null
              }
              {(emailData.success)
                ? <View style={styles.infoCard}>
                  <Text style={styles.infoText}>Terima kasih telah menghubungi kami. Staff Kami akan segera menghubungi Anda</Text>
                </View>
                : null
              }
              <View style={styles.textInputView}>
                <TextInput underlineColorAndroid='transparent' keyboardType='email-address' value={email} onChangeText={(email) => this.setState({ email })} placeholderTextColor='#b2bec3' placeholder='Email Anda' />
              </View>
              <View style={styles.textInputView}>
                <TextInput underlineColorAndroid='transparent' keyboardType='default' value={name} onChangeText={(name) => this.setState({ name })} placeholderTextColor='#b2bec3' placeholder='Nama Anda' />
              </View>
              <View style={styles.textInputView}>
                <TextInput underlineColorAndroid='transparent' keyboardType='phone-pad' value={phone} onChangeText={(phone) => this.setState({ phone })} placeholderTextColor='#b2bec3' placeholder='Telepon Anda' />
              </View>
              <View style={styles.textInputView}>
                <TextInput
                  underlineColorAndroid='transparent'
                  keyboardType='default'
                  value={message}
                  onChangeText={(message) => this.setState({ message })}
                  placeholderTextColor='#b2bec3'
                  placeholder='Pesan'
                  multiline
                  numberOfLines={4}
                />
              </View>
              {(emailData.fetching)
                ? <View style={styles.button}>
                  <Text style={styles.buttonText}>Sedang Memproses ...</Text>
                </View>
                : <TouchableOpacity onPress={() => this.sendEmail()} style={styles.button}>
                  <Text style={styles.buttonText}>Hubungi Kami</Text>
                </TouchableOpacity>
              }
            </View>
          </ScrollView>
          {/* <ChatButton /> */}
          <Toast
            ref='toast'
            style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
            position='top'
            positionValue={0}
            fadeInDuration={750}
            fadeOutDuration={1500}
            opacity={1}
            textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
          />
        </View>
      )
    }
  }
}

const mapStateToProps = (state) => ({
  emailData: state.email,
  offline: state.offline
})

const mapDispatchToProps = (dispatch) => ({
  emailB2bRequest: (data) => dispatch(EmailActions.emailB2bRequest(data)),
  offlineCheckRequest: () => dispatch(OfflineActions.offlineCheckRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(B2B)
