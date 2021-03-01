import api from '../ApiContext'
export const actions = (props) => {
  const { dispatch } = props
  return {
    getCmsBlockDetail: async (data, callBack) => {
      dispatch({ name: 'tahu', type: 'cmsBlockRequest' })
      try {
        const res = await api.getCmsBlockDetail(data)
        dispatch({ name: 'tahu', type: 'cmsBlockSuccess', data: res.data.data })
      } catch (e) {
        if (__DEV__) console.log('error', e)
        dispatch({ name: 'tahu', type: 'failure', error: e })
      }
      callBack && callBack()
    }
  }
}
export default actions
