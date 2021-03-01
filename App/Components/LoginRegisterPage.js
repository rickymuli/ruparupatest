import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
// import firebase from '@react-native-firebase/app'
// Components
import Login from './LoginComponent'
import Register from './RegisterComponent'
import HeaderSearchComponent from './HeaderSearchComponent'
import { fonts, colors } from '../Styles'
// import { GetInitialLink, navigate } from '../Services/Firebase'

// Redux
import AuthActions from '../Redux/AuthRedux'
import styled from 'styled-components'
import dynamicLinks from '@react-native-firebase/dynamic-links'

class LoginRegisterPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedTab: 1,
      fromWishlist: props.navigation.fromWishlist,
      fromMarketplaceAcquisition: props?.route?.params?.fromMarketplaceAcquisition || false,
      url: ''
    }
  }
  changeComponent = (name) => {
    this.setState({ selected: name })
  }

  componentDidMount = async () => {
    if (this.state.fromMarketplaceAcquisition) this.setState({ selectedTab: 2 })
    this.props.authInit()
    dynamicLinks()
      .getInitialLink()
      .then(url => {
        if (url) {
          let urlParam = url?.split('?').pop() || ''
          this.setState({ url: urlParam })
        }
      })
    // const url = await firebase.links()
    //   .getInitialLink()
    // if (url !== null) {
    //   let urlParam = url.split('?').pop()
    //   this.setState({ url: urlParam })
    // }
  }

  renderHead () {
    const { selectedTab } = this.state
    return (
      <Head>
        <Tab onPress={() => this.setState({ selectedTab: 1 })} style={{ borderBottomWidth: selectedTab === 1 ? 2 : 0, borderBottomColor: '#FF7F45' }}>
          <Title style={{ color: selectedTab === 1 ? '#FF7F45' : colors.primary }}>Login</Title>
        </Tab>
        <Tab onPress={() => this.setState({ selectedTab: 2 })} style={{ borderBottomWidth: selectedTab === 2 ? 2 : 0, borderBottomColor: '#FF7F45' }}>
          <Title style={{ color: selectedTab === 2 ? '#FF7F45' : colors.primary }}>Daftar</Title>
        </Tab>
      </Head>
    )
  }

  render () {
    const { fromWishlist, selectedTab } = this.state
    const { from } = this.props
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#F9FAFC' }}>
        <HeaderSearchComponent help={!fromWishlist} back={fromWishlist} search cartIcon withoutBoxShadow navigation={this.props.navigation} pageType={'login-register-page'} />
        {this.renderHead()}
        {selectedTab === 1
          ? <Login urlParam={this.state.url} navigation={this.props.navigation} from={from} />
          : <Register urlParam={this.state.url} navigation={this.props.navigation} />
        }
      </View>
    )
  }
}

const stateToProps = (state) => ({})

const dispatchToProps = (dispatch) => ({
  authInit: () => dispatch(AuthActions.authInit())
})

export default connect(stateToProps, dispatchToProps)(LoginRegisterPage)

const Head = styled.View`
  flexDirection: row;
  justifyContent: space-around;
  backgroundColor: white;
  padding-bottom:0px;
  box-shadow: 1px 1px 1px #D4DCE6;
  elevation: 2;
`

const Tab = styled.TouchableOpacity`
  width: 49%;
  paddingVertical: 10;
  justifyContent: center;
  alignItems: center;
`

const Title = styled.Text`
  fontFamily: ${fonts.bold};
  fontSize: 18;
`
