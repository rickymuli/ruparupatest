import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/FilterAndSortStyles'

// Components
import FilterComponent from './FilterComponent'
import SortComponent from './SortComponent'

// Redux
import ProductHandlerActions from '../Redux/ProductHandler'

class FilterAndSort extends Component {
  constructor () {
    super()
    this.filterRef = null
    this.sortRef = null
  }

  componentDidMount () {
    this.props.filterAndSortRef(this.resetSortAndFilter)
  }
  componentDidUpdate (prevProps) {
    if (prevProps.itemDetail !== this.props.itemDetail) {
      this.props.productHandlerReset()
    }
  }

  componentWillUnmount () {
    this.props.productHandlerReset()
  }

  resetSortAndFilter = () => {
    this.filterRef()
    this.sortRef('matching')
  }

  // ======== Render ==========
  render () {
    return (
      <View style={styles.mainContainer}>
        <FilterComponent
          filterRef={ref => { this.filterRef = ref }}
          itemDetail={this.props.itemDetail}
        />
        <SortComponent sortRef={ref => { this.sortRef = ref }} />
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  productHandler: state.productHandler
})

const mapDispatchToProps = (dispatch) => ({
  productHandlerReset: () => dispatch(ProductHandlerActions.productHandlerReset())
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterAndSort)
