import React from 'react'
import { Text, ScrollView } from 'react-native'
import { CreateStore } from '../Context/store/inspirationTabStore'

import CMSBlock from '../Components/CMSBlock'
// import ItemCard from '../Components/ItemCard'

// const { width } = Dimensions.get('screen')
const InspirationsTabs = (props) => {
  const { data = [] } = props
  return (
    <ScrollView style={{ flex: 1 }}>
      <CMSBlock {...props} urlKey={data[0].url_key} />
      <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 20, paddingLeft: 10, paddingTop: 20, textAlign: 'left' }}>Best Seller</Text>
      {/* <FlatList
            data={inspirationData.products.slice(0, 4)}
            numColumns={2}
            contentContainerStyle={{ alignItems: 'center' }}
            renderItem={({ item }) => {
              return (
                <ItemCard
                  itmData={{}}
                  wishlistRequest={() => null}
                  itemData={item}
                  navigation={props.navigation}
                />
              )
            }}
            ListFooterComponent={() => (
              <View style={{ marginBottom: 20 }}>
                <Card>
                  <TouchableOpacity style={{ width: width * 0.9, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                    <Text style={{ color: '#008ccf', fontSize: 16, fontFamily: 'Quicksand-Bold' }}>Lihat Semua ({NumberWithCommas(Math.floor(inspirationData.total / 10) * 10)}+ items)</Text>
                    <Icon name='arrow-right' size={24} color={'#008ccf'} />
                  </TouchableOpacity>
                </Card>
              </View>
            )}
            keyExtractor={(item, index) => `product catalogue ${index}${item.name}`}
          /> */}
    </ScrollView>
  )
}

export default CreateStore(InspirationsTabs)
