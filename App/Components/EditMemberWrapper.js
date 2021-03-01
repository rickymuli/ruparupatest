import React, { Component } from 'react'
import { View, Modal, Dimensions, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

// Component
import EditMemberForm from './EditMemberForm'

// Redux
import UserActions from '../Redux/UserRedux'

class EditMemberWrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      modalVisible: false,
      selectedGroup: '',
      storeCode: '',
      modalBlackSpaceHeigth: Dimensions.get('window').height * (2 / 3),
      groups: props.user.user.group || {}
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEmpty(nextProps.user.user)) {
      const { user } = nextProps.user
      if (prevState.groups !== user.group) {
        return {
          groups: user.group
        }
      }
    }
    return null
  }

  componentDidMount () {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  _keyboardDidShow = (event) => {
    let newHeight = Dimensions.get('window').height - (Dimensions.get('window').height * (1 / 3) + event.endCoordinates.height)
    this.setState({
      modalBlackSpaceHeigth: newHeight
    })
  }

  _keyboardDidHide = (event) => {
    this.setState({
      modalBlackSpaceHeigth: Dimensions.get('window').height * (2 / 3)
    })
  }

  setModalVisible (visible, storeCode) {
    this.setState({ modalVisible: visible, storeCode })
  }

  componentDidUpdate () {
    if (!this.state.modalVisible) {
      this.props.userInit()
    }
  }

  closeModal = () => {
    this.setModalVisible(false, '')
  }

  render () {
    const { storeCode, modalBlackSpaceHeigth, groups } = this.state
    return (
      <View>
        <Modal
          animationType='fade'
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.closeModal()
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}>
            <View style={{ height: modalBlackSpaceHeigth }}>
              <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                <View style={{ height: modalBlackSpaceHeigth }} />
              </TouchableWithoutFeedback>
            </View>
            <View style={{ height: Dimensions.get('window').height * (1 / 3), backgroundColor: 'white', justifyContent: 'center' }}>
              <EditMemberForm memberId={groups[storeCode]} toggleToast={this.props.toggleToast} closeModal={this.closeModal} storeCode={storeCode} />
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user
})

const mapDispatchToProps = (dispatch) => ({
  userInit: () => dispatch(UserActions.userInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(EditMemberWrapper)
