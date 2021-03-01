import React, { Component } from 'react'
import { View, Modal, TouchableOpacity, SafeAreaView, Text } from 'react-native'
import { SortContainer, SortItemContainer, FontSizeS, FontMNoLineHeight, Right, TextModal, ModalHeader, DistributeSpaceBetween } from '../Styles/StyledComponents'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styles from './Styles/FilterAndSortStyles'
import { connect } from 'react-redux'

// Redux
import ReviewRatingActions from '../Redux/ReviewRatingRedux'

class SortReviewContainer extends Component {
  constructor () {
    super()
    this.state = {
      sort:
      [
        { label: 'Semua', value: '' },
        { label: 'Dengan Gambar', value: 'have_images' },
        { label: '5 Star', value: '5' },
        { label: '4 Star', value: '4' },
        { label: '3 Star', value: '3' },
        { label: '2 Star', value: '2' },
        { label: '1 Star', value: '1' }
      ],
      selectedSort: 'Semua',
      modalVisible: false
    }
  }

  applySort = (sortType) => {
    const { sku } = this.props
    this.setState({ selectedSort: sortType.label, sku })
    this.props.sortReviewRatingRequest(sortType.value, sku)
    this.setModalVisible(false)
  }

  renderSelectedSort = (sortLabel) => {
    if (this.state.selectedSort === sortLabel.label) {
      return (
        <DistributeSpaceBetween><Text style={styles.selectedSort}>{sortLabel.label}</Text><Icon name='check' size={20} color='#008CCF' onPress={() => this.setModalSortVisible(false)} style={{ marginRight: 15, alignSelf: 'center' }} /></DistributeSpaceBetween>
      )
    } else {
      return (
        <Text style={styles.sortLabel}>{sortLabel.label}</Text>
      )
    }
  }

  renderModalContent = () => {
    return (
      <SafeAreaView>
        <ModalHeader>
          <TextModal>Filter Berdasarkan</TextModal>
          <Right><Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => this.setModalVisible(false)} /></Right>
        </ModalHeader>
        {this.state.sort.map((sortTypes, index) => (
          <TouchableOpacity key={`sort${sortTypes.label}${index}`} onPress={() => this.applySort(sortTypes)}>
            <View style={styles.sortingOptionsStyle}>
              {this.renderSelectedSort(sortTypes)}
            </View>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    )
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible })
  }

  render () {
    return (
      <SortContainer>
        <FontSizeS>Filter Berdasarkan</FontSizeS>
        <SortItemContainer onPress={() => this.setModalVisible(true)}>
          <FontMNoLineHeight>{this.state.selectedSort}</FontMNoLineHeight>
          <Icon name='chevron-down' size={18} color='#E0E6ED' />
        </SortItemContainer>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setModalVisible(false)
          }}>
          {this.renderModalContent()}
        </Modal>
      </SortContainer>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  sortReviewRatingRequest: (sortType, sku) => dispatch(ReviewRatingActions.sortReviewRatingRequest(sortType, sku))
})

export default connect(null, mapDispatchToProps)(SortReviewContainer)
