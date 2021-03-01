import React, { Component } from 'react'
import { Text, View, TouchableOpacity, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import IconFeather from 'react-native-vector-icons/Feather'
import isEmpty from 'lodash/isEmpty'
import { connect } from 'react-redux'

// Redux
import UserActions from '../Redux/UserRedux'

// Styles
import styled from 'styled-components'
import { PrimaryTextBold, ErrorText, fonts } from '../Styles'

class EditMemberForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      storeCode: props.storeCode,
      newMemberId: props.memberId || '',
      userUpdate: false
    }
  }

  componentDidUpdate () {
    const { userUpdate } = this.state
    const { user } = this.props
    if (userUpdate && isEmpty(user.err)) {
      this.setState({ userUpdate: false })
      this.props.toggleToast()
      this.props.closeModal()
    }
  }

  handleUpdate = () => {
    const { user } = this.props
    const { storeCode, newMemberId } = this.state
    let group = {}
    if (user && user.user && user.user.group) {
      group = { ...user.user.group }
    }
    group[storeCode] = newMemberId
    let newUser = { ...user.user, group }
    this.props.updateUserData({ user: newUser })
    this.setState({ userUpdate: true })
  }

  render () {
    const { storeCode, newMemberId } = this.state
    const { user } = this.props
    let title
    let placeHolder
    if (storeCode === 'AHI') {
      title = 'Ace Rewards'
      placeHolder = 'Member ID Ace Rewards'
    } else if (storeCode === 'HCI') {
      title = 'Informa Rewards'
      placeHolder = 'Member ID Informa Rewards'
    } else {
      title = 'Toys Kingdom Smile Club'
      placeHolder = 'Toyskingdom Smile Club ID'
    }
    return (
      <View style={{ flex: 1, paddingTop: 30 }}>
        <PrimaryTextBold style={{ fontSize: 20, textAlign: 'center' }}>{title}</PrimaryTextBold>
        <View style={{ backgroundColor: 'white', flexDirection: 'column', padding: 10 }}>
          <FormS>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} color={'#D4DCE6'} name='credit-card' size={16} />
            <TextInput autoCapitalize='characters' underlineColorAndroid='transparent' maxLength={10} value={newMemberId} onChangeText={(value) => this.setState({ newMemberId: value })} placeholder={placeHolder} style={{ height: 40, textDecorationColor: 'white', color: '#F26525', flex: 1 }} />
          </FormS>
          {(!isEmpty(user.err))
            ? <View><ErrorText>{user.err}</ErrorText></View>
            : null
          }
        </View>
        <View style={{ padding: 10 }}>
          {(!user.fetching)
            ? <TouchableOpacity onPress={() => this.handleUpdate()} style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#F26525', borderRadius: 3 }}>
              <Text style={{ fontFamily: fonts.medium, color: 'white', fontSize: 16, textAlign: 'center' }}>Simpan</Text>
            </TouchableOpacity>
            : <View style={{ paddingTop: 10, paddingBottom: 10, paddingRight: 20, paddingLeft: 20, backgroundColor: '#008CCF', borderRadius: 3 }}>
              <IconFeather name='loader' size={20} color='white' />
            </View>
          }
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  updateUserData: (user) => dispatch(UserActions.userUpdate(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMemberForm)

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
  flex-direction: row;
`
