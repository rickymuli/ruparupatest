export const actions = (props) => {
  const { dispatch, state, useActions } = props
  return {
    request: async (data, callBack) => {
      const action = useActions(state, dispatch)
      dispatch({ name: 'productsHandler', type: 'success', data })
      try {
        if (state.categoryDetails.data.url_key) action.products.getProductByCategory(undefined, { ...state.productsHandler, ...data }, callBack)
        else action.products.getProductByKeyword(undefined, { ...state.productsHandler, ...data }, callBack)
      } catch (e) {
        dispatch({ name: 'productsHandler', type: 'failure', error: e })
      }
    },
    reset: async (data, callBack) => {
      const action = useActions(state, dispatch)
      dispatch({ name: 'productsHandler', type: 'reset' })
      try {
        if (state.categoryDetails.data.url_key) action.products.getProductByCategory(undefined, {})
        else action.products.getProductByKeyword(undefined, {})
        callBack && callBack()
      } catch (e) {
        dispatch({ name: 'productsHandler', type: 'failure', error: e })
      }
    }
  }
}
export default actions
