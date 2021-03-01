import React, { Component } from 'react'
import { Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import StepIndicator from 'react-native-step-indicator'

const getStepIndicatorIconConfig = ({ position, stepStatus }, status) => {
  let iconConfig = {
    name: 'clock-outline',
    color: (status === 'rejected') ? (stepStatus !== 'unfinished') ? '#FFFFFF' : '#aaaaaa' : (stepStatus !== 'unfinished') ? '#ffffff' : '#008CCF',
    size: 16
  }
  switch (position) {
    case 0: {
      iconConfig.name = 'clock-outline'
      break
    }
    case 1: {
      iconConfig.name = 'calendar'
      break
    }
    case 2: {
      iconConfig.name = 'truck'
      break
    }
    case 3: {
      iconConfig.name = 'check-circle'
      break
    }
    default: {
      break
    }
  }
  return iconConfig
}

export default class ReturnRefundProgressLine extends Component {
  renderStepIndicator = (params) => {
    return (
      <Icon {...getStepIndicatorIconConfig(params, this.props.status)} />
    )
  }

  renderLabel = ({ position, stepStatus, label, currentPosition }) => {
    let textColor = (this.props.status === 'rejected') ? (stepStatus !== 'unfinished') ? '#F3251D' : '#aaaaaa' : '#008CCF'
    return (
      <Text style={{ fontSize: 12, color: textColor, textAlign: 'center', fontFamily: 'Quicksand-Bold' }}>
        {label}
      </Text>
    )
  }

  render () {
    const { position, status } = this.props

    let labels = [
      'Proses Verifikasi',
      'Menunggu Jadwal Penjemputan',
      'Pengembalian Produk',
      'Pengembalian Berhasil'
    ]
    let indicatorStyles = {
      stepIndicatorSize: 30,
      currentStepIndicatorSize: 40,
      separatorStrokeWidth: 2,
      currentStepStrokeWidth: 3,
      stepStrokeCurrentColor: '#008CCF',
      stepStrokeWidth: 3,
      separatorStrokeFinishedWidth: 4,
      stepStrokeFinishedColor: '#008CCF',
      stepStrokeUnFinishedColor: '#aaaaaa',
      separatorFinishedColor: '#008CCF',
      separatorUnFinishedColor: '#aaaaaa',
      stepIndicatorFinishedColor: '#008CCF',
      stepIndicatorUnFinishedColor: '#ffffff',
      stepIndicatorCurrentColor: '#008CCF'
    }
    if (status === 'rejected') {
      labels[0] = 'Pengajuan ditolak'
      indicatorStyles.stepStrokeCurrentColor = '#F3251D'
      indicatorStyles.stepIndicatorCurrentColor = '#F3251D'
    }
    return (
      <>
        <StepIndicator
          customStyles={indicatorStyles}
          currentPosition={(position !== 0) ? position : 0}
          stepCount={labels.length}
          renderLabel={this.renderLabel}
          renderStepIndicator={this.renderStepIndicator}
          labels={labels}
        />
      </>
    )
  }
}
