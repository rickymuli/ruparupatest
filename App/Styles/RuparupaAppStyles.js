import { StyleSheet } from 'react-native'

// Style for AddressPage
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 15,
    width: '100%',
    borderBottomColor: '#E0E6ED',
    borderBottomWidth: 1
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E9F2'
  },
  itemContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 20
  }
})

export default styles
