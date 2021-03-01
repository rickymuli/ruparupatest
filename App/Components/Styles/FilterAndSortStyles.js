import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({

  modalHeader: {
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#D4DCE6',
    padding: 15
  },
  sortingOptionsStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED'
  },
  sortLabel: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    color: '#757886',
    fontFamily: 'Quicksand-Regular'
  },
  selectedSort: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    color: '#008CCF',
    fontFamily: 'Quicksand-Bold'
  },
  modalFilterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
    alignItems: 'center'
  },
  cardContent: {
    flexDirection: 'column',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED'
  },
  cardHeader: {
    color: '#757886',
    marginBottom: 10,
    fontSize: 18,
    fontFamily: 'Quicksand-Regular'
  },
  mainContainer: {
    flexDirection: 'row',
    paddingTop: 0,
    paddingBottom: 2,
    paddingVertical: 2,
    backgroundColor: '#FFFFFF',
    elevation: 1
  },
  deliveryItemView: {
    paddingVertical: 5,
    paddingRight: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  brandView: {
    paddingVertical: 10,
    paddingRight: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4DCE6'
  },
  cardTitle: {
    fontSize: 18,
    color: '#757886',
    alignItems: 'center',
    alignSelf: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  buttonApplyCard: {
    marginBottom: 10,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#F26525',
    borderRadius: 3,
    justifyContent: 'center'
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Quicksand-Bold'
  },
  colorView: {
    paddingVertical: 10,
    paddingRight: 10,
    marginRight: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D4DCE6'
  }
})

export default styles
