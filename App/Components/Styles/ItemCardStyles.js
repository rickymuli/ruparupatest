import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  viewItems: {
    width: '50%',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'red'
  },
  itemImage: {
    width: 200,
    height: 200
  },
  oldPriceText: {
    fontSize: 16,
    color: '#d8d8d8',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    textDecorationColor: 'red'
  },
  newPriceText: {
    fontSize: 18,
    color: '#2bb1ff',
    fontFamily: 'Quicksand-Bold'
  }
})

export default styles
