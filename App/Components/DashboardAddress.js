import React, { Component } from 'react'
import { View, Image } from 'react-native'
import styled from 'styled-components'

// Styles
import styles from './Styles/DashboardAddressStyles'
import { PrimaryText, fonts, dimensions, colors } from '../Styles'

export default class DashboardAddress extends Component {
  constructor (props) {
    super(props)
    this.state = {
      address: props.address
    }
  }

  // componentWillReceiveProps(newProps) {
  //   const { address } = newProps
  //   this.setState({ address })
  // }
  componentDidUpdate (newProps) {
    const { address } = newProps
    if (this.props !== newProps) {
      this.setState({ address })
    }
  }

  render () {
    const { address } = this.state
    const ratio = dimensions.width * 0.5 / 978
    return (
      <InnerContainer>
        {(address.hasOwnProperty('first_name'))
          ? <FlexColumn>
            <MarginBottomM>
              <MarginBottomXS>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/images/Profile-Mobile-App/mini/alamat-pengiriman-title.webp')} style={{ width: 18, height: 18, marginRight: 5 }} />
                  <Bold>Alamat Pengiriman</Bold>
                </View>
                {/* <Grid>
                  <Col size={7}>
                    <Image source={require('../assets/images/Profile-Mobile-App/mini/alamat-title.webp')} style={{ width: 16, height: 18 }} />
                  </Col>
                  <Col size={93}>
                    <Bold>Alamat Pengiriman</Bold>
                  </Col>
                </Grid> */}
              </MarginBottomXS>
              <MarginBottomXS>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/images/Profile-Mobile-App/mini/user.webp')} style={{ width: 18, height: 18, marginRight: 5 }} />
                  <PrimaryText>Penerima: {address.first_name.charAt(0).toUpperCase() + address.first_name.slice(1)} {(address.last_name) ? address.last_name : ''}</PrimaryText>
                </View>
              </MarginBottomXS>
              <MarginBottomXS>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <Image source={require('../assets/images/Profile-Mobile-App/mini/alamat.webp')} style={{ width: 18, height: 18, marginRight: 5 }} />
                  <PrimaryText style={{ flex: 1 }}>{address.full_address + ' ' + address.kecamatan.kecamatan_name.charAt(0).toUpperCase() + address.kecamatan.kecamatan_name.toLowerCase().slice(1) + ' ' + address.city.city_name.charAt(0).toUpperCase() + address.city.city_name.toLowerCase().slice(1) + ' ' + address.province.province_name + ' ' + address.post_code}</PrimaryText>
                </View>
              </MarginBottomXS>
              <MarginBottomXS>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('../assets/images/Profile-Mobile-App/mini/phone.webp')} style={{ width: 18, height: 18, marginRight: 5 }} resizeMode='contain' />
                  <PrimaryText>{address.phone}</PrimaryText>
                </View>
                {/* <Grid>
                  <Col size={7}>
                    <Image source={require('../assets/images/Profile-Mobile-App/mini/alamat-pengiriman.webp')} style={{ width: 16, height: 18 }} />
                  </Col>
                  <Col size={93}>
                    <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.full_address + ' ' + address.kecamatan.kecamatan_name.charAt(0).toUpperCase() + address.kecamatan.kecamatan_name.toLowerCase().slice(1) + ' ' + address.city.city_name.charAt(0).toUpperCase() + address.city.city_name.toLowerCase().slice(1) + ' ' + address.province.province_name + ' ' + address.post_code}</Text>
                  </Col>
                </Grid>
              </MarginBottomXS>
              <MarginBottomXS>
                <Grid>
                  <Col size={7}>
                    <Image source={require('../assets/images/Profile-Mobile-App/mini/phone.webp')} style={{ width: 14, height: 18 }} />
                  </Col>
                  <Col size={93}>
                    <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{address.phone}</Text>
                  </Col>
                </Grid> */}
              </MarginBottomXS>
            </MarginBottomM>
            <ButtonBorder onPress={() => this.props.navigation.navigate('AddressPage')}>
              <Image source={require('../assets/images/Profile-Mobile-App/mini/view-blue.webp')} style={{ width: 18, height: 18 }} />
              <ButtonBorderText> Lihat Semua Alamat</ButtonBorderText>
            </ButtonBorder>
          </FlexColumn>
          : <View style={{ flexDirection: 'column' }}>
            <View style={{ alignSelf: 'center' }}>
              <Image source={require('../assets/images/alamat-kosong.webp')} style={{ width: dimensions.width * 0.5, height: ratio * 794 }} />
            </View>
            <ButtonBorder onPress={() => this.props.navigation.navigate('AddressPage')} style={styles.button}>
              <ButtonBorderText style={styles.buttonText}>{(address.data && address.data.length > 0) ? 'Pilih Alamat Pengiriman' : 'Masukkan Alamat Pengiriman'}</ButtonBorderText>
            </ButtonBorder>
          </View>
        }
      </InnerContainer>
    )
  }
}

const InnerContainer = styled.View`
  flexDirection: column;
  backgroundColor: white;
  padding: 20px;
  margin: 15px;
  border-width: 1;
  border-color: #D4DCE6;
  border-radius: 3;
`
// const FontSizeL = styled.Text`
//   font-size: 18px;
//   font-family:${fonts.regular};
// `
// const FlexRow = styled.View`
//   flexDirection : row;
// `
// const MarginVerticalM = styled.View`
//   marginVertical : 20px;
// `

const MarginBottomXS = styled.View`
  margin-bottom: 10px;
`
const MarginBottomM = styled.View`
  margin-bottom: 20px;
`

const FlexColumn = styled.View`
  flex-direction: column;
`

const ButtonBorder = styled.TouchableOpacity`
  padding-vertical: 5;
  paddingLeft: 15;
  paddingRight: 15;
  borderWidth: 1;
  border-radius: 3;
  borderColor: #D4DCE6;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const ButtonBorderText = styled.Text`
  fontSize: 14;
  font-family:${fonts.regular}
  color: #008CCF;
`
const Bold = styled.Text`
  font-family:${fonts.bold};
  color: ${colors.primary};
`
