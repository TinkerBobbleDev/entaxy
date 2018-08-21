import uuid from 'uuid/v4'
import types from './types'
import { saveState } from '../user/actions'
import { updatePortfolioFilters } from '../settings/actions'
import { updateMarketValues } from '../marketValues/actions'

export const createTransaction = (transaction) => {
  return async (dispatch) => {
    dispatch({ type: types.CREATE_TRANSACTION, payload: { ...transaction, id: uuid() } })
    await dispatch(updateMarketValues())
    dispatch(updatePortfolioFilters())
    saveState()
  }
}
export const deleteTransaction = (index) => {
  return async (dispatch) => {
    dispatch({ type: types.DELETE_TRANSACTION, payload: index })
    await dispatch(updateMarketValues())
    dispatch(updatePortfolioFilters())
    saveState()
  }
}

export const loadTransactions = (transactions) => {
  return { type: types.LOAD_TRANSACTIONS, payload: transactions }
}
