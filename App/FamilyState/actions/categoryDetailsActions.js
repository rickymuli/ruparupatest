import api from '../ApiContext'
import get from 'lodash/get'
export const actions = (props) => {
  const { dispatch, state, useActions } = props
  return {
    request: async (data = {}, callBack) => {
      const action = useActions(state, dispatch)
      dispatch({ name: 'categoryDetails', type: 'request' })
      try {
        const res = await api.getCategoryDetail(data)
        if (res.status === 200) {
          if (!res.data.error) {
            let resData = res.data.data
            dispatch({ name: 'categoryDetails', type: 'success', data: resData })
            if (data.urlKey) {
              resData['boostEmarsys'] = get(data, 'boostEmarsys', '')
              action.products.getProductByCategory(resData)
            } else action.products.getProductByKeyword(resData)
            // let identifier = resData.url_key
            // if (identifier.includes('.html')) identifier = identifier.substring(0, identifier.length - 5)
            // action.tahu.getCmsBlockDetail(identifier)
            // callBack && callBack(res)
          } else dispatch({ name: 'categoryDetails', type: 'failure', error: res.data.message })
        } else dispatch({ name: 'categoryDetails', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      } catch (e) {
        if (__DEV__) console.log('error', e)
        dispatch({ name: 'categoryDetails', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      }
    }
  }
}

export default actions
