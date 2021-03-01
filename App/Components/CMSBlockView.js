import React, { PureComponent, Fragment } from 'react'
import { View, Text, TouchableWithoutFeedback, ScrollView, Image, Linking, Clipboard, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import { Navigate, Push } from '../Services/NavigationService'
import { View as ViewAnimated } from 'react-native-animatable'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'
import EasyModal from '../Components/EasyModal'
import HTML from 'react-native-render-html'
import Snackbar from '../Components/SnackbarComponent'
import { WithParent } from '../FamilyState/store/pcpStore'
import analytics from '@react-native-firebase/analytics'

import LottieComponent from '../Components/LottieComponent'

// Styles
import styles from './Styles/AppStyles'
import htmlStyles from '../Styles/RNHTMLStyles'
import { PrimaryTextMedium, fonts, colors } from '../Styles'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('screen')
class CMSBlockView extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isfetched: [],
      urlKey: '',
      tncContainer: {
        button: {
          buttonColor: '',
          buttonLink: '',
          buttonPageDirectory: '',
          buttonText: '',
          buttonUrlKey: '',
          categoryID: ''
        },
        tncDescription: [],
        tncTitle: '',
        useTnc: false,
        voucher: ''
      },
      shouldPersistData: false
    }
  }

  _handleAnalytic = (data) => {
    // Firebase Analytic view_promotion
    let analyticData = {
      promotion_id: data.url_key,
      promotion_name: 'data.name'
    }
    const promoPathList = [
      'promotions',
      'promo-brand'
    ]
    const promoPath = data.url_key.split('/')
    if (promoPathList.some(i => promoPath.includes(i))) return analytics().logViewPromotion(analyticData)
    return analytics().logSelectContent({ content_type: 'category', item_id: data.url_key })
  }

  itemPressed (item) {
    this._handleAnalytic(item)
    let itemDetail = {
      data: {
        url_key: item.url_key
      },
      search: ''
    }
    if (item.dir === 'Browser') {
      Linking.openURL(item.target_link)
    } else {
      Push(item.dir, {
        itemDetail
      })
    }
  }

  grid2 (content) {
    const { tahu } = this.props
    return (
      <View style={[styles.flexRowWrap, { marginTop: 10 }]}>
        {(!tahu.fetchingCmsBlock)
          ? map(content, (item, index) => (
            <ViewAnimated key={`cms grid2 ${index}`} delay={index / 10} useNativeDriver animation='fadeInUpBig' easing='ease-out-expo'>
              <TouchableOpacity onPress={() => this.itemPressed(item)}>
                <View style={styles.layoutCmsBlockContainer}>
                  <FastImage
                    source={{
                      uri: item.image,
                      cache: FastImage.cacheControl.web
                    }}
                    style={styles.layoutImageFirst}
                  />
                  {!isEmpty(item.title) && <Text style={styles.cmsItemTitle}>{item.title}</Text>}
                </View>
              </TouchableOpacity>
            </ViewAnimated>
          ))
          : <LottieComponent />
        }
      </View>
    )
  }

  column (content) {
    const { tahu } = this.props
    // const { isfetched } = this.state
    return (
      <View style={styles.cmsContainer}>
        {(!tahu.fetchingCmsBlock)
          ? map(content, (item, index) => (
            <ViewAnimated key={`cms column ${index}`} delay={index / 10} useNativeDriver animation='fadeInUpBig' easing='ease-out-expo' >
              <TouchableWithoutFeedback onPress={() => this.itemPressed(item)} >
                <View style={styles.layoutCmsBlockContainer_column}>
                  <View style={styles.ViewImageText}>
                    <FastImage
                      source={{ uri: item.image }}
                      style={{ width: width * 0.1, height: width * 0.1 }}
                    />
                    {!isEmpty(item.title) && <Text style={styles.cmsItemTitle}>{item.title}</Text>}
                  </View>
                  <View>
                    <Icon name='arrow-right' size={20} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </ViewAnimated>
          ))
          : <LottieComponent />
        }
      </View>
    )
  }

  copyToClipboard = (code) => {
    Clipboard.setString(code)
    this.modal.call('Berhasil menyalin voucher')
  }

  showTnc = (data) => {
    this.setState({
      tncContainer: {
        button: {
          buttonColor: data.button.buttonColor,
          buttonLink: data.button.buttonLink,
          buttonPageDirectory: data.button.buttonPageDirectory,
          buttonText: data.button.buttonText,
          buttonUrlKey: data.button.buttonUrlKey,
          categoryID: data.button.categoryID
        },
        tncDescription: data.tncDescription,
        tncTitle: data.tncTitle,
        useTnc: data.useTnc,
        voucher: data.voucher
      }
    }
    )
    this.tncModal.setModal(true)
  }
  btnPressed = (tncDir, tncUrlKey) => {
    const itemData = {
      url_key: tncUrlKey
    }
    const itemDetail = {
      data: {
        url_key: tncUrlKey
      },
      search: ''
    }
    this.tncModal.setModal(false)
    Navigate(tncDir, { itemData, itemDetail })
  }

  insideTnc = () => {
    const { tncContainer } = this.state
    return (
      <EasyModal ref={(ref) => { this.tncModal = ref }} >
        <ModalContainer>
          <ModalHeader>
            <ModalTitle>{tncContainer.tncTitle}</ModalTitle>
            <ModalCloseIcon onPress={() => { this.tncModal.setModal(false) }}>
              <Icon name='close' size={24} />
            </ModalCloseIcon>
          </ModalHeader>
          <ScrollView>
            <ModalContent>
              {(tncContainer.voucher !== '') &&
                <VoucherContent>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', width: 30, height: 30, marginLeft: -15, marginRight: 15 }}>
                      <Square />
                      <Circle />
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                      <PrimaryTextMedium>Kode Promo</PrimaryTextMedium>
                      <Text style={{ fontFamily: fonts.bold, fontSize: 16 }}>{tncContainer.voucher}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.copyToClipboard(tncContainer.voucher)}>
                      <Icon name={'content-copy'} size={30} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', width: 30, height: 30, marginRight: -15, marginLeft: 15 }}>
                      <Square style={{ right: 0 }} />
                      <Circle />
                    </View>
                  </View>
                </VoucherContent>
              }
              <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <View>
                  {(!isEmpty(tncContainer.tncDescription[0])) &&
                    <HTML
                      allowedStyles={[]}
                      html={tncContainer.tncDescription[0]}
                      tagsStyles={{ ins: { textDecorationLine: 'underline' }, li: { fontFamily: fonts.medium, width: '90%' }, strong: { fontFamily: fonts.bold }, b: { fontFamily: fonts.bold }, img: { alignSelf: 'center' }, p: { height: 30 } }}
                      ignoredStyles={['width', 'height', 'font-weight']}
                      ignoredTags={['span']}
                    />
                  }
                </View>
                <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                  {tncContainer.button.buttonText !== '' || !isEmpty(tncContainer.button.buttonText)
                    ? this.buttonList(tncContainer.button)
                    : null
                  }
                </View>
              </View>
            </ModalContent>
          </ScrollView>
        </ModalContainer>
        <Snackbar ref={ref => { this.modal = ref }} />
      </EasyModal>
    )
  }
  buttonList = (data) => {
    // Declaring stylings
    const buttonStyling = {
      'primary-flat': ButtonPrimary,
      'secondary-flat': ButtonSecondary,
      'primary-ghost': ButtonGhostPrimary,
      'secondary-ghost': ButtonGhostSecondary,
      'primary-border': ButtonBorderPrimary,
      'secondary-border': ButtonBorderSecondary
    }
    const textStyling = {
      'primary-flat': ButtonTextPrimary,
      'secondary-flat': ButtonTextSecondary,
      'primary-ghost': ButtonGhostTextPrimary,
      'secondary-ghost': ButtonGhostTextSecondary,
      'primary-border': ButtonBorderTextPrimary,
      'secondary-border': ButtonBorderTextSecondary
    }
    let ButtonComponent = ButtonPrimary
    let TextComponent = ButtonTextPrimary
    if (!isEmpty(data.buttonColor)) {
      ButtonComponent = buttonStyling[data.buttonColor]
      TextComponent = textStyling[data.buttonColor]
    }

    return (
      <ButtonComponent onPress={() => this.btnPressed(data.buttonPageDirectory, data.buttonUrlKey)}>
        <TextComponent>{data.buttonText}</TextComponent>
      </ButtonComponent>
    )
  }

  formHeader (headerdescription, typeheader) {
    return (
      <>
        {(headerdescription.click.clickTitle === true && headerdescription.title !== '') &&
          <Text style={{ fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10, fontSize: 20, color: `${typeheader === 'coverBanner' ? 'white' : '#757885'}` }}>
            {headerdescription.title}
          </Text>
        }
        {(headerdescription.click.clickDesc === true && headerdescription.description_header !== '') &&
          <HTML
            // onLinkPress={(evt, href) => { this.onLinkPress(href) }}
            allowedStyles={[]}
            html={headerdescription.description_header}
            imagesMaxWidth={Dimensions.get('screen').width * 0.45}
            classesStyles={htmlStyles.HTMLExploreCategoryClassStyles}
            tagsStyles={htmlStyles.HTMLExploreCategoryTagStyles}
          />
          // <Text style={{ fontFamily: fonts.regular, textAlign: `${typeheader === 'coverBanner' ? 'center' : 'left'}`, marginBottom: 10, fontSize: 14, color: `${typeheader === 'coverBanner' ? 'white' : ''}` }}>
          //   {}
          // </Text>
        }
        {(headerdescription.click.clickTerm === true) &&
          <TouchableOpacity onPress={() => this.showTnc(headerdescription.tncContainer)}>
            <Text style={{ fontFamily: fonts.regular, textAlign: 'center', marginBottom: 10, fontSize: 14, color: `${typeheader === 'coverBanner' ? 'white' : '#757885'}` }}>
              Syarat dan Ketentuan
              <Icon name='help-circle' size={14} color={typeheader === 'coverBanner' ? '#FFFFFF' : colors.primary} />
            </Text>
          </TouchableOpacity>
        }
        {(headerdescription.click.clickTerm === true) &&
          this.insideTnc()
        }
        {(headerdescription.click.clickButton === true && headerdescription.button.buttonText !== '') &&
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {this.buttonList(headerdescription.button)}
          </View>
        }
      </>
    )
  }

  imageHeaderPressed = (headerDescription) => {
    if (headerDescription.imageAction === 'tnc') {
      this.showTnc(headerDescription.tncContainer)
    } else if (headerDescription.imageAction === 'redirect') {
      let dir = headerDescription.dir
      if (!isEmpty(dir)) {
        if (dir.toLowerCase() === 'browser') {
          Linking.openURL(headerDescription.urlLink)
        } else {
          let itemData = {
            url_key: headerDescription.urlKey
          }
          let itemDetail = {
            data: {
              url_key: headerDescription.urlKey
            },
            search: ''
          }
          let itmData = {
            itm_source: 'cms-block',
            itm_campaign: 'popular-banner-promo',
            promo: headerDescription.urlKey
          }
          Navigate(dir, { itemData, itemDetail, itmData })
        }
      }
    }
  }

  headerDescription (data) {
    return (
      data.map((headerdescription, indexheader) => {
        if (headerdescription.type_header === 'customBanner') {
          if (headerdescription.click.clickTitle === false && headerdescription.click.clickDesc === false && headerdescription.click.clickTerm === false && headerdescription.click.clickButton === false) {
            return (
              <Fragment key={`header index ${indexheader}`}>
                <TouchableWithoutFeedback onPress={() => this.imageHeaderPressed(headerdescription)}>
                  <Image style={{ width: width, height: (width) / (headerdescription.imageWidth === '' ? 640 : Number(headerdescription.imageWidth)) * (headerdescription.imageHeight === '' ? 160 : Number(headerdescription.imageHeight)), padding: 20 }} source={{ uri: `${headerdescription.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
                </TouchableWithoutFeedback>
                {(headerdescription.imageAction === 'tnc') && this.insideTnc()}
              </Fragment>
            )
          } else {
            return (
              <View style={{ position: 'relative', marginBottom: 20 }} key={`header index ${indexheader}`}>
                <TouchableWithoutFeedback onPress={() => this.imageHeaderPressed(headerdescription)}>
                  <Image style={{ width: width, height: (width) / (headerdescription.imageWidth === '' ? 640 : Number(headerdescription.imageWidth)) * (headerdescription.imageHeight === '' ? 160 : Number(headerdescription.imageHeight)), padding: 20 }} source={{ uri: `${headerdescription.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
                </TouchableWithoutFeedback>
                <View style={{ width: width, display: 'flex', justifyContent: 'space-between', padding: 20 }}>
                  {this.formHeader(headerdescription, headerdescription.type_header)}
                  {(headerdescription.imageAction === 'tnc') && this.insideTnc()}
                </View>
              </View>
            )
          }
        } else if (headerdescription.type_header === 'coverBanner') {
          return (
            <View style={{ position: 'relative', marginBottom: 20 }} key={`header index ${indexheader}`}>
              <ImageBackground style={{ width: width, height: (width) / (headerdescription.imageWidth === '' ? 640 : Number(headerdescription.imageWidth)) * (headerdescription.imageHeight === '' ? 360 : Number(headerdescription.imageHeight)), padding: 20 }} source={{ uri: `${headerdescription.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
              <View style={{ width: width, height: (width) / (headerdescription.imageWidth === '' ? 640 : Number(headerdescription.imageWidth)) * (headerdescription.imageHeight === '' ? 360 : Number(headerdescription.imageHeight)), position: 'absolute', opacity: 0.3, backgroundColor: 'black' }} />
              <View style={{ width: width, height: (width) / (headerdescription.imageWidth === '' ? 640 : Number(headerdescription.imageWidth)) * (headerdescription.imageHeight === '' ? 360 : Number(headerdescription.imageHeight)), display: 'flex', justifyContent: 'space-evenly', position: 'absolute', top: 0, left: 0, padding: 20 }}>
                {this.formHeader(headerdescription, headerdescription.type_header)}
              </View>
            </View>
          )
        } else {
          return null
        }
      }
      )
    )
  }
  copyToClipboard = (code) => {
    Clipboard.setString(code)
    this.modal.call('Berhasil menyalin voucher')
  }

  showTnc = (data) => {
    this.setState({
      tncContainer: {
        button: {
          buttonColor: data.button.buttonColor,
          buttonLink: data.button.buttonLink,
          buttonPageDirectory: data.button.buttonPageDirectory,
          buttonText: data.button.buttonText,
          buttonUrlKey: data.button.buttonUrlKey,
          categoryID: data.button.categoryID
        },
        tncDescription: data.tncDescription,
        tncTitle: data.tncTitle,
        useTnc: data.useTnc,
        voucher: data.voucher
      }
    }
    )
    this.tncModal.setModal(true)
  }

  render () {
    const { tahu } = this.props
    let dataCmsBlock = tahu.dataCmsBlock || {}
    if (!isEmpty(tahu.dataCmsBlockPersistent) && isEmpty(dataCmsBlock)) {
      dataCmsBlock = tahu.dataCmsBlockPersistent
    }
    if (Number(dataCmsBlock.status || '0') !== 10) return null
    return (
      <>
        {!isEmpty(dataCmsBlock.header_description) &&
          <ViewAnimated useNativeDriver animation='fadeInUpBig' easing='ease-out-expo'>
            {this.headerDescription(dataCmsBlock.header_description)}
          </ViewAnimated>
        }
        {Number(dataCmsBlock.page_layout) === 0
          ? this.grid2(dataCmsBlock.content)
          : this.column(dataCmsBlock.content)
        }
      </>
    )
  }
}
const shouldNotUpdate = (prevProps, nextProps) => (prevProps.state.tahu.dataCmsBlock === nextProps.state.tahu.dataCmsBlock)

export default WithParent(React.memo(CMSBlockView, shouldNotUpdate))

const ModalContainer = styled.View`
  flex-direction: column;
  flex: 1;
`
const ModalHeader = styled.View`
  flex-direction: row;
  padding-vertical: 15px;
  justify-content: center;
  width: ${width};
  border-bottom-width: 1;
  border-bottom-color: #D4DCE6;
`
const ModalTitle = styled.Text`
  padding-horizontal: 38px;
  text-align: center;
  font-family: ${fonts.bold};
  font-size: 20px;
  color: #757885;
`
const ModalCloseIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15;
  top: 15;
`
const ModalContent = styled.View`
  padding: 10px;
`
const VoucherContent = styled.View`
  backgroundColor:#E5F7FF;
  width: 320;
  height: 80;
  marginBottom: 10px;
  alignSelf: center;
  justifyContent: space-between;
  alignItems: center;
  flexDirection: row;
  borderStyle: dotted;
  borderWidth: 2;
  borderRadius: 1;
`

const Square = styled.View`
  position: absolute;
  width: 15;
  height: 30;
  zIndex: 1;
  backgroundColor: white;
`

const Circle = styled.View`
  backgroundColor: white;
  width: 30;
  height: 30;
  borderWidth: 2;
  borderRadius: 15;
  zIndex:0;
  borderStyle: dotted;
`
const ButtonPrimary = styled.TouchableOpacity`
  backgroundColor: ${colors.secondary};
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`

const ButtonTextPrimary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: white;
`
const ButtonSecondary = styled.TouchableOpacity`
  backgroundColor: #008CCF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
`

const ButtonTextSecondary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: white;
`

const ButtonBorderSecondary = styled.TouchableOpacity`
  backgroundColor: #FFFFFF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
  border: 1px solid #008CCF;
`

const ButtonBorderTextSecondary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: #008CCF;
`

const ButtonBorderPrimary = styled.TouchableOpacity`
  backgroundColor: #FFFFFF;
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
  border: 1px solid ${colors.secondary};
`

const ButtonBorderTextPrimary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: ${colors.secondary};
`

const ButtonGhostSecondary = styled.TouchableOpacity`
  backgroundColor: 'rgba(255, 255, 255, 0.1)';
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
  border: 1px solid #008CCF;
`

const ButtonGhostTextSecondary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: #008CCF;
`

const ButtonGhostPrimary = styled.TouchableOpacity`
backgroundColor: 'rgba(255, 255, 255, 0.1)';
  borderRadius: 5;
  padding: 10px;
  marginBottom: 10px;
  border: 1px solid ${colors.secondary};
`

const ButtonGhostTextPrimary = styled.Text`
  fontFamily: ${fonts.bold};
  textAlign: center;
  color: ${colors.secondary};
`
