import api from '../ApiContext'
export const actions = (props) => {
  const { dispatch } = props
  return {
    request: async (data, callBack) => {
      dispatch({ name: 'filter', type: 'request' })
      try {
        const res = await api.getFilter(data)
        if (res.status === 200) {
          if (!res.data.error) {
            let resData = res.data.data.filter((o) => ['label', 'brand', 'color'].includes(o.filter_name))
            // let reduceData = resData.reduce((result, key) => ({ ...result, [key.filter_name]: key.filter_values }), {})
            dispatch({ name: 'filter', type: 'success', data: resData })
          } else dispatch({ name: 'filter', type: 'failure', error: res.data.message })
        } else dispatch({ name: 'filter', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
        callBack && callBack()
      } catch (e) {
        if (__DEV__) console.log('error', e)
        dispatch({ name: 'filter', type: 'failure', error: 'Terjadi Kesalahan Koneksi' })
      }
    }
  }
}

export default actions
