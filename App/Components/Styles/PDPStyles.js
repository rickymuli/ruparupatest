import { StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  // PDP content
  contentContainer: {
    backgroundColor: 'white',
    padding: 20
  },
  bread: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10
  },
  productName: {
    color: '#757886',
    fontFamily: 'Quicksand-Bold'
  },
  productNameView: {
    marginBottom: 10
  },
  contentContainerTop: {
    backgroundColor: 'white',
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E6ED',
    paddingLeft: 20,
    paddingRight: 20
  },
  oldPriceText: {
    fontSize: 16,
    color: '#d8d8d8',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  newPriceText: {
    fontSize: 18,
    color: '#008ED1',
    fontFamily: 'Quicksand-Bold'
  },
  itemDescription: {
    marginBottom: 15,
    color: '#757886',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold'
  },
  productDetailSpesificationHead: {
    fontFamily: 'Quicksand-Regular',
    width: Dimensions.get('screen').width * 0.4
  },
  spesificationContainer: {
    flexDirection: 'row',
    marginBottom: 10
  },
  productDetailSpesification: {
    fontFamily: 'Quicksand-Regular',
    width: Dimensions.get('screen').width * 0.5
  },
  // Purchase button
  selectedButton: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: '#008CCF',
    justifyContent: 'space-between',
    borderRadius: 3,
    marginBottom: 5,
    borderWidth: 1,
    flexDirection: 'row',
    borderColor: '#E0E6ED'
  },
  button: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'space-between',
    borderRadius: 3,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#E0E6ED'
  },
  disabledButton: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 20,
    paddingLeft: 20,
    justifyContent: 'space-between',
    borderRadius: 3,
    marginBottom: 5,
    borderWidth: 1,
    backgroundColor: '#E0E6ED',
    borderColor: '#E0E6ED'
  },
  // PDP image component
  wrapper: {
    height: width
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    width,
    flex: 1
  },
  paginationStyle: {
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  paginationText: {
    color: '#757885',
    fontSize: 12,
    fontFamily: 'Quicksand-Regular',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 5,
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  modalHeader: {
    flexDirection: 'row',
    width,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderColor: '#E5E9F2',
    zIndex: 5
  },
  modalImageViewHeader: {
    flexDirection: 'row',
    width,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'flex-end',
    zIndex: 5
  },
  closeIcon: {
    width: 30,
    height: 30,
    alignItems: 'flex-end'
  },
  wrapperModal: {
    width,
    height,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  imageInModal: {
    width,
    height,
    marginTop: -50
  },
  imageInModalIos: {
    width,
    height: height / 1.1
  },
  slide2: {
    flex: 1
  }
})

export default styles
