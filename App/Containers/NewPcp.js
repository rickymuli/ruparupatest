import React, { Component } from 'react'
import { isEqual, isEmpty } from 'lodash'
import { connect } from 'react-redux'
import { ContainerNoPadding } from '../Styles/StyledComponents'
import ContextProvider from '../Context/CustomContext'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import FilterAndSort from '../Components/FilterAndSort'
import RenderPcpItems from '../Components/RenderPcpItems'
import SnackbarComponent from '../Components/SnackbarComponent'

// Redux
import ProductHandlerActions from '../Redux/ProductHandler'

class NewPcp extends Component {
  constructor (props) {
    super(props)
    this.filterAndSortRef = null
    this.state = {
      itemDetail: null,
      itmData: props.route.params?.itmData ?? {}
    }
  }

  static getDerivedStateFromProps (props, state) {
    let returnObj = {}
    if (!isEqual(props.route.params?.itemDetail ?? 'nothing found...', state.itemDetail)) {
      returnObj = {
        itemDetail: props.route.params?.itemDetail ?? 'nothing found...'
      }
    }
    return returnObj
  }

  toggleWishlist = (message) => {
    this.refs.child.callWithAction(message, 'Lihat Wishlist')
  }

  gotowishlist () {
    this.props.navigation.navigate('Homepage', { screen: 'Wishlist' })
  }

  validatepdp = () => {
    this.setState({ validatepdp: true })
  }

  forceClose = () => {
    this.refs.child.forceClose()
  }

  componentWillUnmount () {
    this.props.productHandlerInit()
  }

  resetFilterAndSort = () => {
    this.filterAndSortRef()
  }

  // Fix children snackbar refs not found in RenderPcpItems
  render () {
    const { itemDetail, itmData } = this.state
    return (
      <ContextProvider value={{
        companyCode: (!isEmpty(itemDetail.data) ? itemDetail.data.company_code : '')
      }}>
        <ContainerNoPadding>
          <HeaderSearchComponent home search={itemDetail.search} itmData={itmData} searchBarcode cartIcon pageType={'category'} validatepdp={this.validatepdp} navigation={this.props.navigation} />
          {(this.props.categoryDetail.fetching)
            ? null
            : <FilterAndSort
              filterAndSortRef={ref => { this.filterAndSortRef = ref }}
              itemDetail={itemDetail}
            />
          }
          <RenderPcpItems itmData={itmData} resetFilterAndSort={this.resetFilterAndSort} forceClose={this.forceClose} toggleWishlist={this.toggleWishlist} itemDetail={itemDetail} navigation={this.props.navigation} />
          <SnackbarComponent ref='child' actionHandler={this.gotowishlist.bind(this)} />
        </ContainerNoPadding>
      </ContextProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  categoryDetail: state.categoryDetail
})

const mapDispatchToProps = (dispatch) => ({
  productHandlerInit: () => dispatch(ProductHandlerActions.productHandlerInit())
})

export default connect(mapStateToProps, mapDispatchToProps)(NewPcp)
