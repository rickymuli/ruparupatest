import React, { useMemo } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'
import isEmpty from 'lodash/isEmpty'
// Component
import Lottie from './LottieComponent'
import ItemCard from './ItemCard'

// Redux
import { useSelector } from 'react-redux'

const ProductsEmpty = ({ resetProductsHandler, toggleWishlist, isFiltered }) => {
  const { data } = useSelector(state => state.inspiration)
  const { products } = useMemo(() => {
    return !isEmpty(data) ? data[Math.floor(Math.random() * data.length)] : { products: [] }
  }, [data])
  return (
    <FlatList
      data={products}
      numColumns={2}
      ListHeaderComponent={() => (
        <>
          <View style={{ padding: 20, marginBottom: 15 }}>
            <Lottie notfound style={{ width: 120, height: 120 }} />
            <Text style={{ fontFamily: 'Quicksand-Bold', color: '#757886', fontSize: 20, paddingBottom: 15 }}>Kami tidak dapat menemukan apa yang Anda cari.</Text>
            <Text style={{ fontFamily: 'Quicksand-Regular', marginBottom: 25 }}>
            Berikut rekomendasi kami untuk produk yang mungkin Anda suka. Ubah filter atau ganti kata cari untuk menemukan produk yang Anda inginkan
            </Text>
            {isFiltered &&
              <TouchableOpacity onPress={() => resetProductsHandler()} style={{ paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#D4DCE6', borderRadius: 3 }}>
                <Text style={{ fontFamily: 'Quicksand-Regular', textAlign: 'center', fontSize: 16 }}>Reset Filter</Text>
              </TouchableOpacity>
            }
          </View>
          <Text style={{ fontFamily: 'Quicksand-Bold', fontSize: 22, textAlign: 'center', marginBottom: 15 }}>Lihat juga barang-barang ini</Text>
        </>
      )}
      renderItem={({ item }) => <ItemCard fromProductList itmData={{}} itemData={item} wishlistRequest={toggleWishlist} />}
    />
  )
}

export default ProductsEmpty
