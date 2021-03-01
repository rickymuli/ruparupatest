import React, { useState, useEffect } from 'react'
import { ScrollView, View, TouchableOpacity, Text } from 'react-native'
import CountDown from 'react-native-countdown-component'
import Modal from 'react-native-modal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import { WithContext } from '../Context/CustomContext'
import useEzFetch from '../Hooks/useEzFetch'
import { fonts } from '../Styles'

// Component
import ItemCard from '../Components/ItemCard'

// Styles
import styled from 'styled-components'

const DailyDeals = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const { get, fetching, data } = useEzFetch()

  useEffect(() => {
    let companyCode = props.companyCode
    let bu = ''
    if (!isEmpty(companyCode)) {
      bu = (companyCode === 'AHI') ? 'ace/' : (companyCode === 'HCI') ? 'informa/' : ''
    }
    let endpoint = `${bu}events?event=daily-deals&storeCode=`
    get(endpoint)
  }, [])

  const wishlistRequest = (message) => {
    props.toggleWishlist(message)
  }

  const tncRender = () => {
    const regex = /(<([^>]+)>)/ig
    const termAndCondition = data.event.term_conditions.replace(regex, '')
    return (
      <View>
        <TouchableOpacity activeOpacity={0.5} onPress={() => setModalVisible(true)}>
          <MarginHorizontalS>
            <FontBlack>
              Syarat & Ketentuan
            </FontBlack>
            <Icon
              raised
              name='help-circle'
              size={20}
              color='#555761'
            />
          </MarginHorizontalS>
        </TouchableOpacity>
        <Modal
          swipeDirection={'up'}
          swipeThreshold={90}
          onSwipeComplete={() => setModalVisible(false)}
          backdropTransitionOutTiming={300}
          backdropTransitionInTiming={300}
          isVisible={modalVisible}
          animationIn={'slideInDown'}
          animationOut={'slideOutUp'}
          animationType={'fade'}
          onBackdropPress={() => setModalVisible(false)}
        >
          <View style={{ backgroundColor: 'white', padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
            <FontXLBlack>
              Syarat & Ketentuan
            </FontXLBlack>
            <Text>
              {termAndCondition}
            </Text>
          </View>
        </Modal>
      </View>
    )
  }

  if (fetching || isEmpty(data)) {
    return null
  } else if (!fetching && data.event.status !== '0' && !isEmpty(data.event.products)) {
    const endDate = dayjs(data.event.end_date)
    const dateTimeNow = dayjs()
    // Getting time in seconds for countdown
    let time = dayjs.duration(Math.floor(endDate - dateTimeNow)).asSeconds()
    const title = data.event.title
    const itmData = { itm_campaign: 'DailyDeals', itm_source: 'Homepage' }
    return (
      <CardDailyDeals>
        <DistributeSpaceBetween>
          <FontSizeXL>
            <Icon
              name='shopping'
              size={28}
              color='#555761'
            />
            <FontBlack>
              {title}
            </FontBlack>
          </FontSizeXL>
          <MarginVerticalS>
            <CountDown
              until={time}
              size={18}
              timeToShow={['H', 'M', 'S']}
              digitStyle={{ backgroundColor: '#555761' }}
              digitTxtStyle={{ color: 'white' }}
              timeLabels={{ h: null, m: null, s: null }}
            />
          </MarginVerticalS>
          {!isEmpty(data.event.term_conditions) && tncRender()}
        </DistributeSpaceBetween>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {data.event.products.map((itemData, index) => (
            <ItemCard itmData={itmData} wishlistRequest={wishlistRequest} itemData={itemData} key={`dailyDealsNumber${index}${itemData.url_key}`} />
          ))}
        </ScrollView>
      </CardDailyDeals >
    )
  } else if ((!fetching && data.event.status === '0') || data.event.products === undefined) {
    return null
  }
}

export default WithContext(DailyDeals)

const CardDailyDeals = styled.View`
  background-color: #FFE045;
  box-shadow: 1px 1px 1px #d4dce6;
  elevation: 1;
  padding-top: 25px;
  padding-bottom:10px;
  margin-bottom:15px;
`
const FontSizeXL = styled.Text`
  font-size: 20px !important;
  color: #555761;
  line-height: 28px;
  font-family:${fonts.regular};
  align-self: center
`
// const Bold = styled.Text`
//   font-family:${fonts.bold};
//   color: #757886;
// `

const FontXLBlack = styled.Text`
  font-size: 20px;
  color:#555761;
  line-height: 28px;
  font-family: ${fonts.bold};
  margin-bottom: 15px
`

const FontBlack = styled.Text`
  color:#555761
  font-family:${fonts.medium};
`

const MarginVerticalS = styled.View`
  margin-top: 15px;
  margin-bottom: 15px;
`
const MarginHorizontalS = styled.View`
  margin-horizontal: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`
const DistributeSpaceBetween = styled.View`
  flex-direction: column;
  align-self: center;
  margin-bottom: 20px
`
