import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Modal, SafeAreaView, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'
import HTML from 'react-native-render-html'
// import CountDown from 'react-native-countdown-component'
import { WithContext } from '../Context/CustomContext'
import useEzFetch from '../Hooks/useEzFetch'
import { useSelector } from 'react-redux'

// Components
import Loading from './LottieComponent'
import ItemCard from '../Components/ItemCard'
import CountDownFlashSale from '../Components/CountDownFlashSale'

// Styles
import styled from 'styled-components'
import HTMLStyles from '../Styles/RNHTMLStyles'
import { fonts } from '../Styles'

const FlashSale = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [showMore, setShow] = useState(false)
  const [horizontal, setHorizontal] = useState(props.horizontal)
  const { get, fetching, data } = useEzFetch()
  const category = useSelector(state => state.category)

  useEffect(() => {
    let companyCode = props.companyCode
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? 'ace/' : (companyCode === 'HCI') ? 'informa/' : ''
    }
    let endpoint = `${bu}events?event=flash-sale&storeCode=`
    get(endpoint)
  }, [])

  const wishlistRequest = (message) => {
    props.toggleWishlist(message)
  }

  const showMoreItems = () => {
    const { promoPage } = props
    if (showMore) {
      setShow(false)
      if (promoPage) {
        setHorizontal(true)
      }
    } else {
      setShow(true)
      if (promoPage) {
        setHorizontal(false)
      }
    }
  }

  const { normalCounter, titleLeft } = props
  if (isEmpty(data) && !fetching) {
    return null
  } else if (fetching) {
    return (
      <Loading />
    )
  } else if (!fetching && !isEmpty(data.event.products)) {
    let renderItem = data.event.products
    if (!showMore) {
      renderItem = renderItem.slice(0, 6)
    }
    // const dayINeed = 4 // Thursday
    const startDate = dayjs(data.event.start_date)
    const endDate = dayjs(data.event.end_date)
    const dateTimeNow = dayjs()
    let hidePrice = false
    // let nextFlashSale = '' // COMMENTED because linting
    // if we haven't yet passed the day of the week that I need: (Haven't passed the destined date for flash sale)
    // if (moment().isoWeekday() <= dayINeed) {
    // then just give me this week's instance of that day
    // nextFlashSale = moment(moment().isoWeekday(dayINeed)).format('LL')
    // } else {
    // nextFlashSale = moment(moment().add(1, 'weeks').isoWeekday(dayINeed)).format('LL')
    // }
    if (!(dateTimeNow > startDate && dateTimeNow < endDate)) {
      hidePrice = true
    }
    const itmData = {
      itm_campaign: 'FlashSale',
      itm_source: 'Homepage'
    }
    const title = data.event.title
    const goToPCP = () => {
      let bestDeal = category.payload[_.findIndex(category.payload, { 'name': 'Best Deals' })]
      let itemDetail = {
        data: {
          url_key: bestDeal.url_key,
        },
        search: ''
      }
      props.navigation.navigate('ProductCataloguePage', {
        itemDetail, itmData
      })
    }
    return (
      <CardFlashSale>
        {(titleLeft)
          ? <FontSizeXL>
            <Bold>
              <FontWhite>
                {title}
              </FontWhite>
            </Bold>
          </FontSizeXL>
          : <Center>
            <FontSizeXL>
              {(dateTimeNow > startDate && dateTimeNow < endDate)
                ? <FontWhite>
                  {title} akan berakhir dalam
                </FontWhite>
                : <FontWhite>
                  {title} akan dimulai dalam
                </FontWhite>
              }
            </FontSizeXL>
          </Center>
        }
        {(normalCounter)
          ? null
          : <MarginVerticalS>
            <CountDownFlashSale event={data.event} />
          </MarginVerticalS>
        }
        <TouchableOpacity onPress={() => { setModalVisible(true) }}>
          <Center>
            <FontSizeS>
              <FontWhite>Syarat & Ketentuan &nbsp;
                <Icon name='help-circle' size={14} color='#FFFFFF' />
              </FontWhite>
            </FontSizeS>
          </Center>
        </TouchableOpacity>
        {(horizontal)
          ? <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data.event.products.map((itemData, index) => (
              <ItemCard itmData={itmData} hidePrice={hidePrice} wishlistRequest={wishlistRequest.bind(this)} itemData={itemData} key={`flashSale promo page${index}${itemData.url_key}`} />
            ))}
          </ScrollView>
          : <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 20, flex: 1, justifyContent: 'space-around' }}>
            {renderItem.map((itemData, index) => (
              <ItemCard itmData={itmData} hidePrice={hidePrice} fromProductList wishlistRequest={wishlistRequest.bind(this)} itemData={itemData} key={`flashSaleNumber${index}${itemData.url_key}`} />
            ))}
          </View>
        }
        {(data.event.products.length <= 6)
          ? null
          : (!showMore)
            ? <TouchableOpacity onPress={() => showMoreItems()} style={{ justifyContent: 'center', borderTopLeftRadius: 3, borderTopRightRadius: 3, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center', backgroundColor: '#008CCF', marginTop: 5 }}>
              <Bold>
                <FontSizeM>
                  <FontWhite>Lihat Semua ({data.event.products.length} items) </FontWhite>
                </FontSizeM>
              </Bold>
              <Icon
                name='chevron-down'
                color='white'
                size={24}
              />
            </TouchableOpacity>
            : <TouchableOpacity onPress={() => showMoreItems()} style={{ justifyContent: 'center', borderTopLeftRadius: 3, borderTopRightRadius: 3, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center', backgroundColor: '#008CCF', marginTop: 5 }}>
              <Bold>
                <FontSizeM>
                  <FontWhite>Tutup </FontWhite>
                </FontSizeM>
              </Bold>
              <Icon
                name='chevron-up'
                color='white'
                size={24}
              />
            </TouchableOpacity>
        }
        <TouchableOpacity onPress={() => goToPCP()} style={{ justifyContent: 'center', borderBottomLeftRadius: 3, borderBottomRightRadius: 3, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 13, alignItems: 'center', backgroundColor: '#fff', marginTop: 5 }}>
          <Bold>
            <FontSizeM>
              <FontGrey>Lihat Selengkapnya</FontGrey>
            </FontSizeM>
          </Bold>
        </TouchableOpacity>
        <Modal
          animationType='slide'
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false)
          }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ marginTop: 20 }}>
              <DistributeSpaceBetween>
                <View style={{ marginRight: 10 }}>
                  <Icon
                    name='close-circle'
                    size={28}
                    color='#ffffff'
                    style={{ alignSelf: 'flex-end' }}
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <FontSizeXL><Bold>Syarat & Ketentuan</Bold></FontSizeXL>
                </View>
                <View style={{ marginRight: 10 }}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false)
                    }}>
                    <Icon
                      name='close-circle'
                      size={28}
                      color='#D4DCE6'
                      style={{ alignSelf: 'flex-end' }}
                    />
                  </TouchableOpacity>
                </View>
              </DistributeSpaceBetween>
              <HR />
              <Container>
                <HTML
                  html={`<p>${data.event.term_conditions}</p>`}
                  tagsStyles={HTMLStyles.HTMLFlashSaleTnCTagStyles}
                />
              </Container>
            </View>
          </SafeAreaView>
        </Modal>
      </CardFlashSale>
    )
  } else if ((!data.flashSaleFetching && data.event.status === '0') || data.event.products === undefined) {
    return null
  }
}

