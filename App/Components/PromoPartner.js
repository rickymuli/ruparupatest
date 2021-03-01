import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView, Clipboard } from 'react-native'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'

// Components
import LottieComponent from './LottieComponent'
import EasyModal from './EasyModal'
import SnackbarComponent from '../Components/SnackbarComponent'

// Redux
import PromoActions from '../Redux/PromoRedux'

const { width } = Dimensions.get('screen')
class PromoPartner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      terms: [],
      tempData: {}
    }
  }

  componentDidMount () {
    this.props.promoPartnerRequest('promoPartnerMobile', '1')
  }

  calltnc (data) {
    this.setState({ terms: data.tnc, tempData: data }, () => {
      this.refs.tnc.setModal()
    })
  }

  copyToClipboard = (code) => {
    Clipboard.setString(code)
    this.refs.child.call('Berhasil menyalin voucher')
  }

  goToPCP = (urlKey) => {
    let itemDetail = {
      data: {
        url_key: urlKey
      },
      search: ''
    }
    this.refs.tnc.setModal(false)
    this.props.navigation.navigate('ProductCataloguePage', {
      itemDetail
    })
  }

  render () {
    const { promoPartner, fetchingPromoPartner } = this.props.promo
    const { terms, tempData } = this.state
    return (
      <View style={{ paddingHorizontal: 10 }}>
        {fetchingPromoPartner
          ? <LottieComponent />
          : promoPartner &&
         promoPartner.map((data, index) =>
           (
             <TouchableOpacity key={`card ${index}`} style={{ justifyContent: 'center', marginBottom: 10 }} onPress={() => this.calltnc(data)}>
               <Image source={{ uri: data.img_src }} resizeMode='contain' style={{ height: (width * 0.95 / 720) * 300, width: width * 0.95 }} />
             </TouchableOpacity>
           ))
        }
        <EasyModal ref='tnc'>
          <ModalContainer>
            <ModalHeader>
              <ModalTitle>{'Syarat & Ketentuan'}</ModalTitle>
              <ModalCloseIcon onPress={() => { this.refs.tnc.setModal() }}>
                <Icon name='close' size={24} />
              </ModalCloseIcon>
            </ModalHeader>
            <ScrollView>
              <ModalContent>
                {(!isEmpty(terms))
                  ? terms.map((rowTerm, index) => (
                    <View key={`tnc row ${index}`}>
                      <ModalHeader2>{rowTerm.title}</ModalHeader2>
                      {rowTerm.tnc.map((term, index) => (
                        <Row key={`terms and condition promo ${index} ${term.text}`}>
                          <Column>
                            <RowNoPadding>
                              <NumberContainer>
                                <NumberText>{index + 1}.</NumberText>
                              </NumberContainer>
                              <TncContainer>
                                {(!isEmpty(term.text))
                                  ? <TncText>{term.text}</TncText>
                                  : (!isEmpty(term.img_src))
                                    ? <Image source={{ uri: term.img_src }} style={{ width: '100%', height: (Dimensions.get('screen').width * 0.4) / 1280 * 320 }} />
                                    : null
                                }
                              </TncContainer>
                            </RowNoPadding>
                            {(!isEmpty(term.extra_info))
                              ? term.extra_info.map((info, index) => (
                                <RowNoPadding key={`extra info ${index} ${info.counter}`}>
                                  <NumberContainer>
                                    <NumberText>  {info.counter}</NumberText>
                                  </NumberContainer>
                                  <TncContainer>
                                    <TncText style={{ fontFamily: 'Quicksand-Regular', fontSize: 14, lineHeight: 20 }}>{info.text}</TncText>
                                  </TncContainer>
                                </RowNoPadding>
                              ))
                              : null
                            }
                          </Column>
                        </Row>
                      ))}
                    </View>
                  ))
                  : null
                }
              </ModalContent>
              {tempData.code
                ? <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                  <TouchableOpacity onPress={() => this.copyToClipboard(tempData.code)} style={{ borderWidth: 1, borderColor: '#E5E9F2', padding: 10, width: Dimensions.get('screen').width * 0.40, borderRadius: 4, marginRight: 5 }}>
                    <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 16 }}>{tempData.code}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.copyToClipboard(tempData.code)} style={{ backgroundColor: '#F26524', width: 80, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                    <Text style={{ fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 16 }}>Salin <Icon name='content-copy' size={20} color='white' /></Text>
                  </TouchableOpacity>
                </View>
                : null
              }
              {/* {tempData.url_key &&
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                <TouchableOpacity onPress={() => this.goToPCP(tempData.url_key)} style={{ backgroundColor: '#F26524', width: width * 0.60, height: 40, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Quicksand-Regular', color: 'white', fontSize: 16 }}>Pergi ke halaman</Text>
                </TouchableOpacity>
              </View>
              } */}
            </ScrollView>
          </ModalContainer>
          <SnackbarComponent ref='child' />
        </EasyModal>
      </View>
    )
  }
}

const mapStateFromProps = (state) => ({
  promo: state.promo
})

const mapDispatchToProps = (dispatch) => ({
  promoPartnerRequest: (position, grid) => dispatch(PromoActions.promoPartnerRequest(position, grid))
})

export default connect(mapStateFromProps, mapDispatchToProps)(PromoPartner)

const ModalContainer = styled.View`
  flex-direction: column;
  flex: 1;
`
const ModalHeader = styled.View`
  flex-direction: row;
  padding-vertical: 15px;
  justify-content: center;
  width: ${Dimensions.get('screen').width};
  border-bottom-width: 1;
  border-bottom-color: #D4DCE6;
`
const ModalTitle = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 20px;
`
const ModalCloseIcon = styled.TouchableOpacity`
  position: absolute;
  right: 15;
  top: 15;
`
const ModalContent = styled.View`
  padding: 10px;
`
const ModalHeader2 = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 18px;
  margin-bottom: 10px;
`

const Row = styled.View`
  flex-direction: row;
  margin-bottom: 10px;
`
const NumberContainer = styled.View`
  width: ${Dimensions.get('screen').width * 0.1};
  align-items: center;
`
const NumberText = styled.Text`
  font-family: Quicksand-Bold;
  font-size: 16px;
`
const TncContainer = styled.View`
  width: ${Dimensions.get('screen').width * 0.8};
  flex-wrap: wrap;
`
const TncText = styled.Text`
  font-family: Quicksand-Regular;
  font-size: 16px;
`
const Column = styled.View`
  flex-direction: column;
`
const RowNoPadding = styled.View`
  flex-direction: row;
`
