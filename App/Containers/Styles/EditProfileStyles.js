import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  selectedOuterView: {
    width: 24,
    height: 24,
    borderRadius: 100 / 2,
    borderWidth: 1,
    borderColor: '#008CCF',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  selectedInnerView: {
    width: 15,
    height: 15,
    borderRadius: 100 / 2,
    backgroundColor: '#008CCF'
  },
  notSelected: {
    width: 24,
    height: 24,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: '#E0E6ED',
    backgroundColor: 'white',
    marginRight: 10
  },
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
    padding: 10
  },
  itemContainer: {
    borderColor: '#E0E6ED',
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10
  },
  itemContainerRow: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row'
  }
})

export default styles
