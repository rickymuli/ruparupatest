import React, { Component } from 'react'
import { View, Dimensions, Animated, Modal, TouchableWithoutFeedback, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { PrimaryTextBold } from '../Styles'
const { height } = Dimensions.get('screen')
export default class EasyModal extends Component {
  constructor (props) {
    super(props)
    this.modalanimation = new Animated.Value(0)
    this.state = {
      modal: false,
      close: props.close || true
    }
  }

  setModal (params, callback) {
    const { modal } = this.state
    const { noclose } = this.props
    if ((noclose && params !== true) || params === modal) {
      return null
    } else {
      if (!modal) {
        this.setState({ modal: params !== undefined ? params : !modal }, () => {
          Animated.timing(
            this.modalanimation,
            {
              toValue: 1,
              duration: 200,
              useNativeDriver: true
            }).start()
        })
      } else {
        Animated.timing(
          this.modalanimation,
          {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          }).start(() => {
          this.modalanimation = new Animated.Value(0)
          this.setState({ modal: params !== undefined ? params : !modal }, () => callback && callback())
        })
      }
    }
  }

  render () {
    const { modal } = this.state
    const { size, close, title, noclose, backgroundDisabled, closeMethod } = this.props
    let heightModal = size ? height * (size / 100) : height * (90 / 100)
    let animation = this.modalanimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -heightModal]
    })
    return (
      <Modal
        animationType='fade'
        transparent
        visible={modal}
        onRequestClose={() => {
          (closeMethod) && closeMethod()
          this.setModal(false)
        }}>
        <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
          <View style={{ height: height - heightModal }}>
            <TouchableWithoutFeedback disabled={backgroundDisabled} onPress={() => (!noclose) && this.setModal(false)}>
              <View style={{ height: height - heightModal }} />
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={{ transform: [{ translateY: animation }], flex: 1, bottom: -heightModal, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            {close &&
              <View style={{ paddingVertical: 10, paddingHorizontal: 14, flexDirection: 'row-reverse', justifyContent: 'space-between' }} >
                <TouchableOpacity onPress={() => this.setModal(false)} >
                  <Icon name={'close'} size={24} />
                </TouchableOpacity>
                {title && <PrimaryTextBold style={{ fontSize: 20 }}>{title}</PrimaryTextBold>}
              </View>
            }
            {this.props.children}
          </Animated.View>
        </SafeAreaView>
      </Modal>
    )
  }
}
