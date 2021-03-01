import React, { Component } from 'react'
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Modal
} from 'react-native'
import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import has from 'lodash/has'
import find from 'lodash/find'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import { UpperCase, NumberWithCommas, NumberFormat } from '../Utils/Misc'
import { WithContext } from '../Context/CustomContext'
// import SearchInput, { createFilter } from 'react-native-search-filter'

// Redux
import NavigationFilterActions from '../Redux/NavigationFilterRedux'
// import LocationActions from '../Redux/LocationRedux'
import ProductHandlerActions from '../Redux/ProductHandler'

// Components
import ShippingLocation from './ShippingLocation'
import Loading from './LottieComponent'
import FilterBrands from './FilterBrands'
import FilterColors from './FilterColors'
import FilterLabel from './FilterLabel'
import Checkbox from './Checkbox'

// Styles
import styles from './Styles/FilterAndSortStyles'
import {
  HeaderPills,
  MarginRightS,
  ModalHeader, TextModal, FormS, Input } from '../Styles/StyledComponents'
import GoSendTnc from './GoSendTnc'

// const KEYS_TO_FILTERS = ['value']

class FilterComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      location: null,
      modalInfoVisible: false,
      newItem: false,
      itemDetail: null,
      minPrice: props.minPrice || '',
      maxPrice: props.maxPrice || '',
      brands: props.brands || [],
      searchBrand: '',
      colors: props.colors || [],
      labels: props.labels || [],
      deliveryServices:
      [
        { text: 'EXPRESS COURIER', checked: false }
        // {
        //   text: 'GO-SEND Same day',
        //   checked: false
        // },
        // {
        //   text: 'GO-SEND Instant',
        //   checked: false
        // }
      ],
      numberErr: '',
      navigationFilter: props.navigationFilter || null,
      modalFilterVisible: false
    }
  }

  setModalFilterVisible = (visible) => {
    this.setState({ modalFilterVisible: visible })
  }

  componentDidMount () {
    this.props.filterRef(this.resetFilter)
  }

  // Get rule based and category id from category detail REDUX instead of props from itemDetail
  getItemFilter = () => {
    const { itemDetail, categoryDetail } = this.props
    let rulebased = false
    let urlKey = (!isEmpty(itemDetail.data)) ? itemDetail.data.url_key : (!isEmpty(categoryDetail.data)) ? categoryDetail.data.url_key : ''
    if (!isEmpty(categoryDetail.data) && categoryDetail.data.is_rule_based === '1') {
      rulebased = true
    }
    let categoryId = ''
    if (!isEmpty(categoryDetail.data)) {
      categoryId = categoryDetail.data.category_id
    }
    // Make sure the category send to get filter data has .html
    if (!urlKey.includes('.html') && !isEmpty(urlKey)) {
      urlKey = `${urlKey}.html`
    }
    this.props.navigationFilterRequest(urlKey || '', itemDetail.search || '', rulebased, categoryId, '', this.props.companyCode)
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    let returnObj = {}
    if ((prevState.itemDetail !== nextProps.itemDetail) && !isEmpty(nextProps.itemDetail.data.url_key)) {
      returnObj = {
        ...returnObj,
        itemDetail: nextProps.itemDetail,
        newItem: true
      }
    }

    if (prevState.navigationFilter !== nextProps.navigationFilter) {
      if (prevState.newItem) {
        returnObj = {
          ...returnObj,
          newItem: false
        }
      }
      returnObj = {
        ...returnObj,
        colors: [],
        brands: [],
        labels: [],
        maxPrice: '',
        minPrice: '',
        deliveryServices:
        [
          { text: 'EXPRESS COURIER', checked: false }
          // {
          //   text: 'GO-SEND Same day',
          //   checked: false
          // },
          // {
          //   text: 'GO-SEND Instant',
          //   checked: false
          // }
        ],
        navigationFilter: nextProps.navigationFilter
      }
    }
    return returnObj
  }

  componentDidUpdate (prevProps) {
    const { navigationFilter, colors, brands, newItem } = this.state

    if (newItem) {
      // this.resetFilter()
      this.getItemFilter()
    }

    if (!isEmpty(navigationFilter.data) && isEmpty(colors) && isEmpty(brands)) {
      let labelIndex = navigationFilter.data.findIndex(data => data.filter_name === 'label')
      let brandIndex = navigationFilter.data.findIndex(data => data.filter_name === 'brand')
      let colorIndex = navigationFilter.data.findIndex(data => data.filter_name === 'color')
      if (isNumber(labelIndex) && labelIndex !== -1) {
        this.setupLabel(navigationFilter.data[labelIndex])
      }
      if (isNumber(brandIndex) && brandIndex !== -1) {
        this.setupBrand(navigationFilter.data[brandIndex])
      }
      if (isNumber(colorIndex) && colorIndex !== -1) {
        this.setupColor(navigationFilter.data[colorIndex])
      }
    }
  }

  setupBrand = (data = {}) => {
    let brandArr = []
    if (data.filter_values) {
      data.filter_values.forEach(brand => {
        let brandDetail =
          {
            value: data.isFromAlgolia ? brand : brand.value,
            value_id: brand.value_id,
            isChecked: false
          }
        brandArr.push(brandDetail)
      })
    }
    this.setState({
      brands: brandArr
    })
  }

  setupLabel = (data = {}) => {
    let labelArr = []

    if (data.filter_values) {
      data.filter_values.forEach(label => {
        let labelDetail = {
          value: data.isFromAlgolia ? label : label.value,
          value_id: label.value_id,
          isChecked: false
        }
        labelArr.push(labelDetail)
      })
    }
    this.setState({
      labels: labelArr
    })
  }

  setupColor = (data = {}) => {
    let colorArr = []
    if (data.filter_values) {
      data.filter_values.forEach(color => {
        let colorDetail =
          {
            value: color.value,
            value_id: color.value_id,
            isChecked: false,
            extra_information: color.extra_information
          }
        if (data.isFromAlgolia) {
          let algoColor = color.split('|')
          colorDetail = { ...colorDetail, extra_information: algoColor[0], value: algoColor[1] }
        }
        colorArr.push(colorDetail)
      })
    }
    this.setState({
      colors: colorArr
    })
  }

  setModalInfoVisible (visible) {
    this.setState({ modalInfoVisible: visible })
  }

  changeProvinceValue = (newProvinceId) => {
    this.setState({
      selectedProvince: newProvinceId,
      selectedCity: '',
      selectedDistrict: ''
    })
  }

  changeCityValue = (newCityId) => {
    this.setState({
      selectedCity: newCityId,
      selectedDistrict: ''
    })
  }

  changeDistrictValue = (newDistrictId) => {
    this.setState({ selectedDistrict: newDistrictId })
  }

  selectedBrand = (brand) => {
    let newArr = this.state.brands
    if (!isEmpty(newArr)) {
      let brandIndex = newArr.findIndex(data => data.value === brand.value)
      if (this.state.brands[brandIndex].isChecked) {
        newArr[brandIndex].isChecked = false
      } else {
        newArr[brandIndex].isChecked = true
      }
      this.setState({ brands: newArr })
    }
  }

  selectedLabel = (label) => {
    let labelArr = this.state.labels
    if (!isEmpty(labelArr)) {
      let labelIndex = labelArr.findIndex(data => data.value === label.value)
      labelArr[labelIndex].isChecked = !this.state.labels[labelIndex].isChecked
      this.setState({ labels: labelArr })
    }
  }

  selectedService = (serviceIndex) => {
    const { deliveryServices } = this.state
    let newArr = deliveryServices
    if (deliveryServices[serviceIndex].checked) {
      newArr[serviceIndex].checked = false
    } else {
      newArr[serviceIndex].checked = true
    }
    this.setState({ deliveryServices: newArr })
  }

  colorPressed = (index) => {
    let newArr = this.state.colors
    if (this.state.colors[index].isChecked) {
      newArr[index].isChecked = false
    } else {
      newArr[index].isChecked = true
    }
    this.setState({ colors: newArr })
  }

  resetBrands = () => {
    const { navigationFilter } = this.state
    let newNavigationFilter = get(navigationFilter, 'data[0]', {})
    if (has(newNavigationFilter, 'isFromAlgolia')) {
      let filter = find(navigationFilter.data, { filter_name: 'brand' })
      this.setupBrand(filter)
    } else {
      if (isEqual(newNavigationFilter.filter_name, 'brand') && navigationFilter.data.length > 1) {
        this.setupBrand(newNavigationFilter)
      } else if (isEqual(newNavigationFilter.filter_name, 'color')) {
        this.setupBrand(navigationFilter.data[1])
      }
    }
  }

  resetLabel = () => {
    const { navigationFilter } = this.state
    let labelIndex = navigationFilter.data.findIndex(data => data.filter_name === 'label')
    this.setupLabel(navigationFilter.data[labelIndex])
  }

  resetColors = () => {
    const { navigationFilter } = this.state
    let newNavigationFilter = get(navigationFilter, 'data[0]', {})
    if (has(newNavigationFilter, 'isFromAlgolia')) {
      let filter = find(navigationFilter.data, { filter_name: 'color' })
      this.setupColor(filter)
    } else {
      if (isEqual(newNavigationFilter.filter_name, 'brand') && navigationFilter.data.length > 1) {
        this.setupColor(navigationFilter.data[1])
      } else if (isEqual(newNavigationFilter.filter_name, 'color')) {
        this.setupColor(navigationFilter.data[1])
      }
    }
  }

  resetFilter = () => {
    const { deliveryServices } = this.state
    let newDerliveryService = [...deliveryServices]
    newDerliveryService.map(data => {
      data.checked = false
    })
    this.setState({
      minPrice: '',
      maxPrice: '',
      searchBrand: '',
      selectedProvince: '490',
      selectedCity: '573',
      selectedDistrict: '7004',
      provinceName: 'DKI JAKARTA',
      cityName: 'KOTA. JAKARTA BARAT',
      districtName: 'KEMBANGAN',
      deliveryServices: newDerliveryService,
      numberErr: ''
    })
    this.resetBrands()
    this.resetColors()
    this.resetLabel()
  }

  renderSelectedColor = (color) => {
    let r, g, b, hsp, colorBrightness
    let colorRGB = +('0x' + color.extra_information.slice(1).replace(color.extra_information.length < 5 && /./g, '$&$&'))
    r = colorRGB >> 16
    g = color >> 8 & 255
    b = color & 255
    hsp = Math.sqrt(
      0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    )
    if (hsp > 127) {
      colorBrightness = 'light'
    } else {
      colorBrightness = 'dark'
    }
    if (color.value.toLowerCase() === 'lainnya' || color.value.toLowerCase() === 'mix' || color.value.toLowerCase() === 'transparan') {
      let imageSource
      switch (color.value) {
        case 'Lainnya':
          imageSource = require('../assets/images/others-color.webp')
          break
        case 'Mix':
          imageSource = require('../assets/images/mixed-color.webp')
          break
        case 'Transparan':
          imageSource = require('../assets/images/transparant-color.webp')
          break
        default:
          break
      }
      return (
        <View style={{
          borderRadius: 100 / 2,
          marginTop: 15,
          marginRight: 10
        }}>
          <ImageBackground
            style={{ height: 50, width: 50, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}
            imageStyle={{ borderRadius: 50 }}
            source={imageSource}>
            {(color.isChecked)
              ? <Icon name='check' color={(color.value.toLowerCase() === 'lainnya' || color.value.toLowerCase() === 'transparan') ? 'black' : 'white'} size={18} />
              : null
            }
          </ImageBackground>
        </View>
      )
    } else {
      return (
        <View
          style={{
            backgroundColor: color.extra_information,
            width: 50,
            height: 50,
            borderRadius: 100 / 2,
            borderWidth: 1,
            borderColor: '#E5E9F2',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
            paddingLeft: 12,
            paddingRight: 12,
            marginRight: 10
          }}
        >
          <View>
            {(color.isChecked)
              ? <Icon name='check' color={(colorBrightness === 'light') ? 'black' : 'white'} size={18} />
              : <Icon name='check' color={color.extra_information} size={18} />
            }
          </View>
        </View>
      )
    }
  }

  applyFilter = () => {
    const { colors, brands, deliveryServices, maxPrice, minPrice, labels } = this.state
    let data = {
      colors, brands, deliveryServices, maxPrice, minPrice, labels
    }
    if (!isEmpty(maxPrice) && !isEmpty(minPrice) && Number(maxPrice) < Number(minPrice)) {
      this.setState({ numberErr: 'Harga maximum tidak boleh lebih rendah dari harga minimum' })
    } else {
      this.setState({ numberErr: '' })
      let selectedBrands = []
      let selectedColors = []
      let selectedLabels = []
      let algolia = {
        brands: [],
        colors: [],
        labels: [],
        canGosend: ''
      }

      // Get selected Brands
      data.brands.forEach(brand => {
        if (brand.isChecked) {
          selectedBrands.push(brand.value_id)
          algolia.brands.push(brand.value)
        }
      })
      // Get selected colors
      data.colors.forEach(color => {
        if (color.isChecked) {
          selectedColors.push(color.value_id)
          algolia.colors.push(`${color.extra_information}|${color.value}`)
        }
      })
      data.labels.forEach(label => {
        if (label.isChecked) {
          selectedLabels.push(label.value_id)
          algolia.labels.push(label.value)
        }
      })

      const canGosend = (!isEmpty(deliveryServices) && deliveryServices[0].checked) ? 1 : 0
      if (canGosend === 1) algolia.canGosend = '1,2'
      // if (data.deliveryServices[0].checked) {
      //   canGosendArr.push('1')
      // }

      // if (data.deliveryServices[1].checked) {
      //   canGosendArr.push('2')
      // }

      // let canGosend = ''
      // if (canGosendArr.length > 0) {
      //   canGosend = canGosendArr.join(',')
      // }

      this.props.productHandlerSetFilter(selectedColors, data.minPrice, data.maxPrice, selectedBrands, canGosend, selectedLabels, algolia, this.props.companyCode)
      this.setModalFilterVisible(false)
    }
  }

  picupDelivLocation () {
    const { province, city, kecamatan } = this.props.location
    let provinceName = (get(province, 'province_name', 'DKI JAKARTA')).toLowerCase()
    let cityName = (get(city, 'city_name', 'KOTA. JAKARTA BARAT')).toLowerCase()
    let kecamatanName = (get(kecamatan, 'kecamatan_name', 'KEMBANGAN')).toLowerCase()
    return `${UpperCase(provinceName)}, ${UpperCase(cityName)}, ${UpperCase(kecamatanName)}`
  }

  renderFilterComponent () {
    const { deliveryServices, maxPrice, minPrice } = this.state
    const { expressDelivery, navigationFilter } = this.props
    if (navigationFilter.fetching) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      )
    } else {
      const { height } = Dimensions.get('screen')
      return (
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <View style={styles.modalFilterHeader}>
            <TouchableOpacity onPress={() => this.resetFilter()}>
              <Text style={{ color: '#00A6F5', fontFamily: 'Quicksand-Medium' }}>Reset</Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Filter</Text>
            <TouchableOpacity style={{ paddingHorizontal: 5, paddingVertical: 5 }}>
              <Icon name='close-circle' color='#D4DCE6' size={24} onPress={() => this.setModalFilterVisible(false)} />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ height: height * 0.8 }} keyboardShouldPersistTaps={'handled'}>
            <View style={styles.cardContent}>
              <Text style={styles.cardHeader}>Lokasi Pengiriman / Pengambilan</Text>
              <Text style={{ fontSize: 12, fontFamily: 'Quicksand-Bold', color: '#757886' }}>{this.picupDelivLocation()}</Text>
              <ShippingLocation fromFilter />
            </View>
            {(!isEmpty(expressDelivery)) &&
            (expressDelivery.same_day === '1' || expressDelivery.instant_delivery === '1')
              ? <View style={styles.cardContent}>
                <Text style={styles.cardHeader}>Dukungan Pengiriman</Text>
                <TouchableOpacity onPress={() => this.selectedService(0)} style={styles.deliveryItemView}>
                  <Checkbox
                    onPress={() => this.selectedService(0)}
                    selected={deliveryServices[0].checked}
                  />
                  <Text style={{ fontFamily: 'Quicksand-Regular', marginLeft: 15, color: '#757886' }}>{deliveryServices[0].text}</Text>
                </TouchableOpacity>
                {/* {(expressDelivery.instant_delivery === '1')
                  ? <TouchableOpacity onPress={() => this.selectedService(1)} style={styles.deliveryItemView}>
                    <Checkbox
                      onPress={() => this.selectedService(1)}
                      selected={deliveryServices[1].checked}
                    />
                    <View>
                      <Text style={{ fontFamily: 'Quicksand-Regular', marginLeft: 15, color: '#757886' }}>{deliveryServices[1].text}</Text>
                    </View>
                  </TouchableOpacity>
                  : null
                } */}
                <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => { this.setModalInfoVisible(true) }}>
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
            <View style={styles.cardContent}>
              <Text style={styles.cardHeader}>Harga</Text>
              <Text style={{ fontFamily: 'Quicksand-Regular', color: 'red' }}>{this.state.numberErr}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <FormS style={{ flexDirection: 'row', width: '45%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E9F2', padding: 6, height: 40 }}>
                  <Text style={{ marginRight: 5, fontFamily: 'Quicksand-Regular', color: '#757886' }}>Rp </Text>
                  <Input
                    placeholder='minimum'
                    placeholderTextColor='#b2bec3'
                    underlineColorAndroid='transparent'
                    selectionColor='rgba(242, 101, 37, 1)'
                    value={NumberWithCommas(minPrice)}
                    onChangeText={(minPrice) => this.setState({ minPrice: NumberFormat(minPrice) })}
                    returnKeyType='done'
                    keyboardType='numeric'
                  />
                </FormS>
                <FormS style={{ flexDirection: 'row', width: '45%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E9F2', padding: 6, height: 40 }}>
                  <Text style={{ marginRight: 5, fontFamily: 'Quicksand-Regular', color: '#757886' }}>Rp </Text>
                  <Input
                    placeholder='maximum'
                    placeholderTextColor='#b2bec3'
                    selectionColor='rgba(242, 101, 37, 1)'
                    underlineColorAndroid='transparent'
                    value={NumberWithCommas(maxPrice)}
                    onChangeText={(maxPrice) => this.setState({ maxPrice: NumberFormat(maxPrice) })}
                    returnKeyType='done'
                    keyboardType='numeric'
                  />
                </FormS>
              </View>
            </View>
            {(!isEmpty(this.state.brands))
              ? <FilterBrands
                brands={this.state.brands}
                selectedBrand={this.selectedBrand.bind(this)}
                resetBrands={this.resetBrands}
              />
              : null
            }
            {(!isEmpty(this.state.labels)) &&
              <FilterLabel
                labels={this.state.labels}
                selectedLabel={this.selectedLabel}
                resetLabels={this.resetLabel}
              />
            }
            {(!isEmpty(this.state.colors))
              ? <FilterColors
                colors={this.state.colors}
                colorPressed={this.colorPressed.bind(this)}
                resetColors={this.resetColors}
              />
              : null
            }
          </ScrollView>
          <TouchableOpacity style={[styles.buttonApplyCard, { marginBottom: 15 }]} onPress={() => this.applyFilter()}>
            <Text style={styles.btnText}>Terapkan</Text>
          </TouchableOpacity>
          <Modal
            animationType='slide'
            transparent={false}
            visible={this.state.modalInfoVisible}
            onRequestClose={() => {
              this.setModalInfoVisible(false)
            }}>
            <SafeAreaView style={{ flex: 1 }}>
              <ScrollView style={{ height: Dimensions.get('window').height * 0.9 }}>
                <ModalHeader>
                  <Icon name='close-circle' size={24} color='white' />
                  <TextModal>Informasi Pengiriman</TextModal>
                  <Icon name='close-circle' size={24} color='#D4DCE6' onPress={() => {
                    this.setModalInfoVisible(false)
                  }} />
                </ModalHeader>
                <GoSendTnc />
              </ScrollView>
            </SafeAreaView>
          </Modal>
        </View>
      )
    }
  }

  checkFilter = () => {
    let filtered = false
    const { colors, brands, labels, canGoSend, maxPrice, minPrice } = this.props.productHandler
    if (!isEmpty(colors) || !isEmpty(brands) || !isEmpty(labels) || !isEmpty(canGoSend) || !isEmpty(maxPrice) || !isEmpty(minPrice)) {
      filtered = true
    }
    return filtered
  }

  render () {
    return (
      <View style={{ flex: 0.5 }}>
        <HeaderPills onPress={() => this.setModalFilterVisible(true)}>
          <View style={{ flexDirection: 'row' }}>
            {this.checkFilter() && <Octicons name={'primitive-dot'} color='#FF7F45' /> }
            <Icon name='filter-outline' color='#757886' />
          </View>
          <MarginRightS>
            <Text style={{ fontFamily: 'Quicksand-Regular', color: '#757886' }}>Filter</Text>
          </MarginRightS>
        </HeaderPills>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalFilterVisible}
          onRequestClose={() => {
            this.setModalFilterVisible(false)
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {this.renderFilterComponent()}
          </SafeAreaView>
        </Modal>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  misc: state.misc,
  province: state.misc.province,
  city: state.misc.city,
  district: state.misc.kecamatan,
  navigationFilter: state.navigationFilter,
  expressDelivery: state.misc.expressDelivery,
  categoryDetail: state.categoryDetail,
  location: state.location,
  productHandler: state.productHandler
})

const mapDispatchToProps = (dispatch) => ({
  productHandlerSetFilter: (colors, minPrice, maxPrice, brands, canGoSend, labels, algolia, companyCode) => dispatch(ProductHandlerActions.productHandlerSetFilter(colors, minPrice, maxPrice, brands, canGoSend, labels, algolia, companyCode)),
  navigationFilterRequest: (category, keyword, isRuleBased, categoryId, storeCode, companyCode) => dispatch(NavigationFilterActions.filterRequest(category, keyword, isRuleBased, categoryId, storeCode, companyCode))
})

export default WithContext(connect(mapStateToProps, mapDispatchToProps)(FilterComponent))
