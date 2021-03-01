import React, { Component } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import config from '../../config'

// component
import { HeaderComponent, AddToCartButton } from '../Components'

// Redux
import UserActions from '../Redux/UserRedux'
import MemberActions from '../Redux/MemberRegistrationRedux'

// Styles
import styled from 'styled-components'

class MemberUpgrade extends Component {
  static navigationOptions = {
    header: null
  }

  link = {
    'prod': config.baseURL,
    'stg': config.stgApiURL,
    'dev': config.devApiURL
  }

  constructor (props) {
    super(props)
    this.state = {
      activeVariant: {
        sku: '70000216'
      }
    }
  }

  componentDidMount () {
    if (this.props.route.params.newMember) {
      this.props.getUserData()
    }
  }

  // componentDidUpdate () {
  //   const { cart, navigation, memberRegistration, cartSuccess, goToPayment } = this.props
  //   if (cart.data && cart.success && memberRegistration.goToPayment) {
  //     navigation.navigate('PaymentPage', { utmParameter: '' })
  //     cartSuccess(false)
  //     goToPayment(false)
  //   }
  // }

  goback = () => {
    this.props.navigation.navigate('MembershipModal')
  }

  render () {
    const { activeVariant } = this.state
    const { user } = this.props.user
    let name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name
    let phone = user.phone.indexOf('0') === 0 ? user.phone.replace('0', '+62') : user.phone
    let utmParameter =
    this.link[config.developmentENV] + '?' +
    // 'https://m.ruparupa.com/checkout?' +
    'sku=' + activeVariant.sku + '&' +
    'qty=' + '1' + '&' +
    'name=' + name + '&' +
    'email=' + user.email + '&' +
    'phone=' + phone + '&' +
    'temp_member=' + user.group.AHI

    let itmData = {
      itm_membership: true
    }

    return (
      <Container>
        <HeaderComponent back leftAction={this.goback.bind(this)} pageName={this.props.route.params.newMember ? this.props.route.params.newMember : 'Tingkatkan Status Membership'} navigation={this.props.navigation} />
        <ScrollView style={{ flex: 1 }}>
          <ContentContainer>
            <View>
              <BlueView>
                <Icon color={'#8f919c'} name={'information-outline'} size={20} />
                <Text style={{ fontFamily: 'Quicksand-Medium', color: '#8f919c', fontSize: 15, lineHeight: 25, width: '95%', marginLeft: 5 }}>Untuk mendapatkan benefit poin belanja dan diskon merchant, silahkan tingkatkan status membership dari Ace Access menjadi Ace Rewards. Hanya dengan biaya Rp 100.000, atau lakukan pembelanjaan sebesar Rp 2.000.000 selama 6 bulan untuk mendapat gratis peningkatan status member ke Ace Rewards</Text>
              </BlueView>
              <View style={{ paddingVertical: 15 }} />
              <MembershipReward>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Text style={{ fontFamily: 'Quicksand-Bold', color: '#676973' }}>Ace Access</Text>
                    </View>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Harga Khusus Member</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Gratis Pengiriman</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Info Promo & Event Terbaru</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#f3271f'} name={'close-circle'} size={20} />
                      <RewardText>Belanja Dapat Point Rewards</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#f3271f'} name={'close-circle'} size={20} />
                      <RewardText>Special Promo Poin Rewards</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#f3271f'} name={'close-circle'} size={20} />
                      <RewardText>Penawaran Khusus Ulang Tahun</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#f3271f'} name={'close-circle'} size={20} />
                      <RewardText>Pay All With Points</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#f3271f'} name={'close-circle'} size={20} />
                      <RewardText>Special Merchandise</RewardText>
                    </RewardContainer>
                  </View>
                  <View style={{ backgroundColor: '#e6eaf0', paddingHorizontal: 1 }} />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', padding: 10 }}>
                      <Text style={{ fontFamily: 'Quicksand-Bold', color: '#676973' }}>Ace Rewards</Text>
                    </View>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Harga Khusus Member</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Gratis Pengiriman</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Info Promo & Event Terbaru</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Belanja Dapat Point Rewards</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Special Promo Poin Rewards</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Penawaran Khusus Ulang Tahun</RewardText>
                    </RewardContainer>
                    <RewardContainer>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Pay All With Points</RewardText>
                    </RewardContainer>
                    <RewardContainer style={{ backgroundColor: null }}>
                      <Icon color={'#099575'} name={'check-circle'} size={20} />
                      <RewardText>Special Merchandise</RewardText>
                    </RewardContainer>
                  </View>
                </View>
              </MembershipReward>

            </View>
          </ContentContainer>
        </ScrollView>
        <View style={{ paddingHorizontal: 15, paddingVertical: 2 }}>
          <AddToCartButton page={'memberUpgrade'} quantity={1} navigation={this.props.navigation} activeVariant={activeVariant} utmParameter={utmParameter} itmData={itmData} />
          <ButtonPrimary onPress={() => this.props.navigation.navigate('Profil')} style={{ backgroundColor: null }}>
            <ButtonPrimaryText style={{ color: '#8d8f96' }}>Nanti Saja</ButtonPrimaryText>
          </ButtonPrimary>
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  cart: state.cart,
  memberRegistration: state.memberRegistration
})

const dispatchToProps = (dispatch) => ({
  getUserData: () => dispatch(UserActions.userRequest()),
  cartSuccess: (params) => dispatch(MemberActions.memberRegCartSuccess(params)),
  goToPayment: (params) => dispatch(MemberActions.memberRegGoToPayment(params))
})

export default connect(mapStateToProps, dispatchToProps)(MemberUpgrade)

const Container = styled.View`
  flex: 1;
  backgroundColor: white;
`
const ContentContainer = styled.View`
  flex: 1
  flexDirection: column;
  marginTop: 5px;
  padding: 15px;
`
const BlueView = styled.View`
  backgroundColor: #e5f7ff;
  borderRadius: 5;
  flexDirection: row;
  padding: 10px;
`
const MembershipReward = styled.View`
  backgroundColor: #e0e6ed;
  borderRadius: 5;
  borderWidth: 2; 
  borderColor: #e0e6ed;
`
const RewardContainer = styled.View`
  width: 100%;
  backgroundColor: white;
  paddingHorizontal: 5px;
  paddingVertical: 18px;
  alignItems: center;
  justifyContent: center;
`
const RewardText = styled.Text`
  fontFamily: Quicksand-Medium;
  color: #676973;
  textAlign: center;
`
const ButtonPrimary = styled.TouchableOpacity`
  paddingTop: 10;
  paddingBottom: 10;
  paddingRight: 20;
  paddingLeft: 20;
  backgroundColor: #F26525;
  borderRadius: 3;
  margin-top: 5px;
  margin-bottom: 10px;
`
const ButtonPrimaryText = styled.Text`
  color: white;
  fontSize: 14;
  textAlign: center;
  font-family:Quicksand-Bold;
`
