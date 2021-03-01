import React, { PureComponent } from 'react'
import { NumberWithCommas } from '../Utils/Misc'

// Styles
import styled from 'styled-components'

export default class ItemCardPrice extends PureComponent {
  render () {
    const { itemData, hidePrice } = this.props
    return (
      <PriceContainer>
        {(hidePrice && typeof hidePrice !== 'undefined')
          ? <PriceProduct >
            <Priceold>Rp {NumberWithCommas((itemData.special_price > 0) ? itemData.special_price : itemData.price)}</Priceold>
            <Price>Rp ???</Price>
            <DiscountContainer>
              <TextDiscount>?? %</TextDiscount>
            </DiscountContainer>
          </PriceProduct>
          : (itemData.special_price > 0)
            ? <PriceProduct>
              <Priceold>Rp {NumberWithCommas(itemData.price)}</Priceold>
              <Price>Rp {NumberWithCommas(itemData.special_price)}</Price>
              <DiscountContainer>
                <TextDiscount>{Math.floor(((itemData.price - itemData.special_price) / itemData.price) * 100)}%</TextDiscount>
              </DiscountContainer>
            </PriceProduct>
            : <PriceProduct>
              <PriceoldNone />
              <Price>Rp {NumberWithCommas(itemData.price)}</Price>
              {/* <DiscountContainerWhiteout>
                <TextDiscount />
              </DiscountContainerWhiteout> */}
            </PriceProduct>
        }
      </PriceContainer>
    )
  }
}

const PriceContainer = styled.View`
  margin-top: 10px;
`

const PriceoldNone = styled.Text`
  color:#757885;
  font-size:12px;
  text-decoration:line-through;
  text-decoration-color: #FFFFFF;
`

const Price = styled.Text`
  font-size: 12px;
  line-height: 20px;
  color: #008ed1;
  font-family:Quicksand-Bold;
`

const Priceold = styled.Text`
  color:#F26525;
  font-size:10px;
  font-family:Quicksand-Regular;
  text-decoration-line: line-through;
`

const PriceProduct = styled.View`
  margin-bottom: 5px;
`

const DiscountContainer = styled.View`
  margin-top: 2px;
  width: ${props => props.productList ? '35px' : '30px'};
  height: ${props => props.productList ? '35px' : '30px'};
  background: #f3591f;
  border-radius: 30px;
  position: absolute;
  align-self:flex-end;
  justify-content: center;
  align-items: center;
`

// const DiscountContainerWhiteout = styled.View`
//   width: 35px;
//   height: 35px;
//   background: white;
//   border-radius: 30px;
//   position: absolute;
//   align-self:flex-end;
//   padding-top: 10px;
//   padding-left: 1px;
// `

const TextDiscount = styled.Text`
  font-size: ${props => props.productList ? '14px' : '12px'};
  color: white;
  text-align:center;
  font-family:Quicksand-Medium;
`
