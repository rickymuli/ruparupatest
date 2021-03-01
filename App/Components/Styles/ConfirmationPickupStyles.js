import { StyleSheet, Dimensions } from 'react-native'
const { width } = Dimensions.get('screen')

const styles = StyleSheet.create({
  header: {
    width: width,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd' },

  textNormal: {
    fontFamily: 'Quicksand-Regular',
    fontSize: 14,
    lineHeight: 18
  },

  textBold: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    lineHeight: 18
  }

})

export default styles
