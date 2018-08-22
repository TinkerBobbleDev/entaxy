/* eslint-disable no-console */
import * as blockstack from 'blockstack'
import types from './types'
import store from '../index'
import * as storage from '../blockstackStorage'
import { loadSettings } from '../settings/actions'
import { loadTransactions } from '../transactions/actions'
import { loadMarketValues } from '../marketValues/actions'

export const dataIsLoading = (bool) => {
  return {
    type: types.DATA_IS_LOADING,
    payload: bool
  }
}

export const loadUserDataSuccess = userData => (
  {
    type: types.LOAD_USER_DATA_SUCCESS,
    payload: userData
  }
)

export const loadUserData = () => {
  return (dispatch) => {
    if (blockstack.isUserSignedIn()) {
      dispatch(dataIsLoading(true))

      const { username, profile } = blockstack.loadUserData()
      const person = new blockstack.Person(profile)

      dispatch(loadUserDataSuccess({
        isAuthenticated: true,
        username,
        name: person.name(),
        pictureUrl: person.avatarUrl()
      }))

      storage.loadState().then((state) => {
        dispatch(loadSettings((state || {}).settings))
        dispatch(loadTransactions((state || {}).transactions))
        dispatch(loadMarketValues((state || {}).marketValues))
        dispatch(dataIsLoading(false))
      }).catch((error) => {
        console.log('Error: ', error)
      })
    }
    return null
  }
}

export const userLogin = () => {
  // Open the blockstack browser for sign in
  blockstack.redirectToSignIn(`${window.location.origin}/handle-login`)
  return { type: types.USER_LOGIN }
}

export const userLoginError = (error) => {
  return { type: types.USER_LOGIN_ERROR, payload: error }
}

export const handleBlockstackLogin = () => {
  return (dispatch) => {
    // Handle sign in from Blockstack after redirect from Blockstack browser
    return blockstack.handlePendingSignIn()
      .then(
        () => {
          dispatch(loadUserData())
        },
        error => dispatch(userLoginError(error))
      )
  }
}

export const userLogout = () => {
  blockstack.signUserOut()
  return { type: types.USER_LOGOUT }
}

export const saveState = () => {
  storage.saveState(store.getState())
}
