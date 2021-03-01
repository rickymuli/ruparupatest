import React, { useEffect, useState, useRef } from 'react'
import { View, Image, Text, Linking, TouchableOpacity, Platform, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { RemoteConfig } from '../Services/Firebase'
import config from '../../config.js'
import isEmpty from 'lodash/isEmpty'
import snakeCase from 'lodash/snakeCase'
import has from 'lodash/has'
import gt from 'lodash/gt'
import upperFirst from 'lodash/upperFirst'

import dayjs from 'dayjs'
import EasyModal from '../Components/EasyModal'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Navigate } from '../Services/NavigationService'

const { width, height } = Dimensions.get('screen')

const UpdateComponent = ({ param }) => {
  const [data, setData] = useState({})
  const remoteConfig = useSelector(state => state.remoteConfig.data) || null
  let updateModal = useRef(false)
  // componentDidMount () {
  //   this.checkUpdate()
  // }

  useEffect(() => {
    let validationDate = true
    let isStg = config.developmentENV === 'stg' || config.developmentENV === 'dev'
    let newParam = `${snakeCase(param)}${isStg ? '_test' : ''}`

    if (remoteConfig && has(remoteConfig, newParam)) {
      let remoteConfigData = JSON.parse(remoteConfig[newParam].value)

      if (remoteConfigData.validByDate) {
        let currentDate = (dayjs().format('DD-MM-YYYY,HH:mm')).split(',')
        let newDate = remoteConfigData.date.split(',')
        validationDate = currentDate[0] >= newDate[0] && currentDate[1] >= newDate[1]
      }

      if (remoteConfigData.active && gt(remoteConfigData.updateVersion, config[`version${isStg ? 'Stg' : ''}${upperFirst(Platform.OS)}`]) && validationDate) {
        setData({ data: remoteConfigData })
        updateModal.setModal(true)
      }
    }
  }, [remoteConfig])

  const renderForceUpdate = () => {
    let newMessage = !isEmpty(data.message) ? data.message : 'Ruparupa versi terbaru telah hadir. Ayo perbaharui aplikasi ruparupa-mu untuk mendapatkan penawaran terbaru.'
    return (
      <View style={{ justifyContent: 'center', flexDirection: 'column', paddingTop: 20, paddingHorizontal: 10 }} >
        {data.closeModal &&
          <TouchableOpacity onPress={() => this.updateModal.setModal(false)} style={{ position: 'absolute', right: 0, top: 0, padding: 12, zIndex: 1 }} >
            <Icon name={'close'} size={26} />
          </TouchableOpacity>
        }
        <Image source={require('../assets/images/update-mobile-app.webp')} style={{ height: width, width: '100%', zIndex: 0 }} />
        <View style={{ paddingHorizontal: 20, paddingTop: 30 }}>
          <Text style={{ textAlign: 'center', width: '100%', fontSize: 16 }}>
            {newMessage}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15, paddingTop: 10 }}>
          <TouchableOpacity onPress={() => Linking.openURL((Platform.OS !== 'android' ? 'itms-apps://itunes.apple.com/us/app/id1324434624?mt=8' : 'https://play.google.com/store/apps/details?id=com.mobileappruparupa'))} style={{ backgroundColor: '#F26524', width: width * 0.70, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Perbaharui Aplikasi</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const renderMaintenance = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10, height: height * 0.80 }} >
        <Image source={require('../assets/images/maintenance.webp')} style={{ height: width, width: '100%' }} />
        {param === 'cartMaintenance' &&
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15, paddingTop: 10 }}>
            <TouchableOpacity onPress={() => Navigate('Homepage')} style={{ backgroundColor: '#F26524', width: width * 0.70, height: 40, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Quicksand-Medium', color: 'white', fontSize: 16 }}>Kembali ke Home</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }

  return (
    <EasyModal ref={(ref) => { updateModal = ref }} noclose={!data.closeModal} >
      {(param === 'maintenance' || param === 'cartMaintenance') && renderMaintenance()}
      {param === 'forceUpdate' && renderForceUpdate()}
    </EasyModal>
  )
}

export default UpdateComponent
