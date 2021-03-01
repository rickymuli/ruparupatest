// import UrlParser from '../Utils/Misc/UrlParser'
import { Navigate } from './NavigationService'
import drop from 'lodash/drop'
import join from 'lodash/join'
import split from 'lodash/split'
import config from '../../localConfig'
import includes from 'lodash/includes'
import { urlToObject } from '../Utils/Misc/UrlParser'

const urldef = 'https://ruparupamobileapp.page.link/?link=https://www.ruparupa.com/'
const urlMobile = 'https://ruparupamobileapp.page.link/?link=https://m.ruparupa.com'

const newUrldef = 'https://ruparupa.page.link/?link=https://www.ruparupa.com/'
const multiStgUrlDesktop = `https://ruparupa.page.link/?link=${config.baseWebURL}`
const multiStgUrlMobile = `https://ruparupa.page.link/?link=${config.baseURL}`
const newUrlMobile = 'https://ruparupa.page.link/?link=https://m.ruparupa.com/'

export const navigateParamLinking = (url) => {
  if (url && includes(url, 'page.link') && includes(url, '?') && !includes(url, 'mp-s') && !includes(url, 'mp-t')) {
    let newUrl = decodeURIComponent(url)
    if (includes(url, '/ace')) {
      newUrl = newUrl.replace('/ace', '')
    } else if (includes(url, '/informa')) {
      newUrl = newUrl.replace('/informa', '')
    }
    try {
      let urlParam = ''
      if (url.includes(urldef)) urlParam = newUrl.replace(urldef, '')
      else if (url.includes(urlMobile)) urlParam = newUrl.replace(urlMobile, '')
      else if (url.includes(newUrldef)) urlParam = newUrl.replace(newUrldef, '')
      else if (url.includes(multiStgUrlDesktop)) urlParam = newUrl.replace(multiStgUrlDesktop, '')
      else if (url.includes(multiStgUrlMobile)) urlParam = newUrl.replace(multiStgUrlMobile, '')
      else if (url.includes(newUrlMobile)) urlParam = newUrl.replace(newUrlMobile, '')
      else return null
      let urlSplit = newUrl.split('?')
      let newArray = urlSplit[1].split('/').slice(-2)
      if (urlParam.match(/confirmation/)) {
        let regex = /([-?]invoiceId=|&email=)/g
        newArray = split(urlParam.replace(regex, '/'), '/')
      } else newArray = split(urlParam, '/')
      let itmParameter = urlSplit[2] ? urlToObject(urlSplit[2]) : {}
      let dir = 'ProductDetailPage'
      let param = { itmParameter }
      switch (newArray[0]) {
        case 'pdp':
          dir = 'ProductDetailPage'
          param['itemData'] = { url_key: newArray[1].replace('%3F', '?') }
          break
        case 'pcp':
          dir = 'ProductCataloguePage'
          if (newArray[1] === 'jual') {
            param['itemDetail'] = { data: { url_key: '' }, search: newArray[2].replace('-', ' ') }
          } else {
            let slice = drop(newArray)
            param['itemDetail'] = { data: { url_key: join(slice, '/') } }
          }
          break
        case 'promopage':
          dir = 'PromoPage'
          let slice = drop(newArray)
          param['itemDetail'] = { data: { url_key: join(slice, '/') }, search: '' }
          break
        case 'confirmation':
          dir = 'ConfirmationReorder'
          param['itemData'] = { invoiceId: newArray[1], email: newArray[2] }
          break
        default:
          break
      }
      Navigate(dir, param)
    } catch (error) {
      console.log('error', error)
    }
  }
}
