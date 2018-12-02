import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../actions'
import types from '../types'
import { initialState as settingsInitialState } from '../../settings/reducer'

beforeEach(() => {
  jest.resetModules()
  jest.clearAllMocks()
})

const settings = {
  portfolioFilters: {
    institution: { TD: true, BMO: true },
    account: { Checking: true, Savings: true }
  }
}

describe('settings actions', () => {
  describe('loadSettings', () => {
    it('should load settings', () => {
      expect(actions.loadSettings(settings)).toEqual({
        type: types.LOAD_SETTINGS,
        payload: settings
      })
    })
  })

  describe('createPortfolioFilters', () => {
    it('should add new institution filters', () => {
      expect(actions.createPortfolioFilters('institution', ['Questrade', 'TD'])).toEqual({
        type: 'CREATE_PORTFOLIO_FILTERS',
        payload: {
          filterName: 'institution',
          options: { Questrade: true, TD: true }
        }
      })
    })

    it('should add new account filters', () => {
      expect(actions.createPortfolioFilters('account', ['Checking'])).toEqual({
        type: 'CREATE_PORTFOLIO_FILTERS',
        payload: {
          filterName: 'account',
          options: { Checking: true }
        }
      })
    })
  })

  describe('deletePortfolioFilters', () => {
    it('should delete institution filters', () => {
      expect(actions.deletePortfolioFilters('institution', ['Questrade', 'TD'])).toEqual({
        type: 'DELETE_PORTFOLIO_FILTERS',
        payload: {
          filterName: 'institution',
          options: ['Questrade', 'TD']
        }
      })
    })
  })


  describe('updatePortfolioFilterValue', () => {
    it('should turn an institution filter off', () => {
      const mockStore = configureMockStore([thunk])
      const store = mockStore({
        settings: settingsInitialState
      })
      return store.dispatch(actions.updatePortfolioFilterValue('institution', 'Questrade', false))
        .then(() => {
          expect(store.getActions()).toEqual([
            {
              type: 'UPDATE_PORTFOLIO_FILTER_VALUE',
              payload: {
                filterName: 'institution',
                option: 'Questrade',
                value: false
              }
            }
          ])
        })
    })
  })

  describe('updatePortfolioFilters', () => {
    it('should add new filters', () => {
      const mockStore = configureMockStore([thunk])
      const store = mockStore({
        settings: settingsInitialState,
        transactions: {
          list: [{
            institution: 'Questrade',
            account: 'RRSP',
            type: 'buy',
            ticker: 'VCE.TO',
            shares: '1',
            bookValue: '1',
            createdAt: new Date()
          }]
        }
      })
      store.dispatch(actions.updatePortfolioFilters())
      expect(store.getActions()).toEqual([
        {
          type: 'CREATE_PORTFOLIO_FILTERS',
          payload: {
            filterName: 'institution',
            options: { Questrade: true }
          }
        },
        {
          type: 'CREATE_PORTFOLIO_FILTERS',
          payload: {
            filterName: 'account',
            options: { RRSP: true }
          }
        }
      ])
    })

    it('should remove existing filters', () => {
      const mockStore = configureMockStore([thunk])
      const store = mockStore({
        settings: {
          portfolioFilters: {
            institution: { TD: true },
            account: { Checking: true }
          }
        },
        transactions: {
          list: []
        }
      })
      store.dispatch(actions.updatePortfolioFilters())
      expect(store.getActions()).toEqual([
        {
          type: 'DELETE_PORTFOLIO_FILTERS',
          payload: {
            filterName: 'institution',
            options: ['TD']
          }
        },
        {
          type: 'DELETE_PORTFOLIO_FILTERS',
          payload: {
            filterName: 'account',
            options: ['Checking']
          }
        }
      ])
    })
  })
})
