import React, { useReducer } from 'react'

// Context
import ContextProvider from '../../Context/CustomContext'

// import { useDispatch, useSelector } from 'react-redux'

import { actions as productsActions } from '../actions/productsActions'
import { reducer as productsReducers, initialStates as products } from '../reducers/productsReducers'
import { actions as categoryDetailsActions } from '../actions/categoryDetailsActions'
import { reducer as categoryDetailsReducers, initialStates as categoryDetails } from '../reducers/categoryDetailsReducers'
import { actions as productsHandlerActions } from '../actions/productsHandlerActions'
import { reducer as productsHandlerReducers, initialStates as productsHandler } from '../reducers/productsHandlerReducers'
import { actions as tahuActions } from '../actions/tahuActions'
import { reducer as tahuReducers, initialStates as tahu } from '../reducers/tahuReducers'
import { actions as filterActions } from '../actions/filterActions'
import { reducer as filterReducers, initialStates as filter } from '../reducers/filterReducers'

const initialStates = {
  products,
  categoryDetails,
  productsHandler,
  tahu,
  filter
}

const updateReducer = {
  productsReducers,
  categoryDetailsReducers,
  productsHandlerReducers,
  tahuReducers,
  filterReducers
}

const reducers = (state = initialStates, action) => ({ ...state, [action.name]: updateReducer[`${action.name}Reducers`](state[action.name], action) })

const useActions = (state, dispatch) => {
  return {
    products: productsActions({ state, dispatch }),
    categoryDetails: categoryDetailsActions({ state, dispatch, useActions }),
    productsHandler: productsHandlerActions({ state, dispatch, useActions }),
    tahu: tahuActions({ state, dispatch }),
    filter: filterActions({ state, dispatch })
  }
}

let parent = {}
let child = {}

export const CreateParent = (Component, validate) => (props) => {
  const [state, dispatch] = useReducer(reducers, initialStates)
  const actions = useActions(state, dispatch)
  // useEffect(() => {
  //   console.log('pcpStore', { newState: state })
  // }, [state])
  parent = { ...props, state, dispatch, actions }
  return (<ContextProvider value={parent}>
    <Component {...parent} />
  </ContextProvider>)
}
export const useParentState = () => parent.state

export const useParentDispatch = () => parent.dispatch

export const WithParent = (Component, validate) => (props) => (<Component {...props} state={parent.state} dispatch={parent.dispatch} actions={parent.actions} />)

export const CreateChild = (Component) => (props) => {
  // const [state, dispatch] = useReducer(reducers, initialStates)
  // const actions = useActions(state, dispatch)
  // useEffect(() => {
  //   console.log({ newState: state })
  // }, [state])
  child = {
    state: { ...parent.state, ...child.state },
    dispatch: { ...parent.dispatch, ...child.dispatch },
    actions: { ...parent.actions, ...child.actions }
  }
  return (<Component {...props} state={child.state} dispatch={child.dispatch} actions={child.actions} />)
}

export const WithChild = (Component) => (props) => <Component {...props} state={child.state} dispatch={child.dispatch} actions={child.actions} />

export default { state: parent }
