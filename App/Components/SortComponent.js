import React, { Component } from 'react'
import { Text, View, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import find from 'lodash/find'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/FilterAndSortStyles'
import { HeaderPills, MarginRightS, DistributeSpaceBetween } from '../Styles/StyledComponents'

// Redux
import ProductHandlerActions from '../Redux/ProductHandler'
import HeaderSearchComponent from './HeaderSearchComponent'

class SortComponent extends Component {
  constructor () {
    super()
    this.state = {
      sort:
      [
        { label: 'Paling Relevan', value: 'matching' },
        { label: 'Harga Termurah', value: 'lowestPrice' },
        { label: 'Harga Termahal', value: 'highestPrice' },
        { label: 'Produk Terbaru', value: 'newArrival' },
        { label: 'Diskon Tertinggi', value: 'highestDiscount' },
        { label: 'Diskon Terendah', value: 'lowestDiscount' }
        // { label: 'Nama Produk A-Z', value: 'alfabetAsc' },
        // { label: 'Nama Produk Z-A', value: 'alfabetDesc' }
      ],
      modalSortVisible: false
    }
  }

  componentDidMount () {
    this.props.sortRef(this.applySort.bind(this))
  }

  setModalSortVisible = (visible) => {
    this.setState({ modalSortVisible: visible })
  }

  applySort = (sortType) => {
    this.props.productHandlerSetSort(sortType)
    this.setModalSortVisible(false)
  }

  renderSelectedSort = (sortLabel) => {
    if (this.props.productHandler.sortType === sortLabel.value) {
      return (
        <DistributeSpaceBetween><Text style={styles.selectedSort}>{sortLabel.label}</Text><Icon name='check' size={20} color='#008CCF' onPress={() => this.setModalSortVisible(false)} style={{ marginRight: 15, alignSelf: 'center' }} /></DistributeSpaceBetween>
      )
    } else {
      return (
        <Text style={styles.sortLabel}>{sortLabel.label}</Text>
      )
    }
  }

  // Rendering sort
  renderSortModal = () => {
    return (
      <SafeAreaView>
        <HeaderSearchComponent pageName='Urut Berdasarkan' close rightAction={() => this.setModalSortVisible(false)} />
        {this.state.sort.map((sortTypes, index) => (
          <TouchableOpacity key={`sort${sortTypes.label}${index}`} onPress={() => this.applySort(sortTypes.value)}>
            <View style={styles.sortingOptionsStyle}>
              {this.renderSelectedSort(sortTypes)}
            </View>
          </TouchableOpacity>
        ))}
      </SafeAreaView>
    )
  }

  render () {
    let sortby = (find(this.state.sort, { 'value': this.props.productHandler.sortType })).label
    return (
      <View style={{ flex: 0.5 }}>
        <HeaderPills
          onPress={() => this.setModalSortVisible(true)}
        >
          <Icon name='sort-descending' color='#757886' />
          <MarginRightS>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>{sortby}</Text>
          </MarginRightS>
        </HeaderPills>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalSortVisible}
          onRequestClose={() => {
            this.setModalSortVisible(false)
          }}
        >
          {this.renderSortModal()}
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  productHandler: state.productHandler
})

const mapDispatchToProps = (dispatch) => ({
  productHandlerSetSort: (sortType) => dispatch(ProductHandlerActions.productHandlerSetSort(sortType))
})

export default connect(mapStateToProps, mapDispatchToProps)(SortComponent)
