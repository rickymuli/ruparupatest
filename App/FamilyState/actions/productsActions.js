import api from '../ApiContext'
export const actions = (props) => {
  const { dispatch, state } = props
  return {
    getProductByKeyword: async (data = {}, productsHandler = state.productsHandler, callBack) => {
      dispatch({ name: 'products', type: 'request' })
      try {
        let params = {
          ...productsHandler,
          ...data
        }
        const res = await api.getProductByKeyword(params)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ name: 'products', type: 'success', data: res.data.data })
          } else dispatch({ name: 'products', type: 'failure', error: res.data.message })
        }
      } catch (e) {
        dispatch({ name: 'products', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      }
      callBack && callBack()
    },
    getProductByCategory: async (data = state.categoryDetails.data, productsHandler = state.productsHandler, callBack) => {
      dispatch({ name: 'products', type: 'request' })
      try {
        let params = {
          ...productsHandler,
          category: data.url_key,
          categoryId: data.category_id,
          keyword: data.keyword,
          isRuleBased: data.is_rule_based === '1',
          boostEmarsys: data.boostEmarsys
        }
        const res = await api.getProductByCategory(params)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ name: 'products', type: 'success', data: res.data.data })
          } else dispatch({ name: 'products', type: 'failure', error: res.data.message })
        }
      } catch (e) {
        if (__DEV__) console.log('error', e)
        dispatch({ name: 'products', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      }
      callBack && callBack()
    },
    getMoreProducts: async (data, callBack) => {
      dispatch({ name: 'products', type: 'requestMoreProducts' })
      try {
        let params = {
          ...state.productsHandler,
          from: state.productsHandler.from + state.productsHandler.size
        }
        const res = (state.categoryDetails.data.url_key) ? await api.getProductByCategory(params) : await api.getProductByKeyword(params)
        if (res.status === 200) {
          if (!res.data.error) {
            dispatch({ name: 'productsHandler', type: 'success', data: { from: params.from } })
            dispatch({ name: 'products', type: 'addMoreProducts', more: res.data.data.products || [] })
          } else dispatch({ name: 'products', type: 'failure', error: res.data.message })
        }
        callBack && callBack()
      } catch (e) {
        dispatch({ name: 'productsHandler', type: 'failure', error: e })
      }
    }
  }
}
export default actions
