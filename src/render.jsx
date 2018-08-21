/* eslint-disable no-console */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import App from './core/App/index'
import { loadUserData } from './store/user/actions'

store.dispatch(loadUserData())

export default (target = document) => {
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    target.getElementById('root')
  )
}
