import React, { Component } from 'react'
import { FlatList, Platform, View } from 'react-native'
import ContextProvider from '../Context/CustomContext'
import { Bold, ButtonFilledSmall, Container } from '../Styles/StyledComponents'
import { connect } from 'react-redux'

// Redux
import ReturnRefundActions from '../Redux/ReturnRefundRedux'

// Components
import HeaderSearchComponent from '../Components/HeaderSearchComponent'
import ReturnRefundFinishComponent from '../Components/ReturnRefundFinishComponent'
import ReturnRefundProductList from '../Components/ReturnRefundProductList'
import ReturnInfoComponent from '../Components/ReturnInfoComponent'
import ReturnRefundProgress from '../Components/ReturnRefundProgress'
import ReturnRefundProgressLine from '../Components/ReturnRefundProgressLine'

class ReturnRefundFinishPage extends Component {
  renderProgressBar = () => {
    let FinalProgressComponent = []
    for (let i = 0; i < 5; i++) {
      FinalProgressComponent.push(<ReturnRefundProgress onProgress key={`return finish${i}`} />)
    }
    return FinalProgressComponent
  }

  _renderHeader = () => {
    const { navigation, returnHandler } = this.props
    return (
      <>
        <ReturnRefundProductList products={returnHandler.products} navigation={navigation} />
        <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
          {this.renderProgressBar()}
        </View>
        <View style={{ padding: 15 }}>
          <Bold style={{ fontSize: 16 }}>Pengajuan Pengembalian Selesai</Bold>
        </View>
        <ReturnInfoComponent />
        <ReturnRefundProgressLine />
      </>
    )
  }

  _renderFooter = () => {
    return (
      <Container>
        <ButtonFilledSmall onPress={() => this.props.navigation.navigate('Homepage')}>
          <Bold style={{ color: 'white', fontSize: 16 }}>Selesai</Bold>
        </ButtonFilledSmall>
      </Container>
    )
  }

  componentWillUnmount () {
    this.props.resetResult()
  }

  render () {
    const { returnHandler, returnRefund } = this.props
    let removeClippedSubviews = Platform.OS === 'android' !== false
    return (
      <ContextProvider value={{
        navigation: this.props.navigation,
        setupState: this.setupState,
        fetchingImageUrl: returnHandler.fetchingImageUrl,
        customerEmail: returnRefund.customerEmail,
        products: returnHandler.products,
        returnMethods: returnRefund.returnMethod
      }}>
        <HeaderSearchComponent logo />
        <FlatList
          initialNumToRender={3}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter}
          removeClippedSubviews={removeClippedSubviews}
          data={returnRefund.result}
          extraData={[{ returnMethods: returnRefund.returnMethod }]}
          renderItem={({ item }) => (
            <ReturnRefundFinishComponent
              item={item}
            />
          )}
          keyExtractor={(item, index) => `reason per product ${index}`}
        />
      </ContextProvider>
    )
  }
}

const mapStateToProps = (state) => ({
  returnHandler: state.returnHandler,
  returnRefund: state.returnRefund
})

const mapDispatchToProps = (dispatch) => ({
  resetResult: () => dispatch(ReturnRefundActions.resetResult()),
  initEstimationData: () => dispatch(ReturnRefundActions.initEstimationData())
})

export default connect(mapStateToProps, mapDispatchToProps)(ReturnRefundFinishPage)
