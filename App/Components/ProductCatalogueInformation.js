import React from 'react'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { NumberWithCommas } from '../Utils/Misc'
import isEmpty from 'lodash/isEmpty'

// Styles
import styled from 'styled-components'

const ProductCatalogueInformation = ({ productInfo }) => {
  return (
    <InfoBoxPcp>
      <Icon name='information-outline' size={16} style={{ marginRight: 5, marginTop: 2 }} />
      <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>Menampilkan
        <Text style={{ lineHeight: 20, fontFamily: 'Quicksand-Bold', color: '#757886' }}> {NumberWithCommas(productInfo.total)}</Text> produk dalam kategori<Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}> {productInfo.category}</Text>
        {(!isEmpty(productInfo.name)) &&
          <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}> dengan kata cari <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886' }}>
            {productInfo.name}
          </Text>
          </Text>
        }
      </Text>
    </InfoBoxPcp>
  )
}

const shouldNotUpdate = (prevProps, nextProps) => (prevProps.productInfo === nextProps.productInfo)

export default React.memo(ProductCatalogueInformation, shouldNotUpdate)

const InfoBoxPcp = styled.View`
  elevation: 1;
  flex-direction: row;
  background-color: #e5f7ff;
  padding: 18px;
  padding-right: 30px;
`
