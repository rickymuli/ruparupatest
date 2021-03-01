import React, { useReducer } from 'react'

import { actions as productDetailActions } from '../actions/productDetailActions'
import { reducer as productDetailReducers, initialStates as productDetail } from '../reducers/productDetailReducers'

const initialStates = { productDetail }

const updateReducer = { productDetailReducers }

const reducers = (state = initialStates, action) => ({ ...state, [action.name]: updateReducer[`productDetailReducers`](state[action.name], action) })

const useActions = (state, dispatch) => {
  return { productDetail: productDetailActions({ state, dispatch }) }
}

let parent = {}

export const CreateParent = (Component, validate) => (props) => {
  const [state, dispatch] = useReducer(reducers, initialStates)
  const actions = useActions(state, dispatch)
  parent = { state, dispatch, actions }
  return (<Component {...props} state={parent.state.productDetail} dispatch={parent.dispatch} actions={parent.actions} />)
}
export const useParentState = () => parent.state

export const useParentDispatch = () => parent.dispatch

export const WithParent = (Component, validate) => (props) => {
  return (<Component {...props} productDetail={parent.state.productDetail} dispatch={parent.dispatch} actions={parent.actions} />)
}

export default { state: parent }
