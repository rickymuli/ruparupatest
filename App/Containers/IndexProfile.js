import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import Toast, { DURATION } from 'react-native-easy-toast'
import { smartlookInit } from '../Services/Smartlook'

// Components
import DashboardProfilePage from '../Components/DashboardProfilePage'
import LoginRegisterPage from '../Components/LoginRegisterPage'
import ChatButton from '../Components/ChatButton'

class IndexProfile extends Component {
   static navigationOptions = {
     header: null
   }
   constructor (props) {
     super(props)
     this.state = {
       auth: props.auth || null,
       user: props.user
     }
   }

   async componentDidMount () {
     await smartlookInit()
   }

   static getDerivedStateFromProps (nextProps, prevState) {
     if (prevState.auth !== nextProps.auth) {
       if (nextProps.route && nextProps.route.params && !isEmpty(nextProps.route.params)) {
         if (nextProps.auth.user && !isEmpty(nextProps.auth.user)) {
           if (nextProps.route.params.from === 'ConfirmationReorder') {
             nextProps.navigation.navigate('ConfirmationReorder', { itemData: nextProps.route.params.itemData })
             nextProps.navigation.reset({
               routes: [{ name: 'Profil' }]
             })
             return { auth: nextProps.auth }
           }
           // return { auth: nextProps.auth }
         } else return null
       } else return { auth: nextProps.auth }
     } else {
       return null
     }
   }

   // componentDidMount () {
   //   this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
   //   this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
   // }

   // keyboardWillShow = event => {
   //   this.props.navigation.setParams({
   //     keyboard: false
   //   })
   // }

   // keyboardWillHide = event => {
   //   this.props.navigation.setParams({
   //     keyboard: true
   //   })
   // }

   componentDidUpdate (prevProps, prevState) {
     // if(this.props.navigation.getParam('fromPDP', false)){
     //   this.setState({fromPDP:true})
     //
     if (!prevProps.auth.user && this.props.auth.user) {
       this.showToast(this.props.auth.user.first_name)
     }
   }

  showToast = (firstName) => {
    this.refs.toast.show(`Hi, ${firstName}`, DURATION.LENGTH_LONG)
  }

  render () {
    const { auth, otp } = this.props
    const { from } = this.state
    return (
      <Fragment>
        {(isEmpty(auth.user))
          ? <LoginRegisterPage navigation={this.props.navigation} route={this.props.route} dataTempOtp={get(otp, 'dataTemp', {})} from={from} />
          : <DashboardProfilePage navigation={this.props.navigation} />
        }
        <ChatButton />
        <Toast
          ref='toast'
          style={{ width: '100%', backgroundColor: '#049372', borderRadius: 0 }}
          position='top'
          positionValue={40}
          fadeInDuration={750}
          fadeOutDuration={1500}
          opacity={1}
          textStyle={{ color: '#FFFFFF', textAlign: 'center' }}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  otp: state.otp,
  user: state.user
})

export default connect(mapStateToProps, null)(IndexProfile)
