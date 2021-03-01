import { StyleSheet, Dimensions } from 'react-native'

const { width } = Dimensions.get('screen')

const styles = StyleSheet.create({
  itemStyles: {
    flexDirection: 'column',
    backgroundColor: 'white'
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#D7E9F0',
    borderRadius: 5
  },
  imageResult: {
    width: 130,
    height: 130
  },
  popularSearchView: {
    width,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2',
    backgroundColor: 'white',
    padding: 20
  }
})
export default styles
