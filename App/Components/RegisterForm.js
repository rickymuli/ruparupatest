import React, { Component } from 'react'
import { View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Style
import styled from 'styled-components'

export default class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      securePass: true,
      secureConfirm: true,
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    }
  }

    checkOtp = async () => {
      const { fullName, email, password, confirmPassword, phone } = this.state
      let firstName = fullName
      let lastName = ''
      let splitName = fullName.trim().split(/ (.+)/, 2)
      if (splitName.length > 1) {
        firstName = splitName[0]
        lastName = splitName[1]
      }
      let newPhone = phone.replace('+', '')
      let dataTemp = {
        email: email.toLowerCase(),
        phone: newPhone.replace(/^62/, '0'),
        first_name: firstName,
        last_name: lastName,
        password,
        confirm_password: confirmPassword
      }
      this.props.checkOtp(dataTemp)
    }

    render () {
      const { fullName, email, password, confirmPassword, phone, securePass, secureConfirm } = this.state
      return (
        <View>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='account' color={'#D4DCE6'} />
            <Input
              autoCapitalize='none'
              returnKeyType='next'
              selectionColor='rgba(242, 101, 37, 1)'
              underlineColorAndroid='transparent'
              keyboardType='default'
              value={fullName}
              onChangeText={(fullName) => this.setState({ fullName })}
              placeholder='Nama lengkap'
              onSubmitEditing={() => {
                this.emailRef.focus()
              }}
              blurOnSubmit={false}
              placeholderTextColor='#b2bec3' />
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='email' color={'#D4DCE6'} />
            <Input
              ref={(input) => { this.emailRef = input }}
              returnKeyType='next'
              onSubmitEditing={() => {
                this.passwordRef.focus()
              }}
              blurOnSubmit={false}
              autoCapitalize='none'
              selectionColor='rgba(242, 101, 37, 1)'
              underlineColorAndroid='transparent'
              keyboardType='email-address'
              value={email} onChangeText={(email) => this.setState({ email })}
              placeholder='Alamat email'
              placeholderTextColor='#b2bec3' />
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='lock' color={'#D4DCE6'} />
            <Input
              ref={(input) => { this.passwordRef = input }}
              returnKeyType='next'
              onSubmitEditing={() => {
                this.confirmPasswordRef.focus()
              }}
              blurOnSubmit={false}
              autoCapitalize='none'
              selectionColor='rgba(242, 101, 37, 1)'
              underlineColorAndroid='transparent'
              style={{ flexGrow: 95 }}
              value={password}
              onChangeText={(password) => this.setState({ password })}
              placeholder='Kata sandi'
              placeholderTextColor='#b2bec3'
              secureTextEntry={securePass} />
            <TouchableOpacity onPress={() => this.setState({ securePass: !securePass })} style={{ alignSelf: 'center', marginRight: 10 }} >
              <Icon size={18} name={`eye${securePass ? '' : '-off'}`} color={'#757886'} />
            </TouchableOpacity>
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='lock' color={'#D4DCE6'} />
            <Input
              ref={(input) => { this.confirmPasswordRef = input }}
              returnKeyType='next'
              blurOnSubmit={false}
              onSubmitEditing={() => {
                this.phoneRef.focus()
              }}
              autoCapitalize='none'
              selectionColor='rgba(242, 101, 37, 1)'
              underlineColorAndroid='transparent'
              keyboardType='default' style={{ flexGrow: 95 }} value={confirmPassword} onChangeText={(confirmPassword) => this.setState({ confirmPassword })} placeholder='Ulangi kata sandi' placeholderTextColor='#b2bec3' secureTextEntry={secureConfirm} />
            <TouchableOpacity onPress={() => this.setState({ secureConfirm: !secureConfirm })} style={{ alignSelf: 'center', marginRight: 10 }} >
              <Icon size={18} name={`eye${secureConfirm ? '' : '-off'}`} color={'#757886'} />
            </TouchableOpacity>
          </FormS>
          <FormS style={{ flexDirection: 'row' }}>
            <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='cellphone' color={'#D4DCE6'} />
            <Input ref={(input) => { this.phoneRef = input }} autoCapitalize='none' selectionColor='rgba(242, 101, 37, 1)'
              underlineColorAndroid='transparent'
              keyboardType='numeric' returnKeyType='done' value={phone} onChangeText={(phone) => this.setState({ phone })} placeholder='Nomor telepon' placeholderTextColor='#b2bec3' />
          </FormS>
        </View>
      )
    }
}

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
const Input = styled.TextInput`
  text-decoration-color: white;
  color: #F26525; 
  flex: 1;
  height: 40;
`
