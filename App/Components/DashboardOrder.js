import React, { Component } from 'react'
import { View, Image, Dimensions } from 'react-native'
import { formatLLL } from '../Services/Day'
import { NumberWithCommas } from '../Utils/Misc'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import styled from 'styled-components'
import { fonts } from '../Styles'

// Component
import Loading from './LoadingComponent'

export default class DashboardOrder extends Component {
  constructor (props) {
    super(props)
    this.state = {
      order: props.order
    }
  }

  componentWillReceiveProps (newProps) {
    const { order } = newProps
    this.setState({ order })
  }

  render () {
    const { order } = this.state
    const orderList = order.orderList
    const ratio = (Dimensions.get('screen').width * 0.6) / 976
    if (order.fetching && order.orderList) {
      return (
        <Loading />
      )
    } else {
      return (
        <InnerContainer>
          <MarginVerticalM>
            <FlexRow>
              <View style={{ width: 25 }}>
                <Icon name='credit-card' size={22} />
              </View>
              <FontSizeL>
                <Bold>
              Pesanan Saya
                </Bold>
              </FontSizeL>
            </FlexRow>
          </MarginVerticalM>
          <FlexRow>
            <HrFull />
          </FlexRow>
          {(orderList && orderList.length > 0)
            ? orderList.map((order, index) => {
              if (index < 2) {
                return (
                  <OrderDetail key={`orderList ${index}`}>
                    <OrderDetailContent>
                      <FontSizeS>No. Pemesanan</FontSizeS>
                      <Bold>
                        {order.order_no}
                      </Bold>
                    </OrderDetailContent>
                    <OrderDetailContent>
                      <FontSizeS>Tanggal Pemesanan</FontSizeS>
                      <FontSizeS>
                        <Bold>
                          {formatLLL(order.createdAt)}
                        </Bold>
                      </FontSizeS>
                    </OrderDetailContent>
                    <OrderDetailContent>
                      <FontSizeS>Total Pembayaran</FontSizeS>
                      <FontSizeS>
                        <Bold>
                      Rp {NumberWithCommas(order.grand_total)}
                        </Bold>
                      </FontSizeS>
                    </OrderDetailContent>
                    <OrderDetailContent>
                      <View style={{ marginTop: 2 }}>
                        <FontSizeS>Status Pemesanan</FontSizeS>
                      </View>
                      <View style={[{ paddingVertical: 3, paddingHorizontal: 5, borderRadius: 3 }, (order.to_render_class_name === 'danger') ? { backgroundColor: '#d9534f' } : (order.to_render_class_name === 'success') ? { backgroundColor: '#049372' } : { backgroundColor: '#F5A623' }]}>
                        <Bold>
                          <FontWhite>
                            <FontSizeS>{order.to_render_status}</FontSizeS>
                          </FontWhite>
                        </Bold>
                      </View>
                    </OrderDetailContent>
                    {(index === 0) ? <View style={{ backgroundColor: '#E0E6ED', width: '100%', height: 1 }} /> : null}
                  </OrderDetail>
                )
              } else {
                return null
              }
            })
            : <View style={{ flexDirection: 'column' }}>
              <View style={{ padding: 20, alignSelf: 'center' }}>
                <Image source={require('../assets/images/keranjang-kosong.webp')} style={{ width: Dimensions.get('screen').width * 0.6, height: ratio * 562 }} />
              </View>
              <ButtonBorder onPress={() => this.props.navigation.navigate('Search')}>
                <ButtonBorderText>Belanja Sekarang</ButtonBorderText>
              </ButtonBorder>
            </View>
          }
          {(orderList && orderList.length > 0)
            ? <ButtonBorder onPress={() => this.props.navigation.navigate('Pesanan')}>
              <ButtonBorderText>Lihat Semua ({orderList.length})</ButtonBorderText>
            </ButtonBorder>
            : null
          }
        </InnerContainer>
      )
    }
  }
}

const InnerContainer = styled.View`
  flexDirection: column;
  backgroundColor: white;
  paddingHorizontal: 20px;
  paddingBottom: 10px;
  marginBottom: 10px;
`
const FontSizeL = styled.Text`
  font-size: 18px;
  font-family:${fonts.regular};
`

const HrFull = styled.View`
  flex:1;
  backgroundColor:#E0E6ED;
  height:1;
  marginHorizontal:-10;
`
const FlexRow = styled.View`
  flexDirection : row;
`
const MarginVerticalM = styled.View`
  marginVertical : 20px;
`

const ButtonBorder = styled.TouchableOpacity`
  paddingTop: 10;
  paddingLeft: 15;
  paddingBottom: 10;
  paddingRight: 15;
  borderWidth: 1;
  borderColor: #E0E6ED;
`

const ButtonBorderText = styled.Text`
  fontSize: 16;
  textAlign: center;
  font-family:${fonts.bold};
  color: #757886;
`

const OrderDetail = styled.View`
  flexDirection: column;
`

const OrderDetailContent = styled.View`
  flexDirection: row;
  justifyContent: space-between;
  marginVertical: 5px;
  marginTop: 10px;
  marginBottom: 10px;
`
const Bold = styled.Text`
  font-family:${fonts.bold};
  color: #555761;
`
const FontSizeS = styled.Text`
  font-size: 14px;
  font-family:${fonts.regular};
`

const FontWhite = styled.Text`
  color: white;
  font-family:${fonts.regular};
`
