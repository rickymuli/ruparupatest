import { Dimensions } from 'react-native'

const HTMLPDPTagStyles = {
  iframe: {
    width: '100%',
    opacity: 0.99
  },
  p: {
    fontFamily: 'Quicksand-Regular',
    lineHeight: 22,
    marginBottom: 20
  },
  ul: {
    marginBottom: -10,
    marginTop: 10
  },
  li: {
    fontFamily: 'Quicksand-Regular'
  },
  strong: {
    fontFamily: 'Quicksand-Bold'
  },
  h2: {
    marginBottom: 15,
    color: '#757886',
    fontSize: 20,
    fontFamily: 'Quicksand-Bold'
  },
  img: {
    alignSelf: 'center'
  }
}

const HTMLSpecialOffersTagsStyles = {
  h2: {
    color: '#757886',
    fontFamily: 'Quicksand-Medium',
    fontSize: 18,
    lineHeight: 34,
    textAlign: 'center'
  },
  a: {
    color: '#757886',
    fontFamily: 'Quicksand-Medium',
    fontSize: 12,
    lineHeight: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    alignItems: 'center',
    justifyContent: 'center'
  }
}

const HTMLSpecialOffersClassStyles = {
  'card-container': {
    backgroundColor: '#FFFFFF',
    borderRadius: 3
  },
  'box-shadow-light': {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1
  },
  'margin-top-s': {
    marginTop: 15
  },
  'margin-bottom-s': {
    marginBottom: 15
  },
  'title-section': {
    marginBottom: 15
  },
  // 'title-section h2': {
  //   color: '#757886',
  //   fontSize: 18,
  //   lineHeight: 34,
  //   textAlign: 'center',
  //   margin: 0,
  //   fontFamily: 'Quicksand-Bold'
  // },
  // 'sub-banner-6-content .sub-banner-6-grid:nth-of-type(3n + 1)': {
  //   clear: 'left'
  // },
  'sub-banner-6-content': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  'sub-banner-6-grid': {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 20,
    width: Dimensions.get('screen').width * 0.3,
    paddingVertical: 4
  }
  // 'images': {
  //   height: 50,
  //   margin: 0,
  //   marginBottom: 15,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  // 'sub-banner-6-grid a': {
  // }
}

const HTMLPCPBannerTagsStyles = {
  h3: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold'
  },
  p: {
    fontFamily: 'Quicksand-Regular',
    color: '#555761',
    fontSize: 14,
    marginVertical: 15,
    paddingHorizontal: 25,
    lineHeight: 0,
    textAlign: 'center'
  },
  a: {
    color: '#555761',
    fontFamily: 'Quicksand-Regular'
  }
}

const HTMLPCPBannerClassStyles = {
  'btn': {
    paddingHorizontal: 6,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('screen').width
  },
  'btn-ghost-secondary': {
    borderWidth: 1,
    borderColor: '#E0E6ED'
  },
  'text-content': {
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 10
  },
  'btn-block': {
    display: 'block',
    width: Dimensions.get('screen').width
  },
  'margin-top-s': {
    marginTop: 15
  }
}

const HTMLPCPBannerTagsStyles2 = {
  h3: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center'
  },
  p: {
    fontFamily: 'Quicksand-Regular',
    color: 'white',
    fontSize: 14,
    padding: 20,
    textAlign: 'center'
  }
}

const HTMLPCPBannerClassStyles2 = {
  'bold': {
    fontFamily: 'Quicksand-Bold'
  },
  'text-content': {
    marginTop: 15
  },
  'container': {
    width: Dimensions.get('screen').width,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  'cover-banner': {
    height: 160,
    marginTop: 116
  }
}

const HTMLPCPSubcategoryTagStyle = {
  h2: {
    fontFamily: 'Quicksand-Bold',
    color: '#555761',
    alignItems: 'center',
    textAlign: 'center',
    width: Dimensions.get('window').width * 0.5,
    paddingHorizontal: 10,
    fontSize: 16
  },
  a: {
    fontFamily: 'Quicksand-Bold',
    color: '#555761',
    textAlign: 'center',
    textDecorationLine: 'none'
  },
  img: {
    borderRadius: 5,
    margin: 0,
    elevation: 1,
    alignSelf: 'center'
  }
}

const HTMLPCPSubcategoryClassStyle = {
  'explore-by-trending-content': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    marginBottom: 20
  },
  'explore-by-category-12grid': {
    width: Dimensions.get('window').width * 0.5,
    marginBottom: 10
  },
  'bitmap': {
    width: Dimensions.get('window').width * 0.5,
    padding: 10,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    elevation: 1,
    shadowOpacity: 1.0
  }
}

