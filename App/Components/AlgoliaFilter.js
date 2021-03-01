import React, { useState, useRef, useEffect, forwardRef } from 'react'
import { Text, View, ScrollView, SafeAreaView, Dimensions, TouchableOpacity, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  UpperFirst
  // ReplaceArray
} from '../Utils/Misc'
import { connectRefinementList } from 'react-instantsearch-native'

// lodash
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import sortBy from 'lodash/sortBy'
import findIndex from 'lodash/findIndex'
import filter from 'lodash/filter'

// Redux
import { useSelector } from 'react-redux'

// Components
import ShippingLocation from './ShippingLocation'
import AlgoliaFilterBy from './AlgoliaFilterBy'
import FilterByPrice from './FilterByPrice'
import Labels from './AlgoliaLabels'
import Checkbox from './Checkbox'
import Lottie from '../Components/LottieComponent'

// Styles
import { PrimaryText, PrimaryTextBold, LightTertiaryTextMedium, colors } from '../Styles'
import styles from './Styles/FilterAndSortStyles'
import { HeaderPills, MarginRightS, ModalHeader, TextModal } from '../Styles/StyledComponents'
import GoSendTnc from './GoSendTnc'

const { height } = Dimensions.get('screen')

const AlgoliaFilter = forwardRef(({ setAlgoliaFilterQuery, algolia, setAlgolia, productsHandler }) => {
  const [goSend, setGoSend] = useState([productsHandler?.canGoSend?.includes('1'), productsHandler?.canGoSend?.includes('2')]) // eslint-disable-line
  // const selectedService = (index) => setGoSend(ReplaceArray(goSend, index, !goSend[index]))
  const [expressCourier, setExpressCourier] = useState(false)

  const price = useRef(null)
  const [modal, setModal] = useState(false)
  const [modalInfo, setModalInfo] = useState(false)
  const expressDelivery = useSelector(state => state.misc.expressDelivery) || {}

  const { province, city, kecamatan = {} } = useSelector(state => state.location)
  const picupDelivLocation = () => (`${UpperFirst(get(province, 'province_name', 'DKI JAKARTA'))}, ${UpperFirst(get(city, 'city_name', 'KOTA. JAKARTA BARAT'))}, ${UpperFirst(get(kecamatan, 'kecamatan_name', 'KEMBANGAN'))}`)

  const applyFilter = () => {
    const { invalidPrice } = price.current

    if (!invalidPrice) {
      generateFilterQuery()
      setAlgolia({ ...algolia, price: price.current })
      setModal(false)
    }
  }

  const reset = () => {
    setAlgolia({ ...algolia, price: { minPrice: '', maxPrice: '', invalidPrice: false }, brands: [], colors: [], labels: [] })
    setGoSend([false, false])
    price.current.reset()
  }

  useEffect(() => { if (modal) setAlgoliaFilterQuery('status:10') }, [modal])

  const generateFilterQuery = () => {
    const { brands, colors, labels } = algolia
    const { minPrice, maxPrice } = price.current
    let filter = ''

    if (!isEmpty(brands)) {
      filter += '('
      brands.forEach((brand, i) => {
        filter += `brand.name:"${brand.label}"`
        if (i !== brands.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    if (!isEmpty(colors)) {
      (isEmpty(brands)) ? filter += '(' : filter += ' OR ('
      colors.forEach((color, i) => {
        filter += `colour:${color.label}`
        if (i !== colors.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    if (!isEmpty(labels)) {
      (isEmpty(brands) && isEmpty(colors)) ? filter += '(' : filter += ' OR ('
      labels.forEach((label, i) => {
        filter += `label.ODI:"${label.label}"`
        if (i !== labels.length - 1) filter += ' OR '
      })
      filter += ')'
    }

    (!isEmpty(filter)) ? filter = `status:10 AND (${filter})` : filter = 'status:10'

    if (expressCourier) filter += ' AND (can_gosend:sameday OR can_gosend:instant)'
    // if (goSend[0] === true) filter += ' AND (can_gosend:sameday)'
    // if (goSend[1] === true) filter += ' AND (can_gosend:instant)'

    if (minPrice && !isEmpty(minPrice)) filter += ` AND selling_price > ${Number(minPrice)}`
    if (maxPrice && !isEmpty(maxPrice)) filter += ` AND selling_price < ${Number(maxPrice)}`

    setAlgoliaFilterQuery(filter)
  }

  const Pressed = (name, item) => {
    let result = isEmpty(algolia[name]) ? [] : [...algolia[name]]
    let isChecked = findIndex(result, item)

    if (isChecked >= 0) {
      let removed = filter(result, function (o) { return JSON.stringify(o) !== JSON.stringify(item) })
      setAlgolia({ ...algolia, [name]: removed })
    } else {
      setAlgolia({ ...algolia, [name]: [...result, item] })
    }
  }

  const renderFilterComponent = () => {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={styles.modalFilterHeader}>
          <TouchableOpacity onPress={() => reset()}>
            <LightTertiaryTextMedium>Reset</LightTertiaryTextMedium>
          </TouchableOpacity>
          <Text style={styles.cardTitle}>Filter</Text>
          <TouchableOpacity style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
            <Icon name='close-circle' color='#D4DCE6' size={24} onPress={() => setModal(false)} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ height: height * 0.8 }} keyboardShouldPersistTaps={'handled'}>
          <View style={styles.cardContent}>
            <Text style={styles.cardHeader}>Lokasi Pengiriman / Pengambilan</Text>
            <PrimaryTextBold style={{ fontSize: 12 }}>{picupDelivLocation()}</PrimaryTextBold>
            <ShippingLocation fromFilter />
          </View>
          {(expressDelivery.same_day === '1' || expressDelivery.instant_delivery === '1')
            ? <View style={styles.cardContent}>
              <Text style={styles.cardHeader}>Dukungan Pengiriman</Text>
              <TouchableOpacity onPress={() => setExpressCourier(!expressCourier)} style={styles.deliveryItemView}>
                <Checkbox text={`EXPRESS COURIER`} onPress={() => setExpressCourier(!expressCourier)} selected={expressCourier} />
              </TouchableOpacity>
              {/* {[expressDelivery.same_day, expressDelivery.instant_delivery].map((item, index) => (item === '1' &&
              <TouchableOpacity onPress={() => selectedService(index)} style={styles.deliveryItemView} key={index}>
                <Checkbox text={`GO-SEND ${index > 0 ? 'Instant' : 'Same day'}`} onPress={() => selectedService(index)} selected={goSend[index]} />
              </TouchableOpacity>)
              )} */}
              <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => { setModalInfo(true) }}>
                <PrimaryTextBold style={{ fontSize: 12 }}>Informasi pengiriman <Icon name='help-circle' color='#757885' /></PrimaryTextBold>
              </TouchableOpacity>
            </View>
            : <View style={{ backgroundColor: '#E5F7FF', padding: 15, flexDirection: 'row' }}>
              <Icon name='information' color='#757885' />
              <View style={{ paddingLeft: 25 }}>
                <PrimaryText style={{ fontSize: 14 }}>{`Untuk saat ini pengiriman Sameday & Instant hanya support di area Jakarta`}</PrimaryText>
              </View>
            </View>}
          <FilterByPrice ref={price} min={algolia.price.minPrice} max={algolia.price.maxPrice} />
          {['brands', 'colors', 'labels'].map((i, key) => {
            return (
              <AlgoliaFilterBy name={i} key={key} algolia={algolia} setAlgolia={setAlgolia} Pressed={Pressed}>
                {i === 'brands'
                  ? <BrandFilter attribute='brand.name' limit={30} Pressed={Pressed} algolia={algolia} />
                  : i === 'colors'
                    ? <ColourFilter attribute='colour' Pressed={Pressed} algolia={algolia} />
                    : <PromoFilter attribute='label.ODI' Pressed={Pressed} algolia={algolia} />}
              </AlgoliaFilterBy>)
          })}
        </ScrollView>
        <TouchableOpacity style={[styles.buttonApplyCard, { marginBottom: 15 }]} onPress={() => applyFilter()}>
          <Text style={styles.btnText}>Terapkan</Text>
        </TouchableOpacity>
        <Modal
          animationType='slide'
          visible={modalInfo}
          onRequestClose={() => setModalInfo(false)}>
          <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ height: Dimensions.get('window').height * 0.9 }}>
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
  }

  return (
    <View style={{ flex: 0.5 }}>
      <HeaderPills onPress={() => setModal(true)}>
        <View style={{ flexDirection: 'row' }}>
          {/* {isFiltered() && <Octicons name={'primitive-dot'} color='#FF7F45' /> } */}
          <Icon name='filter-outline' color={colors.primary} />
        </View>
        <MarginRightS>
          <PrimaryText>Filter</PrimaryText>
        </MarginRightS>
      </HeaderPills>
      <Modal
        animationType='slide'
        transparent={false}
        visible={modal}
        onRequestClose={() => setModal(false)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {renderFilterComponent()}
        </SafeAreaView>
      </Modal>
    </View>
  )
})

export default AlgoliaFilter

const BrandFilter = connectRefinementList(
  ({ items, Pressed, algolia, canRefine }) => {
    const init = useInitAlgoliaStatus(canRefine)
    let itemsAlphabeticalOrder = sortBy(items, ['label'])
    return canRefine
      ? (<Labels items={itemsAlphabeticalOrder} name='brands' Pressed={Pressed} algolia={algolia} />)
      : init ? (<NoResult name='brand' />) : (<Lottie />)
  }
)

const ColourFilter = connectRefinementList(
  ({ items, Pressed, algolia, canRefine }) => {
    const init = useInitAlgoliaStatus(canRefine)
    return canRefine ? (
      <Labels items={items} name='colors' Pressed={Pressed} algolia={algolia} />
    ) : init ? (<NoResult name='warna' />) : (<Lottie />)
  }
)

const PromoFilter = connectRefinementList(
  ({ items, Pressed, algolia, canRefine }) => {
    const init = useInitAlgoliaStatus(canRefine)
    return canRefine ? (
      <Labels items={items} name='labels' Pressed={Pressed} algolia={algolia} />
    ) : init ? (<NoResult name='promo' />) : (<Lottie />)
  }
)

const NoResult = ({ name }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>Maaf, {name} tidak ditemukan.</Text>
    </View>
  )
}
// helper for algolia
export function useInitAlgoliaStatus (canRefine, callTimeout = 3000) {
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (!init) {
      if (canRefine) {
        setInit(true)
      } else {
        const timeout = setTimeout(() => setInit(true), callTimeout)

        return () => clearTimeout(timeout)
      }
    }
  }, [canRefine, init])

  return init
}
