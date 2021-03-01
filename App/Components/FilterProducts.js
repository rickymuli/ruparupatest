import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Text, View, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import {
  UpperFirst
  // , ReplaceArray
} from '../Utils/Misc'
import { WithContext } from '../Context/CustomContext'
import useEzFetch from '../Hooks/useEzFetch'

// Redux
import { useSelector } from 'react-redux'

// Components
import ShippingLocation from './ShippingLocation'
import Loading from './LottieComponent'
import FilterBy from './FilterBy'
import FilterByPrice from './FilterByPrice'
import Checkbox from './Checkbox'

// Styles
import styles from './Styles/FilterAndSortStyles'
import { HeaderPills, ModalHeader, TextModal } from '../Styles/StyledComponents'
import GoSendTnc from './GoSendTnc'

const { height, width } = Dimensions.get('screen')
const FilterProducts = ({ flatlist, data = {}, search, isFiltered, dataCategoryDetail = {}, handler = {}, fetchingProduct, urlKey = '', buParam = '', dataProduct, getProductByCategory, setHandler }) => {
  const { province, city, kecamatan = {} } = useSelector(state => state.location)
  const [dataFilter, setDataFilter] = useState({})
  const { get: getFilter, fetching: fetchingFilter } = useEzFetch()
  const getNavigationFilter = () => {
    const dataCat = dataCategoryDetail || {}
    getFilter(`${buParam}/product/navigationfilters?category=${`${urlKey.replace('.html', '')}.html`}&keyword=${search}&isRuleBased=${dataCat.is_rule_based === '1'}&categoryId=${dataCat.category_id || ''}&storeCode=${handler.storeCode || ''}`, {},
      ({ response }) => {
        let resData = response?.data?.data?.filter((o) => ['label', 'brand', 'color'].includes(o.filter_name)) // response?.data?.data //?.reduce((result, value, key)=>  ({...result, [`${value.filter_name}`] = value.filter_values}), {});
        let newDataFilter = resData?.reduce((result, value, key) => ({ ...result, [`${value.filter_name}s`]: value.filter_values }), {}) || {}
        setDataFilter(newDataFilter)
      })
  }
  const [newData, setNewData] = useState(handler)
  const [goSend, setGoSend] = useState([handler?.canGoSend?.includes('1'), handler?.canGoSend?.includes('2')]) // eslint-disable-line
  const [expressCourier, setExpressCourier] = useState(false)
  const [modal, setModal] = useState(false)
  const [modalInfo, setModalInfo] = useState(false)
  const expressDelivery = useSelector(state => state.misc.expressDelivery) || {}
  const renderFilterLocation = useMemo(() => {
    return <View style={styles.cardContent}>
      <Text style={styles.cardHeader}>Lokasi Pengiriman / Pengambilan</Text>
      <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Bold', color: '#757886' }}>
        {`${UpperFirst(get(province, 'province_name', 'DKI JAKARTA'))}, ${UpperFirst(get(city, 'city_name', 'KOTA. JAKARTA BARAT'))}, ${UpperFirst(get(kecamatan, 'kecamatan_name', 'KEMBANGAN'))}`}
      </Text>
      <ShippingLocation fromFilter />
    </View>
  }, [province, city, kecamatan])
  // const selectedService = (index) => setGoSend(ReplaceArray(goSend, index, !goSend[index]))
  const price = useRef(null)
  useEffect(() => {
    if (modal && !fetchingFilter && isEmpty(dataFilter)) {
      getNavigationFilter()
    }
    return () => null
  }, [modal])

  useEffect(() => {
    if (!fetchingProduct && modal && !fetchingFilter) {
      setModal(false)
      if (flatlist?.current && dataProduct.product) {
        flatlist.current.scrollToIndex({ animated: true, index: 0, viewPosition: 0.22 })
      }
    }
  }, [fetchingProduct])

  const applyFilter = () => {
    const { minPrice, maxPrice, invalidPrice } = price?.current ?? {}
    if (!invalidPrice) {
      const { colors, brands, labels } = newData
      let canGoSend = expressCourier ? '1,2' : ''
      // let canGoSend = goSend[0] ? '1' : ''
      // if (goSend[1]) canGoSend = canGoSend + (canGoSend.length > 0 ? ',2' : '2')
      setHandler({ ...handler, colors, brands, labels, minPrice, maxPrice, canGoSend, from: 0 })
    }
  }
  const reset = () => {
    setNewData({ ...newData, minPrice: '', maxPrice: '', brands: [], colors: [], labels: [] })
    setGoSend([false, false])
    if (price.current?.reset) price.current.reset()
  }
  const renderFilterBy = useMemo(() => {
    if (isEmpty(dataFilter)) return null
    return (
      <View>
        {!isEmpty(dataFilter.brands) && <FilterBy setNewData={(e) => setNewData(e)} name={'brands'} initialSelected={newData['brands']} filterData={dataFilter.brands} />}
        {!isEmpty(dataFilter.colors) && <FilterBy setNewData={(e) => setNewData(e)} name={'colors'} initialSelected={newData['colors']} filterData={dataFilter.colors} />}
        {!isEmpty(dataFilter.labels) && <FilterBy setNewData={(e) => setNewData(e)} name={'labels'} initialSelected={newData['labels']} filterData={dataFilter.labels} />}
      </View>
    )
  }, [dataFilter, newData])
  const renderFilterComponent = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.modalFilterHeader}>
        <TouchableOpacity onPress={() => reset()}>
          <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
        </TouchableOpacity>
        <Text style={styles.cardTitle}>Filter</Text>
        <TouchableOpacity style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
          <Icon name='close-circle' color='#D4DCE6' size={24} onPress={() => setModal(false)} />
        </TouchableOpacity>
      </View>
      {fetchingFilter
        ? <Loading />
        : <>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {renderFilterLocation}
              <FilterByPrice ref={price} min={handler.minPrice} max={handler.maxPrice} />
              {(expressDelivery.same_day === '1' || expressDelivery.instant_delivery === '1')
                ? <View style={styles.cardContent}>
                  <Text style={styles.cardHeader}>Dukungan Pengiriman</Text>
                  <TouchableOpacity onPress={() => setExpressCourier(!expressCourier)} style={styles.deliveryItemView}>
                    <Checkbox text={`EXPRESS COURIER`} onPress={() => setExpressCourier(!expressCourier)} selected={expressCourier} />
                  </TouchableOpacity>
                  {/* {[expressDelivery.same_day, expressDelivery.instant_delivery].map((item, index) => (item === '1' &&
                  <TouchableOpacity onPress={() => selectedService(index)} style={styles.deliveryItemView} key={index}>
                    <Checkbox onPress={() => selectedService(index)} selected={goSend[index]} />
                    <Text style={{ fontFamily: 'Quicksand-Regular', marginLeft: 15, color: '#757886' }}>{`GO-SEND ${index > 0 ? 'Instant' : 'Same day'}`}</Text>
                  </TouchableOpacity>)
                  )} */}
                  <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => { setModalInfo(true) }}>
                    <Text style={{ fontSize: 12, color: '#757885', fontFamily: 'Quicksand-Regular' }}>Informasi pengiriman <Icon name='help-circle' color='#757885' /></Text>
                  </TouchableOpacity>
                </View>
                : <View style={{ backgroundColor: '#E5F7FF', padding: 15, flexDirection: 'row' }}>
                  <Icon name='information' color='#757885' />
                  <View style={{ paddingLeft: 25 }}>
                    <Text style={{ color: '#757885', fontSize: 14, fontFamily: 'Quicksand-Regular' }}>{`Untuk saat ini pengiriman Sameday & Instant hanya support di area Jakarta`}</Text>
                  </View>
                </View>
              }
              {renderFilterBy}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.buttonApplyCard} onPress={() => applyFilter()}>
            {fetchingProduct ? <ActivityIndicator color={'white'} />
              : <Text style={styles.btnText}>Terapkan</Text>
            }
          </TouchableOpacity>
        </>
      }
      <Modal
        animationType='slide'
        visible={modalInfo}
        onRequestClose={() => setModalInfo(false)}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ height: height * 0.9 }}>
            <ModalHeader>
              <Icon name='close-circle' size={24} color='white' />
              <TextModal>Informasi Pengiriman</TextModal>
              <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => setModalInfo(false)} />
            </ModalHeader>
            <GoSendTnc />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  )
  const HeaderFilter = useMemo(() => {
    return <HeaderPills onPress={() => setModal(true)}>
      <View style={{ flexDirection: 'row' }}>
        {isFiltered && <Octicons name={'primitive-dot'} color='#FF7F45' />}
        <Icon name='filter-outline' color='#757886' />
      </View>
      <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>Filter</Text>
    </HeaderPills>
  }, [isFiltered])
  return (
    <View style={{ width: width * 0.28 }}>
      {HeaderFilter}
      <Modal
        animationType='slide'
        transparent={false}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        {modal &&
          <SafeAreaView style={{ flex: 1 }}>
            {renderFilterComponent()}
          </SafeAreaView>
        }
      </Modal>
    </View>
  )
}

export default WithContext(FilterProducts)
// const shouldNotUpdate = (prevProps, nextProps) => (prevProps.handler === nextProps.handler || prevProps.urlKey === nextProps.urlKey || prevProps.fetchingProduct === nextProps.fetchingProduct)

// export default WithContext(React.memo(FilterProducts, shouldNotUpdate))
