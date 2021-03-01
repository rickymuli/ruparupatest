import React, { useState } from 'react'
import { Text, View, Modal, TouchableOpacity, SafeAreaView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connectSortBy } from 'react-instantsearch-native'
import map from 'lodash/map'

// Styles
import styles from './Styles/FilterAndSortStyles'
import { HeaderPills, DistributeSpaceBetween } from '../Styles/StyledComponents'
import { PrimaryText, colors } from '../Styles'

// Redux
import HeaderSearchComponent from './HeaderSearchComponent'

const sort = [
  { key: 'matching', label: 'Paling Relevan', value: 'productsvariant' },
  { key: 'lowestPrice', label: 'Harga Termurah', value: 'productsvariant_price_asc' },
  { key: 'highestPrice', label: 'Harga Termahal', value: 'productsvariant_price_desc' },
  { key: 'newArrival', label: 'Produk Terbaru', value: 'productsvariant_publishdate' },
  { key: 'highestDiscount', label: 'Diskon Tertinggi', value: 'productsvariant_discount_desc' },
  { key: 'lowestDiscount', label: 'Diskon Terendah', value: 'productsvariant_discount_asc' }
]

const AlgoliaSort = ({ sortType, setSortType }) => {
  const [modal, setModal] = useState(false)

  return (
    <View style={{ flex: 0.5 }}>
      <HeaderPills onPress={() => setModal(true)}>
        <Icon name='sort-descending' color={colors.primary} />
        <PrimaryText style={{ paddingLeft: 4 }}>{sortType.label || 'Urut berdasarkan'}</PrimaryText>
      </HeaderPills>
      <Modal
        animationType='slide'
        transparent={false}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <ConnectedSortBy
          defaultRefinement='productsvariant_price_asc'
          items={sort}
          setModal={setModal}
          sortType={sortType}
          setSortType={setSortType}
        />
      </Modal>
    </View>
  )
}

export default AlgoliaSort

const ConnectedSortBy = connectSortBy(({ refine, setModal, sortType, setSortType }) => {
  const submitSort = (type) => {
    setSortType(type)
    refine(type.value)
    setModal(false)
  }

  return (
    <SafeAreaView>
      <HeaderSearchComponent pageName='Urut Berdasarkan' close rightAction={() => setModal(false)} />
      {map(sort, (type, index) => {
        return (<TouchableOpacity key={`sort${type.label}${index}`} onPress={() => submitSort(type)}>
          <View style={styles.sortingOptionsStyle}>
            {sortType.key !== type.key ? <Text style={styles.sortLabel}>{type.label}</Text>
              : <DistributeSpaceBetween>
                <Text style={styles.selectedSort}>{type.label}</Text>
                <Icon name='check' size={20} color='#008CCF' onPress={() => submitSort(type)} style={{ marginRight: 15, alignSelf: 'center' }} />
              </DistributeSpaceBetween>
            }
          </View>
        </TouchableOpacity>)
      })}
    </SafeAreaView>
  )
})
