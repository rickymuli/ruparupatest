import React, { Component, createContext } from 'react'

const { Provider, Consumer } = createContext({})

export class ContextProvider extends Component {
  render () {
    return (
      <Provider value={this.props.value}>
        {this.props.children}
      </Provider>
    )
  }
}
export const ContextConsumer = Consumer
export const WithContext = (Component) => {
  return (props) => (
    <Consumer>
      {contenx => <Component {...props} {...contenx} />}
    </Consumer>
  )
}

export default ContextProvider
