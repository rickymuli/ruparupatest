import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import styled from 'styled-components'
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import Lottie from '../Components/LottieComponent'

// Redux
import AddressActions from '../Redux/AddressRedux'

// Styles
import styles from './Styles/AddressStyles'

// Components
// import ChatButton from '../Components/ChatButton'

class AddressPage extends Component {
  static navigationOptions = {
    header: null
  }

  constructor (props) {
    super(props)
    this.state = {
      fetching: true,
      address: props.address,
      action: '',
      addressData: [],
      addressId: 0,
      submitPrimary: false,
      deleteAddress: false
    }
  }

  componentWillReceiveProps (newProps) {
    const { address } = newProps
    this.setState({ address })
    if (!address.fetching && this.state.submitPrimary) {
      this.refs.toast.show(`Berhasil mengubah alamat utama`)
      this.setState({ submitPrimary: false })
    }

    if (!address.fetching && this.state.deleteAddress) {
      this.refs.toast.show('Berhasil menghapus alamat')
      this.setState({ deleteAddress: false })
      this.props.getAddress()
    }
  }

  changePrimaryAddress = (addressId) => {
    this.props.primaryRequest({
      address_id: addressId
    })
    this.setState({ submitPrimary: true, addressId })
  }

  deleteAddress = (addressId) => {
    this.props.deleteAddress({
      address_id: addressId
    })
    this.setState({ deleteAddress: true, addressId })
  }

  componentDidMount () {
    this.props.getAddress()
  }

  renderAddressList = (address, index) => {
    let addressStyle = {
      paddingLeft: 25,
      paddingRight: 25,
      marginLeft: -25,
      marginRight: -25,
      flexDirection: 'column'
    }
    if (address.is_default === '1') {
      addressStyle.backgroundColor = '#E5F7FF'
    }
    return (
      <View style={addressStyle} key={`address ${index}`}>
        <View style={{ flexDirection: 'column', paddingTop: 15, paddingBottom: 15 }}>
          <Text style={{ color: '#757886', fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Nama Penerima</Text>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.first_name.charAt(0).toUpperCase() + address.first_name.slice(1) + ' '}{(address.last_name) ? address.last_name : ''}</Text>
        </View>
        <View style={{ flexDirection: 'column', paddingTop: 15, paddingBottom: 15 }}>
          <Text style={{ color: '#757886', fontSize: 14, fontFamily: 'Quicksand-Bold' }}>Alamat Pengiriman</Text>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.full_address}</Text>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.kecamatan.kecamatan_name.charAt(0).toUpperCase() + address.kecamatan.kecamatan_name.toLowerCase().slice(1)},{' ' + address.city.city_name.charAt(0).toUpperCase() + address.city.city_name.toLowerCase().slice(1)}</Text>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.province.province_name} {address.post_code}</Text>
        </View>
        <View style={{ flexDirection: 'column', paddingTop: 15, paddingBottom: 15 }}>
          <Text style={{ color: '#757886', fontSize: 14, fontFamily: 'Quicksand-Bold' }}>No Telepon</Text>
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.phone}</Text>
        </View>
        <View style={{ paddingTop: 15, paddingBottom: 15 }}>
          {(address.is_default === '1')
            ? <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, color: '#757886', fontFamily: 'Quicksand-Regular' }}><Icon name='check' size={20} /> Alamat Utama</Text>
            </View>
            : <TouchableOpacity onPress={() => this.changePrimaryAddress(address.address_id)} style={{ borderWidth: 1, borderColor: '#008CCF', paddingTop: 10, paddingBottom: 10, borderRadius: 3 }}>
              <Text style={{ fontSize: 12, color: '#008CCF', textAlign: 'center', fontFamily: 'Quicksand-Bold' }}>Jadikan Alamat Utama</Text>
            </TouchableOpacity>
          }
          <View style={{ marginTop: 20, justifyContent: 'space-around', flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('AddEditAddressPage', { data: { action: 'Ubah', address: address } })}>
              <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Regular' }}><Icon name='pencil' /> Ubah</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.deleteAddress(address.address_id)}>
              <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Regular' }}><Icon name='delete' /> Hapus</Text>
            </TouchableOpacity>
          </View>
          {(address.is_default !== '1')
            ? <MarginTopXS>
              <HrFull />
            </MarginTopXS>
            : null}
        </View>
      </View>
    )
  }

  render () {
    const { address, submitPrimary, deleteAddress } = this.state
    const ratio = (Dimensions.get('window').width * 0.7) / 978
    return (
      <Container>
        <HeaderSearchComponent pageName={'Alamat Saya'} close navigation={this.props.navigation} />
        {(submitPrimary || deleteAddress)
          ? <Lottie />
          : <>
            {(address.data && address.data.length > 0)
              ? <ScrollView>
                <View style={styles.contentContainer}>
                  {address.data.map((data, index) => {
                    return this.renderAddressList(data, index)
                  })}
                </View>
              </ScrollView>
              : <CenterImage>
                <Image source={require('../assets/images/alamat-kosong.webp')} style={{ width: Dimensions.get('window').width * 0.7, height: ratio * 794 }} />
                <View style={{ width: Dimensions.get('window').width * 0.8, marginTop: 20, backgroundColor: '#E5E9F2', borderRadius: 50, padding: 20 }}>
                  <Text style={{ fontFamily: 'Quicksand-Medium', textAlign: 'center' }}>Belum ada alamat terdaftar.</Text>
                  <Text style={{ fontFamily: 'Quicksand-Medium', textAlign: 'center' }}>Mohon tambahkan alamat baru.</Text>
                </View>
              </CenterImage>
            }
            <TouchableOpacity style={{ padding: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F26525' }} onPress={() => this.props.navigation.navigate('AddEditAddressPage', { data: { action: 'Tambah', address: null } })}>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Quicksand-Bold', fontSize: 16 }}>Tambah Alamat Baru</Text>
            </TouchableOpacity>
          </>
        }
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
      </Container>
    )
  }
}

const stateToProps = (state) => ({
  address: state.address
})

const dispatchToProps = (dispatch) => ({
  getAddress: () => dispatch(AddressActions.addressRequest()),
  primaryRequest: (data) => (dispatch(AddressActions.addressPrimaryRequest(data))),
  deleteAddress: (data) => (dispatch(AddressActions.addressDeleteRequest(data)))
})

export default connect(stateToProps, dispatchToProps)(AddressPage)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`

// const HeaderContainer = styled.View`
//   flexDirection: row;
//   padding: 15px;
//   width: 100%;
//   borderBottomColor: #E0E6ED;
//   borderBottomWidth: 1px;
// `
// const TitleContainer = styled.Text`
//   textAlign: center;
//   flexGrow: 90;
//   fontSize: 18;
//   color: #757886;
//   font-family:Quicksand-Bold;
// `

const HrFull = styled.View`
  flex:1;
  backgroundColor:#E0E6ED;
  height:1;
  marginHorizontal:-10;
`

const MarginTopXS = styled.View`
  margin-top: 10px;
`
const CenterImage = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
`
