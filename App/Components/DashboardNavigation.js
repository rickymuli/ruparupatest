import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Image, Linking, Alert } from 'react-native'
import config from '../../config'
import inRange from 'lodash/inRange'
import get from 'lodash/get'
import { RemoteConfig } from '../Services/Firebase'
import { fonts, dimensions } from '../Styles'

class DashboardNavigation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: props.user,
      disableMembership: false,
      mandatory: 0
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (nextProps.user && nextProps.user !== prevState.user) {
      let mandatory = 0
      if (!get(nextProps.user, 'user.birth_date')) mandatory++
      if (!get(nextProps.user, 'user.gender')) mandatory++
      return {
        user: nextProps.user,
        mandatory: mandatory
      }
    }
    return null
  }

  componentDidMount () {
    this.checkMemberpoint()
  }

  checkMemberpoint () {
    RemoteConfig('membership_point')
      .then((data) => {
        if (data.validByDate && inRange(new Date(), new Date(data.startDate), new Date(data.endDate))) {
          this.setState({ disableMembership: true })
        }
      })
      .catch(e => console.log(e))
  }

  render () {
    const { disableMembership } = this.state
    return (
      <ContainerNavigationDashboard>
        {/* <ContainerDashboardDetail onPress={() => !_.isEmpty(user.user) && this.props.navigation.navigate('ProfileModal')}>
          { (mandatory !== 0) &&
            <DotNotificationRed>
              <DotRedText>{mandatory}</DotRedText>
            </DotNotificationRed>
          }
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-editprofil.webp')} style={{ width: 75, height: 37 }} />
          </IconHeight>
          <TextNavigation>Profil Saya</TextNavigation>
        </ContainerDashboardDetail>
        <ContainerDashboardDetail onPress={() => this.props.navigation.navigate('AddressPage')}>
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-daftaralamat.webp')} style={{ width: 75, height: 37 }} />
          </IconHeight>
          <TextNavigation >Daftar Alamat</TextNavigation>
        </ContainerDashboardDetail>
        <ContainerDashboardDetail onPress={() => this.props.navigation.navigate('WishlistPage')}>
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-wishlist.webp')} style={{ width: 75, height: 37 }} />
          </IconHeight>
          <TextNavigation >Wishlist</TextNavigation>
        </ContainerDashboardDetail> */}
        <ContainerDashboardDetail onPress={() => this.props.navigation.navigate('VoucherPage')}>
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-vouchersaya.webp')} style={{ width: 75, height: 37 }} />
          </IconHeight>
          <TextNavigation >Voucher Saya</TextNavigation>
        </ContainerDashboardDetail>
        <ContainerDashboardDetail onPress={() => {
          (disableMembership)
            ? Alert.alert('Terjadi Kesalahan', 'System sedang dalam proses maintenance')
            : this.props.navigation.navigate('PointPage')
        }}>
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-tukarpoin.webp')} style={{ width: 75, height: 37 }} />
          </IconHeight>
          <TextNavigation >Tukar Poin</TextNavigation>
        </ContainerDashboardDetail>
        <ContainerDashboardDetail onPress={() => Linking.openURL(`mailto:${config.defaultMailto}`)}>
          <IconHeight>
            <Image source={require('../assets/images/Profile-Mobile-App/icon-help.webp')} style={{ width: 65, height: 37 }} />
          </IconHeight>
          <TextNavigation >Bantuan</TextNavigation>
        </ContainerDashboardDetail>
      </ContainerNavigationDashboard>
    )
  }
}

const stateToProps = (state) => ({
  user: state.user,
  order: state.order
})

export default connect(stateToProps, null)(DashboardNavigation)

const IconHeight = styled.View`
  margin-top: 20px;
  height: 30px;
`
const ContainerNavigationDashboard = styled.View`
  flexDirection: row;
  flexWrap: wrap;
  padding: 10px 15px;
  justify-content: space-between;
`

const ContainerDashboardDetail = styled.TouchableOpacity`
  flex-direction: column;
  justify-content: center;
  background-color: white;
  margin-bottom: 10;
  align-items: center;
  border-width: 1px;
  border-radius: 3;
  borderColor: #E0E6ED;
  height: ${dimensions.width * 0.2};
  width: ${dimensions.width * 0.3};
`

const TextNavigation = styled.Text`
  color: #757886;
  fontSize: 12px;
  text-align: center;
  padding: 10px;
  font-family:${fonts.bold};
  height: 50px;
`