export default WithContext(FlashSale)

const CardFlashSale = styled.View`
  background-color: #DB2B3E;
  box-shadow: 1px 1px 1px #d4dce6;
  padding:10px;
  elevation: 1;
  margin-bottom:15px;
`
const Center = styled.View`
  align-items: center;
`
const FontSizeXL = styled.Text`
  font-size: 20px !important;
  color: #555761;
  line-height: 28px;
`
const Bold = styled.Text`
  font-family:${fonts.bold} !important;
  color: #757886;
`
const FontWhite = styled.Text`
  color:white !important;
  font-family:${fonts.bold};
`
const MarginVerticalS = styled.View`
  margin-vertical: 15px;
`
const FontSizeS = styled.Text`
  font-size: 14px !important;
  color: #555761;
  line-height: 16px;
  font-family:${fonts.regular};
`
const FontSizeM = styled.Text`
  font-size: 16px !important;
  color: #555761;
  line-height: 16px;
  font-family:${fonts.regular};
`
const DistributeSpaceBetween = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`
const HR = styled.View`
  border: 0.5px solid #e5e9f2;
  margin-top: 10px;
  margin-bottom: 10px;
`
const Container = styled.View`
  padding: 10px;
  flex-direction: column;
`
const FontGrey = styled.Text`
  color:grey !important;
  font-family:${fonts.bold};
`
