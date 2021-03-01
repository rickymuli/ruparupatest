import React, { useState, useEffect } from 'react'
import { Text, View, Modal, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WithContext } from '../Context/CustomContext'

// Styles
import styles from './Styles/FilterAndSortStyles'
import { HeaderPills, DistributeSpaceBetween } from '../Styles/StyledComponents'

// Redux
import HeaderSearchComponent from './HeaderSearchComponent'

const sort = {
  matching: 'Paling Relevan',
  lowestPrice: 'Harga Termurah',
  highestPrice: 'Harga Termahal',
  newArrival: 'Produk Terbaru',
  highestDiscount: 'Diskon Tertinggi',
  alfabetAsc: 'Nama Produk A-Z',
  alfabetDesc: 'Nama Produk Z-A'
}
const { width } = Dimensions.get('screen')
const SortProducts = ({ setHandler, handler = {}, flatlist, fetchingProduct, dataProduct = {} }) => {
  const [modal, setModal] = useState(false)
  const submit = (sortType) => {
    setHandler({ ...handler, sortType, from: 0 })
  }
  useEffect(() => {
    if (!fetchingProduct && modal) {
      setModal(false)
      if (flatlist?.current && dataProduct?.product) flatlist.current.scrollToIndex({ animated: true, index: 0, viewPosition: 0.22 })
    }
    return () => null
  }, [fetchingProduct])
  const renderSortModal = () => {
    return (
      <View>
        <HeaderSearchComponent pageName='Urut Berdasarkan' close rightAction={() => setModal(false)} />
        {Object.keys(sort).map((type, index) => (
          <TouchableOpacity key={`sort${type.label}${index}`} onPress={() => submit(type)}>
            <View style={styles.sortingOptionsStyle}>
              {handler.sortType !== type ? <Text style={styles.sortLabel}>{sort[type]}</Text>
                : <DistributeSpaceBetween>
                  <Text style={styles.selectedSort}>{sort[type]}</Text>
                  {fetchingProduct ? <ActivityIndicator size='small' color='#008CCF' style={{ marginRight: 15 }} />
                    : <Icon name='check' size={20} color='#008CCF' onPress={() => submit(type)} style={{ marginRight: 15, alignSelf: 'center' }} />
                  }
                </DistributeSpaceBetween>
              }
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )
  }
  return (
    <View style={{ width: width * 0.4 }}>
      <HeaderPills onPress={() => setModal(true)}>
        <Icon name='sort-descending' color='#757886' />
        <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886', paddingLeft: 4 }}>{sort[handler.sortType] || 'Urut berdasarkan'}</Text>
      </HeaderPills>
      <Modal
        animationType='slide'
        transparent={false}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        {renderSortModal()}
      </Modal>
    </View>
  )
}

// const shouldNotUpdate = (prevProps, nextProps) => (prevProps.handler.sortType === nextProps.handler.sortType || prevProps.fetchingProduct === nextProps.fetchingProduct)
// export default WithContext(React.memo(SortProducts, shouldNotUpdate))
export default WithContext(SortProducts)
