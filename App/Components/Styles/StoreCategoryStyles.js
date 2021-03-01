import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  componentView: {
    flexDirection: 'column',
    marginTop: '3%',
    alignItems: 'center'
  },
  itemViews: {
    flexDirection: 'column',
    margin: 10,
    height: '100%',
    width: '13%'
  },
  oldPriceText: {
    fontSize: 16,
    color: '#d8d8d8',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  newPriceText: {
    fontSize: 18,
    color: '#008CCF',
    fontFamily: 'Quicksand-Bold'
  },
  itemImage: {
    width: 200,
    height: 200
  },
  button: {
    width: '75%',
    borderColor: '#2bb1ff',
    borderWidth: 1,
    borderRadius: 5,
    margin: '5%'
  },
  buttonText: {
    textAlign: 'center',
    color: '#2bb1ff',
    fontSize: 20,
    padding: 10,
    fontFamily: 'Quicksand-Bold'
  }
})

export default styles
