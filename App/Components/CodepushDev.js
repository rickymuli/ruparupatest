import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, ScrollView, Platform, TouchableOpacity } from 'react-native'
// import lodashGet from 'lodash/get'
import map from 'lodash/map'
import floor from 'lodash/floor'
import isEmpty from 'lodash/isEmpty'
import find from 'lodash/find'
import filter from 'lodash/filter'
// import useRemoteFirebase from '../Hooks/useRemoteFirebase'
import useFirestore from '../Hooks/useFirestore'
import codePush from 'react-native-code-push'
import EasyModal from './EasyModal'
import * as Sentry from '@sentry/react-native'
import CodepushMandatoryModal from './CodepushMandatoryModal'
import { fonts, colors } from '../Styles'

const List = ({ name, value, nameStyle = {}, valueStyle = {}, style = {} }) => (
  <View style={[{ flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 2, borderColor: '#F0F2F7' }, style]}>
    <Text style={[{ fontFamily: fonts.medium, maxWidth: '48%' }, nameStyle]}>{name}</Text>
    <Text style={[{ fontFamily: fonts.bold, maxWidth: '50%', textAlign: 'right' }, valueStyle]}>{value}</Text>
  </View>
)

const renderCrasher = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 5 }}>
      <TouchableOpacity
        onPress={() => { throw new Error('Testing Mode - Javascript Crash') }}
        style={{ borderWidth: 1, borderColor: colors.tertiary, borderRadius: 5, padding: 8, marginRight: 20 }}>
        <Text style={{ color: colors.tertiary, fontFamily: fonts.bold }}>JS CRASH</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => Sentry.nativeCrash()} style={{ borderWidth: 1, borderColor: colors.tertiary, borderRadius: 5, padding: 8 }}>
        <Text style={{ color: colors.tertiary, fontFamily: fonts.bold }}>NATIVE CRASH</Text>
      </TouchableOpacity>
    </View>
  )
}

const CodepushDev = () => {
  const [name, setName] = useState('')
  const [status, setstatus] = useState('')
  const [progress, setprogress] = useState('')
  const [error, setError] = useState('')
  const [currentProject, setCurrentProject] = useState('')
  const [propsProgress, setPropsProgress] = useState(null)
  // const { data, fetching, get } = useRemoteFirebase()
  const { data, fetching } = useFirestore('codepush')

  useEffect(() => {
    if (!isEmpty(data)) {
      codePush.getUpdateMetadata()
        .then(metadata => {
          if (metadata) {
            let projectData = data
            if (Platform.OS === 'ios') {
              projectData = filter(data, o => { return o[Platform.OS] })
            }
            let project = find(projectData, o => { return o[Platform.OS] === metadata.deploymentKey })
            if (project.app_name) setCurrentProject(project.app_name)
          }
        })
    }
  }, [data])

  let modal
  const b2mB = bytes => floor(bytes / (1024 * 1024), 2)
  const syncCodepush = (param) => {
    setError('')
    setName(param.app_name)
    codePush.sync({ deploymentKey: param[Platform.OS], updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE }, status => {
      switch (status) {
        case codePush.SyncStatus.CHECKING_FOR_UPDATE:
          setstatus('Checking for Update')
          break
        case codePush.SyncStatus.DOWNLOADING_PACKAGE:
          setstatus('Downloading package')
          break
        case codePush.SyncStatus.INSTALLING_UPDATE:
          setstatus('Installing Update')
          break
        case codePush.SyncStatus.UP_TO_DATE:
          setstatus('Up to date')
          break
        case codePush.SyncStatus.UPDATE_INSTALLED:
          setstatus('Update installed.')
          break
        case codePush.SyncStatus.UNKNOWN_ERROR:
          setstatus('Error.')
          break
      }
    }, ({ receivedBytes = 0, totalBytes = 0 }) => {
      let prog = b2mB(receivedBytes) + '/' + b2mB(totalBytes) + ' MB'
      setPropsProgress((receivedBytes / totalBytes))
      setprogress(prog)
    }).catch((err = {}) => setError(err.message))
  }
  return (
    <View>
      <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => modal.setModal(true)}>
        <Text style={{ color: colors.secondary, letterSpacing: 2, paddingVertical: 10 }}>UPDATE PROJECT</Text>
      </TouchableOpacity>
      <EasyModal ref={r => (modal = r)} title={'Pilih project'} close>
        <View style={{ paddingBottom: 10 }}>
          <List name={'Current Project'} value={currentProject} />
          <List name={'Project To Install'} value={name} />
          <List name={'Status'} value={status} />
          <List name={'Download'} value={progress} />
          {!isEmpty(error) && <List name={'Error Log'} value={error} />}
        </View>
        {renderCrasher()}
        <CodepushMandatoryModal propsProgress={propsProgress} />
        <ScrollView>
          {fetching ? <ActivityIndicator />
            : map(data, (item, index) => {
              return (<TouchableOpacity style={{ alignSelf: 'center', margin: 8 }} key={index} onPress={() => syncCodepush(item)}>
                <Text style={{ color: colors.secondary, letterSpacing: 2, paddingVertical: 10 }}>{item.app_name}</Text>
              </TouchableOpacity>)
            })
          }
        </ScrollView>
      </EasyModal>
    </View>
  )
}

export default CodepushDev
