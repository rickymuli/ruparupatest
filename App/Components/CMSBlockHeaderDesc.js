import React, { PureComponent, Fragment } from 'react'
import { View, Text, TouchableWithoutFeedback, ScrollView, Image, Linking, Clipboard, TouchableOpacity, Dimensions, ImageBackground } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import map from 'lodash/map'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'
import EasyModal from '../Components/EasyModal'
import HTML from 'react-native-render-html'
import Snackbar from '../Components/SnackbarComponent'
import { Push } from '../Services/NavigationService'

// Styles
import htmlStyles from '../Styles/RNHTMLStyles'
import { fonts, colors, PrimaryTextMedium } from '../Styles'

const { width } = Dimensions.get('screen')
export default class CMSBlockHeaderDesc extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
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
      }
    }
  }

    copyToClipboard = (code) => {
      Clipboard.setString(code)
      this.modal.call('Berhasil menyalin voucher')
    }

    btnPressed = (tncDir, tncUrlKey) => {
      if (tncDir.toLowerCase() === 'browser' || tncDir === 'StaticPage') {
        Linking.openURL(tncUrlKey)
      } else {
        const itemData = {
          url_key: tncUrlKey
        }
        const itemDetail = {
          data: {
            url_key: tncUrlKey
          },
          search: ''
        }
        Push(tncDir, { itemData, itemDetail })
      }
      this.tncModal.setModal(false)
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

    formHeader = (item, typeheader) => {
      // Remove Tag Span for safety measures if html sends in string with tag span
      let regexSpanWithAttr = /<span [^>]*>/g
      let result = item.description_header
      let spanPresent = regexSpanWithAttr.test(result)
      if (spanPresent) {
        let spanArr = result.match(regexSpanWithAttr)
        spanArr.map((spanData) => {
          result = result.replace(spanData, '')
          result = result.replace('</span>', '')
        })
      }
      if (result.includes('<span>')) {
        result = result.replace('<span>', '')
        result = result.replace('</span>', '')
      }
      // ==============================================================================
      // Change html text into white if it a cover banner
      let htmlTagStyle = { ...htmlStyles.HTMLExploreCategoryTagStyles }
      let p = { ...htmlTagStyle.p }
      if (item.type_header === 'coverBanner') {
        p.color = '#ffffff'
        htmlTagStyle.p = p
      }
      // ==============================================================================
      return (
        <>
          {(item.click.clickTitle === true && item.title !== '') &&
          <Text style={{ fontFamily: fonts.bold, textAlign: 'center', marginBottom: 10, fontSize: 20, color: `${typeheader === 'coverBanner' ? 'white' : '#757885'}` }}>
            {item.title}
          </Text>
          }
          {(item.click.clickDesc === true && item.description_header !== '') &&
          <HTML
            // onLinkPress={(evt, href) => { this.onLinkPress(href) }}
            allowedStyles={[]}
            html={result}
            imagesMaxWidth={Dimensions.get('screen').width * 0.45}
            classesStyles={htmlStyles.HTMLExploreCategoryClassStyles}
            tagsStyles={htmlTagStyle}
          />
          }
          {(item.click.clickTerm === true) &&
          <TouchableOpacity onPress={() => this.showTnc(item.tncContainer)}>
            <Text style={{ fontFamily: fonts.regular, textAlign: 'center', marginBottom: 10, fontSize: 14, color: `${typeheader === 'coverBanner' ? 'white' : '#757885'}` }}>
              Syarat dan Ketentuan
              <Icon name='help-circle' size={14} color={typeheader === 'coverBanner' ? '#FFFFFF' : colors.primary} />
            </Text>
          </TouchableOpacity>
          }
          {(item.click.clickTerm === true) &&
            this.insideTnc()
          }
          {(item.click.clickButton === true && item.button.buttonText !== '') &&
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {this.buttonList(item.button)}
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
            let companyName = (this.props.companyCode === 'AHI') ? 'ace' : (this.props.companyCode === 'HCI') ? 'informa' : ''
            let newUrlKey = (headerDescription.urlKey.startsWith(`${companyName}`)) ? headerDescription.urlKey.substr(companyName.length + 1, headerDescription.urlKey.length) : headerDescription.urlKey
            let itemDetail = {
              data: {
                url_key: newUrlKey,
                company_code: this.props.companyCode
              },
              search: ''
            }
            let itmData = {
              itm_source: 'cms-block',
              itm_campaign: 'popular-banner-promo',
              promo: headerDescription.urlKey
            }
            Push(dir, { itemData, itemDetail, itmData })
          }
        }
      }
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

      customBanner (item, indexheader) {
        if (item.click.clickTitle === false && item.click.clickDesc === false && item.click.clickTerm === false && item.click.clickButton === false) {
          return (
            <Fragment key={`header index ${indexheader}`}>
              <TouchableWithoutFeedback onPress={() => this.imageHeaderPressed(item)}>
                <Image style={{ width: width, height: (width) / (item.imageWidth === '' ? 640 : Number(item.imageWidth)) * (item.imageHeight === '' ? 160 : Number(item.imageHeight)), padding: 20 }} source={{ uri: `${item.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
              </TouchableWithoutFeedback>
              {(item.imageAction === 'tnc') && this.insideTnc()}
            </Fragment>
          )
        } else {
          return (
            <View style={{ position: 'relative', marginBottom: (item.length > 1) ? 20 : 0 }} key={`header index ${indexheader}`}>
              {!isEmpty(item.imageURL) && <TouchableWithoutFeedback onPress={() => this.imageHeaderPressed(item)}>
                <Image style={{ width: width, height: (width) / (item.imageWidth === '' ? 640 : Number(item.imageWidth)) * (item.imageHeight === '' ? 160 : Number(item.imageHeight)), padding: 20 }} source={{ uri: `${item.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
              </TouchableWithoutFeedback>}
              <View style={{ width: width, display: 'flex', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                {this.formHeader(item, item.type_header)}
                {(item.imageAction === 'tnc') && this.insideTnc()}
              </View>
            </View>
          )
        }
      }

      coverBanner (item, indexheader) {
        return (
          <View style={{ position: 'relative', marginBottom: (item.length > 1) ? 20 : 0 }} key={`header index ${indexheader}`}>
            <ImageBackground style={{ width: width, height: (width) / (item.imageWidth === '' ? 640 : Number(item.imageWidth)) * (item.imageHeight === '' ? 360 : Number(item.imageHeight)), padding: 20 }} source={{ uri: `${item.imageURL.replace('f_auto,fl_lossy,q_auto/w_640/', '')}` }} />
            <View style={{ width: width, height: (width) / (item.imageWidth === '' ? 640 : Number(item.imageWidth)) * (item.imageHeight === '' ? 360 : Number(item.imageHeight)), position: 'absolute', opacity: 0.3, backgroundColor: 'black' }} />
            <View style={{ width: width, height: (width) / (item.imageWidth === '' ? 640 : Number(item.imageWidth)) * (item.imageHeight === '' ? 360 : Number(item.imageHeight)), display: 'flex', justifyContent: 'space-evenly', position: 'absolute', top: 0, left: 0, padding: 20 }}>
              {this.formHeader(item, item.type_header)}
            </View>
          </View>
        )
      }

      render () {
        const { headerdescription } = this.props
        return (
          <View style={{ flex: 1 }}>
            {
              map(headerdescription, (item, indexheader) => {
                if (item.type_header === 'customBanner') return this.customBanner(item, indexheader)
                else if (item.type_header === 'coverBanner') return this.coverBanner(item, indexheader)
                else return null
              })
            }
          </View>
        )
      }
}

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
  background-color:#E5F7FF;
  width: 320px;
  height: 80px;
  margin-bottom: 10px;
  align-self: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  border-style: dotted;
  border-width: 2px;
  border-radius: 1px;
`

const Square = styled.View`
  position: absolute;
  width: 15;
  height: 30;
  zIndex: 1;
  background-color: white;
`

const Circle = styled.View`
  background-color: white;
  width: 30px;
  height: 30px;
  border-width: 2px;
  border-radius: 15px;
  z-index:0px;
  border-style: dotted;
`
const ButtonPrimary = styled.TouchableOpacity`
  background-color: ${colors.secondary};
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
`

const ButtonTextPrimary = styled.Text`
  font-family: ${fonts.bold};
  text-align: center;
  color: white;
`
const ButtonSecondary = styled.TouchableOpacity`
  background-color: #008CCF;
  border-radius: 5;
  padding: 10px;
  margin-bottom: 10px;
`

const ButtonTextSecondary = styled.Text`
  font-family: ${fonts.bold};
  text-align: center;
  color: white;
`

const ButtonBorderSecondary = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #008CCF;
`

const ButtonBorderTextSecondary = styled.Text`
  font-family: ${fonts.bold};
  text-align: center;
  color: #008CCF;
`

const ButtonBorderPrimary = styled.TouchableOpacity`
  background-color: #FFFFFF;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
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
