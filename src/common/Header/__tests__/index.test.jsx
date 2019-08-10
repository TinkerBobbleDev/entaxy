import React from 'react'
import renderer from 'react-test-renderer'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'
import Header from '..'

jest.mock('../../LoginButton', () => 'LoginButton')

describe('Header', () => {
  it('matches snapshot', () => {
    const component = renderer.create((
      <Provider store={store}>
        <BrowserRouter>
          <Header match={{ path: '/dashboard' }}>
            <div>content</div>
          </Header>
        </BrowserRouter>
      </Provider>
    ))
    expect(component.toJSON()).toMatchSnapshot()
  })
})
