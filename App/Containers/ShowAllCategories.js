import React, { Component, Fragment } from 'react'
import { Text, View, Dimensions, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import isEqual from 'lodash/isEqual'
import styled from 'styled-components'
// Containers
import IndexCategoryModal from './IndexCategoryModal'

export default class ShowAllCategories extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openModal: false,
      payload: undefined,
      showAllCategories: false
    }
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!isEqual(prevState.payload, nextProps.payload)) {
      return {
        payload: nextProps.payload
      }
    }

    return null
  }

  closeModal = () => {
    this.setState({
      openModal: false,
      showAllCategories: false
    })
  }

  openModal = () => {
    this.setState({
      openModal: true,
      showAllCategories: true
    })
  }

  render () {
    const { openModal, payload, showAllCategories } = this.state
    const concatenatedPayload = payload
    if (payload) {
      return (
        <Fragment>
          <View style={{ padding: 5, width: Dimensions.get('window').width * 0.25 }}>
            <NavigationTouch onPress={() => this.openModal()}>
              <IconView>
                <Image
                  style={{ width: 50, height: 50 }} source={require('../assets/images/Kategori/more-image-only.webp')}
                />
              </IconView>
              <Text style={{ fontSize: 14, textAlign: 'center', fontFamily: 'Quicksand-Regular' }}>Lihat Semua({payload.length})</Text>
            </NavigationTouch>
          </View>
          <Modal
            animationType='fade'
            transparent
            visible={openModal}
            onRequestClose={() => this.closeModal()}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'rgba(0, 0, 0, 0.7)'
            }}>
              <TouchableWithoutFeedback style={{ height: Dimensions.get('window').height / 3 }} onPress={() => this.setState({
                openModal: false
              })}>
                <View style={{ height: Dimensions.get('window').height / 3 }} />
              </TouchableWithoutFeedback>
              <View style={{ height: Dimensions.get('window').height * (2 / 3), backgroundColor: '#555761', flex: 1 }}>
                <IndexCategoryModal
                  navigation={this.props.navigation}
                  category={{
                    children: payload // identifier for showing back button on show all categories
                  }}
                  parentData={{
                    children: concatenatedPayload
                  }}
                  closeModal={this.closeModal}
                  showAllCategories={showAllCategories} />
              </View>
            </View>
          </Modal>
        </Fragment>
      )
    } else {
      return null
    }
  }
}

const NavigationTouch = styled.TouchableOpacity`
  justifyContent: center;
  align-items: center;
  background-color: #FFFFFF;
  
`

const IconView = styled.View`
  border-width: 1;
  border-radius: 20;
  padding-horizontal: 10;
  padding-vertical: 5;
  border-color: #E5E9F2;
`
