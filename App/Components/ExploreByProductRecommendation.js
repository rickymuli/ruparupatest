import React, { useState, useEffect } from 'react'
import { View, FlatList } from 'react-native'
import { homepageProductRecommendation, emarsysObjectHelper } from '../Services/Emarsys'
import ItemCard from './ItemCard'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import { PrimaryTextBold, fonts } from '../Styles'

const ExploreByProductRecommendation = (props) => {
  const { refresh } = props
  // This component shows personalised product recommendation from emarsys, shows 4 products at a time, with a max of 10 times show more clicks, totaling to 40 products
  const [emarsysData, setEmarsysData] = useState([])
  const [products, setProducts] = useState([])
  const [counter, setCounter] = useState(0)
  const itmData = { itm_campaign: 'Recommendation', itm_source: 'Homepage' }

  useEffect(() => { getProducts() }, [])
  useEffect(() => { if (refresh) getProducts() }, [refresh])

  const getProducts = async () => {
    const productRecommendation = await homepageProductRecommendation()
    setEmarsysData(productRecommendation)

    const firstFourProducts = productRecommendation ? productRecommendation.slice(0, 4) : []
    setProducts(firstFourProducts)
    setCounter(4)
  }

  const showMoreProducts = () => {
    if (counter < 40) {
      let moreProducts = emarsysData ? emarsysData.slice(0, counter + 4) : []
      setProducts(moreProducts)
      setCounter(counter + 4)
    }
  }

  if (isEmpty(products)) return null
  return (
    <View style={{ backgroundColor: 'white' }}>
      <PrimaryTextBold style={{ textAlign: 'center', padding: 10, fontSize: 16 }}>Produk Rekomendasi</PrimaryTextBold>
      <FlatList
        data={products}
        renderItem={({ item, index }) => {
          const itemData = emarsysObjectHelper(item)
          return <ItemCard itemData={itemData} itmData={itmData} fromProductList key={`homepageProductRecommendation ${index}`} emarsysRecommendation />
        }}
        numColumns={2}
        onEndReachedThreshold={10}
        keyExtractor={(item, index) => index.toString()}
      />
      {(counter < 40) && <ContainerInspiration>
        <ButtonSecondaryInverseM onPress={() => showMoreProducts()}>
          <ButtonSecondaryInverseMText>Muat Lebih Banyak Produk</ButtonSecondaryInverseMText>
        </ButtonSecondaryInverseM>
      </ContainerInspiration>}
    </View>
  )
}

export default ExploreByProductRecommendation

const ButtonSecondaryInverseM = styled.TouchableOpacity`
  background-color: white;
  border: 1px #008ccf solid;
  padding: 10px;
  border-radius: 3px;
`
const ButtonSecondaryInverseMText = styled.Text`
  font-size: 16px;
  color: #008ccf;
  text-align: center;
  font-family:${fonts.bold};
`
const ContainerInspiration = styled.View`
  padding-top: 0px;
  padding-bottom: 10px;
  padding-left:10px;
  padding-right:10px;
`
