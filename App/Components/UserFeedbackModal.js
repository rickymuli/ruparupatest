import React, { useState, useEffect } from 'react'
import { Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import Modal from 'react-native-modal'
import styled from 'styled-components'
import isEmpty from 'lodash/isEmpty'

// redux
import { useDispatch } from 'react-redux'
import MiscActions from '../Redux/MiscRedux'

const UserFeedbackModal = (props) => {
  const { isAppCrash, sentryCrashInfo } = props

  const dispatch = useDispatch()

  const [modal, setModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [comments, setComments] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isAppCrash) setModal(true)
  }, [isAppCrash])

  useEffect(() => {
    if (!isEmpty(name) && !isEmpty(email) && !isEmpty(comments)) setAllowSubmit(true)
    else setAllowSubmit(false)
  }, [name, email, comments])

  const submitForm = () => {
    setIsSubmitted(true)
    dispatch(MiscActions.miscSendCrashUserFeedback({ 'event_id': sentryCrashInfo.hint.event_id, name, email, comments }))
  }

  const renderHeader = () => {
    return (
      <View style={{ backgroundColor: '#F26525', padding: 15, borderTopLeftRadius: 5, borderTopRightRadius: 5 }}>
        <TouchableOpacity onPress={() => setModal(false)} style={{ position: 'absolute', right: 0, top: 0, margin: 12, padding: 2, zIndex: 1, backgroundColor: 'white', borderRadius: 20 }}>
          <Icon name={'close'} size={12} color='#F26525' />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontFamily: 'Quicksand-Bold', fontSize: 16 }}>App Crash Feedback</Text>
        <Text style={{ color: 'white', fontFamily: 'Quicksand-Regular', marginTop: 5 }}>Sepertinya terjadi kendala pada aplikasi, mohon tinggalkan feedback agar kami dapat melayani Anda dengan baik</Text>
      </View>
    )
  }

  const renderFeedbackForm = () => {
    return (
      <View style={{ padding: 15 }}>
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='user' color={'#757886'} />
          <TextInput
            underlineColorAndroid='transparent'
            value={name}
            onChangeText={value => setName(value)}
            placeholder='Nama'
            placeholderTextColor='#757886'
            style={[{ fontFamily: 'Quicksand-Regular', textDecorationColor: 'white', flex: 1, height: 40, color: 'black' }]} />
        </FormS>
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ alignSelf: 'center', marginLeft: 10, marginRight: 5 }} size={18} name='mail' color={'#757886'} />
          <TextInput
            underlineColorAndroid='transparent'
            value={email}
            onChangeText={value => setEmail(value)}
            placeholder='Email'
            placeholderTextColor='#757886'
            style={[{ fontFamily: 'Quicksand-Regular', textDecorationColor: 'white', flex: 1, height: 40, color: 'black' }]} />
        </FormS>
        <FormS style={{ flexDirection: 'row' }}>
          <Icon style={{ marginTop: 10, marginLeft: 10, marginRight: 5 }} size={18} name='edit' color={'#757886'} />
          <TextInput
            underlineColorAndroid='transparent'
            value={comments}
            onChangeText={value => setComments(value)}
            placeholder='Tulis Feedback Anda'
            placeholderTextColor='#757886'
            multiline
            numberOfLines={5}
            style={[{ fontFamily: 'Quicksand-Regular', textDecorationColor: 'white', flex: 1, height: 120, color: 'black', textAlignVertical: 'top' }]} />
        </FormS>
        <TouchableOpacity onPress={() => submitForm()} style={{ padding: 6, backgroundColor: (allowSubmit ? '#F26525' : '#E5E9F2'), alignItems: 'center', marginTop: 10, marginBottom: 5 }}>
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 18, color: (allowSubmit ? '#FFF' : '#757886') }}>Kirim</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <Modal isVisible={modal}>
      {!isSubmitted
        ? <View style={{ margin: 15, backgroundColor: 'white', borderRadius: 5 }}>
          {renderHeader()}
          {renderFeedbackForm()}
        </View>
        : <View style={{ margin: 15, paddingHorizontal: 15, paddingVertical: 60, backgroundColor: '#F26525', borderRadius: 5, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setModal(false)} style={{ position: 'absolute', right: 0, top: 0, margin: 12, padding: 2, zIndex: 1, backgroundColor: 'white', borderRadius: 20 }}>
            <Icon name={'close'} size={12} color='#F26525' />
          </TouchableOpacity>
          <Icon name={'smile-circle'} size={40} color='#FFF' />
          <Text style={{ color: 'white', fontFamily: 'Quicksand-Bold', fontSize: 18, paddingTop: 15, textAlign: 'center', width: (Dimensions.get('screen').width * 0.5) }}>Terima kasih atas feedback Anda</Text>
          <Text style={{ color: 'white', fontFamily: 'Quicksand-Regular', textAlign: 'center', paddingTop: 10 }}>Kami akan segera melakukan pengecekan untuk meningkatkan kualitas layanan kami</Text>
        </View>}
    </Modal>
  )
}

export default UserFeedbackModal

const FormS = styled.View`
  border: 1px #e5e9f2 solid;
  padding: 0px;
  border-radius: 3px;
  margin-top: 5px;
  margin-bottom: 10px;
`
