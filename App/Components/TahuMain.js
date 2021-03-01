import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

// Tahu conditional rendering component
import TahuImage from './TahuImage'
import TahuVideo from './TahuVideo'
import TahuTextBox from './TahuTextBox'
import TahuEvent from './TahuEvent'
import TahuDivider from './TahuDivider'
import TahuProduct from './TahuProduct'
import TahuCMS from './TahuCMS'

class TahuMain extends PureComponent {
    components = {
      image: TahuImage,
      video: TahuVideo,
      divider: TahuDivider,
      text: TahuTextBox,
      event: TahuEvent,
      product: TahuProduct,
      special: TahuCMS
    }
    render () {
      const { item, navigation, toggleWishlist, callSnackbar, marketplaceAcquisition } = this.props
      const deviceScreenWidth = Dimensions.get('screen').width
      const componentHeight = (deviceScreenWidth / 640) * 320
      const TahuComponents = this.components[item.component]
      const type = parseInt(item.type) || item.type
      const width = (isEqual(type, 3) || isEqual(type, 4)) ? deviceScreenWidth * 0.5 : (isEqual(type, 6) ? (deviceScreenWidth / item.total) : deviceScreenWidth)
      return (
        <>
          {!isEmpty(item.current_schedule) &&
            <TahuComponents
              width={width}
              height={componentHeight}
              data={item.current_schedule}
              type={item.name}
              orientation={item.product_position}
              halfImage={item.half_image}
              useVoucher={item.use_voucher}
              totalCustomSlider={item.total}
              navigation={navigation}
              toggleWishlist={toggleWishlist}
              callSnackbar={callSnackbar}
              marketplaceAcquisition={marketplaceAcquisition}
            />
          }
        </>
      )
    }
}

export default TahuMain
