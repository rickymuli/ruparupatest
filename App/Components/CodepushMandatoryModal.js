import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import codePush from 'react-native-code-push'
import Modal from 'react-native-modal'
import CustomProgressBar from '../Components/ProgressBar'
import { PrimaryText, PrimaryTextBold } from '../Styles'

const CodepushMandatoryModal = (props) => {
  const { isCodepushMandatory, propsProgress } = props
  const [modal, setModal] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => { if (isCodepushMandatory) setModal(true) }, [])

  useEffect(() => {
    if (isCodepushMandatory) {
      codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE }, status => {
        switch (status) {
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            setModal(true)
            break
          case codePush.SyncStatus.INSTALLING_UPDATE:
            setModal(false)
            break
        }
      }, ({ receivedBytes = 0, totalBytes = 0 }) => {
        setProgress((receivedBytes / totalBytes))
      }
      ).catch((err = {}) => console.log(err))
    }
  }, [isCodepushMandatory])

  useEffect(() => {
    if (propsProgress && (propsProgress > 0) && !isCodepushMandatory) {
      if (!modal) setModal(true)
      if (propsProgress === 1) setModal(false)
      setProgress(propsProgress)
    }
  }, [propsProgress])

  return (
    <Modal isVisible={modal}>
      <View style={{ margin: 15, backgroundColor: 'white', borderRadius: 5, padding: 20 }}>
        <PrimaryTextBold style={{ textAlign: 'center', paddingBottom: 5 }}>Mohon menunggu...</PrimaryTextBold>
        <PrimaryText style={{ textAlign: 'center', paddingBottom: 20 }}>Kami sedang melakukan instalasi patch update terbaru</PrimaryText>
        {/* <PrimaryText style={{ textAlign: 'center', paddingBottom: 10 }}>{Math.round((progress * 100))}%</PrimaryText> */}
        <CustomProgressBar progress={Math.round((progress * 100))} />
      </View>
    </Modal>
  )
}

export default CodepushMandatoryModal
