import React, { Component } from 'react'
import { View } from 'react-native'
import { InfoBox, FontSizeM, Bold } from '../Styles/StyledComponents'
import isEmpty from 'lodash/isEmpty'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { WithContext } from '../Context/CustomContext'

class ReturnInfoComponent extends Component {
  constructor (props) {
    super(props)
    this.state = {
      info: [
        {
          progress: 1,
          info: [
            {
              component: 'FontSizeM',
              desc: 'Lengkapi semua foto produk sesuai instruksi, format foto yang kami terima hanya JPG, JPEG, PNG dengan ukuran maksimal 2 MB'
            }
          ]
        },
        {
          progress: 3,
          info: [
            {
              component: 'FontSizeM',
              desc: 'Pengembalian dana akan dikembalikan sejumlah yang Anda bayarkan dalam bentuk voucher'
            },
            {
              component: 'FontSizeM',
              desc: 'Pembelian atau potongan dengan voucher tidak akan dikembalikan, kecuali voucher penukaran poin rewards'
            },
            {
              component: 'FontSizeM',
              desc: 'Pengembalian dana dapat dibagi menjadi beberapa voucher'
            },
            {
              component: 'Bold',
              desc: 'Data yang sudah dimasukkan tidak dapat di ganti'
            }
          ]
        },
        {
          progress: 4,
          info: [
            {
              component: 'FontSizeM',
              desc: 'Terima kasih, kami telah mengirimkan nomor pengembalian ke email Anda. Dalam 1-3 hari kerja kami akan mengirimkan email konfirmasi persetujuan pengembalian produk ke email ',
              email: props.customerEmail
            }
          ]
        }
      ]
    }
  }

  renderDescription = (infoData) => {
    let styleComponents = {
      FontSizeM, Bold
    }
    let Component = styleComponents[infoData.component]
    return (
      <View style={{ paddingHorizontal: 15, justifyContent: 'center' }}>
        <Component style={{ fontSize: 16 }}>
          {infoData.desc}
          {(infoData.hasOwnProperty('email')) &&
          <Bold style={{ fontSize: 16 }}>{infoData.email}</Bold>
          }
        </Component>
      </View>
    )
  }

  render () {
    const data = this.state.info.find((infoData) => infoData.progress === this.props.progress)
    if (!isEmpty(data)) {
      return (
        <View style={{ marginBottom: 10 }}>
          {data.info.map((infoData, index) => (
            <InfoBox key={`return info ${index}`}>
              <View style={{ paddingVertical: 10 }}>
                <Icon name='information-outline' size={16} style={{ marginRight: 5, marginTop: 2 }} />
              </View>
              {this.renderDescription(infoData)}
            </InfoBox>
          ))}
        </View>
      )
    } else {
      return null
    }
  }
}

export default WithContext(ReturnInfoComponent)