const HTMLExploreCategoryTagStyles = {
  img: {
    borderRadius: 5,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  a: {
    textDecorationLine: 'none',
    color: '#757886',
    textAlign: 'center'
  },
  h2: {
    textAlign: 'center',
    fontSize: 16
  },
  span: {
    color: 'rgb(244,251,254)'
  },
  p: {
    fontFamily: 'Quicksand-Regular',
    lineHeight: 25
  }
}

const HTMLExploreCategoryClassStyles = {
  'title-section': {
    alignItems: 'center',
    marginBottom: 15
  },
  'explore': {
    width: Dimensions.get('window').width
  },
  'row': {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  'explore-by-category-12grid': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Dimensions.get('window').width * 0.5
  },
  'bitmap': {
    marginLeft: 10,
    width: Dimensions.get('window').width
  },
  'title': {
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.5,
    padding: 10,
    marginBottom: 5
  }
}

const HTMLExploreTrendingTagStyles = {
  img: {
    borderRadius: 100,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  h2: {
    textAlign: 'center',
    fontFamily: 'Quicksand-Regular',
    fontSize: 16,
    textDecorationLine: 'none',
    color: '#757886'
  }
}

const HTMLExploreTrendingClassStyles = {
  'title-section': {
    marginBottom: 20,
    alignItems: 'center'
  },
  'explore-by-budget-content': {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 50
  },
  'explore-by-budget-5grid': {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 30,
    width: Dimensions.get('window').width * 0.5
  },
  'bitmap': {
    marginLeft: 10,
    width: Dimensions.get('window').width
  },
  'title': {
    marginTop: 5,
    marginBottom: 10
  }
}

const HTMLStaticPageClassStyles = {
  'container-card': {
    backgroundColor: '#ffffff',
    borderRadius: 4,
    padding: 25
  },
  'margin-bottom-s': {
    marginBottom: 15
  },
  'margin-top-s': {
    marginBottom: 15
  },
  'text-center': {
    textAlign: 'center'
  },
  'bold': {
    fontFamily: 'Quicksand-Bold'
  },
  'font-size-l': {
    fontSize: 18
  },
  'hr': {
    backgroundColor: '#E0E6ED',
    width: Dimensions.get('screen').width,
    height: 1
  },
  'font-size-xs': {
    fontSize: 12
  }
}

const HTMLStaticPageTagStyles = {
  ol: {
    marginBottom: 10
  },
  ul: {
    fontFamily: 'Quicksand-Regular'
  },
  p: {
    fontFamily: 'Quicksand-Regular'
  }
}

const HTMLFlashSaleTnCTagStyles = {
  p: {
    fontFamily: 'Quicksand-Regular',
    lineHeight: 24,
    fontSize: 16
  }
}

const HTMLButtonStyling = {
  'btn-primary': {
    bgColor: '#F26525',
    fontColor: '#ffffff',
    underlayColor: '#F26525',
    border: '1px solid transparent'
  },
  'btn-secondary': {
    bgColor: '#008CCF',
    fontColor: '#ffffff',
    underlayColor: '#008CCF',
    border: '1px solid transparent'
  },
  'btn-ghost-primary': {
    bgColor: '#ffffff',
    fontColor: '#555761',
    border: '1px solid #E0E6ED',
    underlayColor: '#F26525'
  },
  'btn-ghost-secondary': {
    bgColor: '#ffffff',
    fontColor: '#555761',
    border: '1px solid #E0E6ED',
    underlayColor: '#008CCF'
  },
  'btn-primary-border': {
    bgColor: '#fff',
    fontColor: '#f26525',
    border: '1px solid #f26525',
    underlayColor: '#f26525'
  },
  'btn-secondary-border': {
    bgColor: '#fff',
    fontColor: '#008CCF',
    border: '1px solid #008CCF',
    underlayColor: '#008CCF'
  },
  'btn-xs': {
    padding: '5px 15px',
    fontSize: '10px'
  },
  'btn-s': {
    padding: '5px 15px',
    fontSize: '14px'
  },
  'btn-m': {
    padding: '10px 20px',
    fontSize: '16px'
  },
  'btn-l': {
    padding: '15px 25px',
    fontSize: '16px'
  },
  'btn-xl': {
    padding: '20px 35px',
    fontSize: '16px'
  }
}

export default {
  HTMLPDPTagStyles,
  HTMLSpecialOffersTagsStyles,
  HTMLSpecialOffersClassStyles,
  HTMLPCPBannerTagsStyles,
  HTMLPCPBannerClassStyles,
  HTMLPCPBannerTagsStyles2,
  HTMLPCPBannerClassStyles2,
  HTMLPCPSubcategoryTagStyle,
  HTMLPCPSubcategoryClassStyle,
  HTMLExploreCategoryTagStyles,
  HTMLExploreCategoryClassStyles,
  HTMLExploreTrendingTagStyles,
  HTMLExploreTrendingClassStyles,
  HTMLStaticPageClassStyles,
  HTMLStaticPageTagStyles,
  HTMLFlashSaleTnCTagStyles,
  HTMLButtonStyling
}
