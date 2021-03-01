import { useEffect } from 'react'
// import { Text, View } from 'react-native'
import { Navigate } from '../Services/NavigationService'
// import { useDispatch, useSelector } from 'react-redux'
import firebase from '@react-native-firebase/app'
// import _ from 'lodash'
import queryString from 'query-string'

const TrackUtm = props => {
  useEffect(() => {
    firebase.links()
      .getInitialLink()
      .then((url) => navigate(url))
  }, [])

  const navigate = (url) => {
    if (url) {
      const urlParam = queryString.parseUrl(url)
      const { page = '', method = '' } = urlParam.query
      let urlKey = urlParam.url.split('/').pop()
      let param = {
        itmData: {
          utm_source: urlParam.query.utm_source,
          utm_medium: urlParam.query.utm_medium,
          utm_campaign: urlParam.query.utm_campaign
        }
      }
      if (page === 'ProductCataloguePage') {
        param['itemDetail'] = (method === 'search')
          ? { data: { url_key: '' }, search: urlKey.replace('-', ' ') }
          : { data: { url_key: urlKey } }
      } else if (page === 'ProductDetailPage') param['itemData'] = { url_key: urlKey }
      else if (page === 'PromoPage') param['itemDetail'] = { data: { url_key: urlKey }, search: '' }
      Navigate(page, param)
    } else {
      // app NOT opened from a url
    }
  }

  return null
}

export default TrackUtm
