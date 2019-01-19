import types from './types'

export const initialState = {
  isAuthenticatedWith: null,
  isLoginPending: false,
  username: null,
  name: null,
  pictureUrl: null,
  error: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SAVE_LOGIN_DATA:
      return { ...state, ...action.payload }
    case types.USER_LOGOUT:
      return initialState
    case types.USER_LOGIN_ERROR:
      return { ...state, error: action.payload }
    default:
      return state
  }
}
