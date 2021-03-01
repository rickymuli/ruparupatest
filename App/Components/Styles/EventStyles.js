import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  containerDailyDeals: {
    flex: 1,
    backgroundColor: '#008CCF'
  },
  containerFlashSale: {
    flex: 1,
    backgroundColor: '#F3251D'
  },
  header: {
    color: 'white',
    fontSize: 24,
    margin: '2%',
    fontFamily: 'Quicksand-Bold'
  },
  itemViews: {
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: 10,
    height: '100%',
    width: '14%'
  },
  oldPriceText: {
    fontSize: 12,
    color: '#d8d8d8',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  newPriceText: {
    fontSize: 18,
    color: '#2bb1ff',
    fontFamily: 'Quicksand-Bold'
  },
  itemImage: {
    width: 200,
    height: 200
  },
  scrollViewItem: {
    height: 290,
    width: '100%',
    margin: '3%'
  },
  swipableViewStyle: {
    height: '30%',
    paddingTop: '3%',
    flexDirection: 'row'
  },
  contentView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default styles
