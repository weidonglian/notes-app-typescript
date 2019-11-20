import React from 'react'
import { App } from './App'
import { testRender } from '../utils/test-utils'

test('renders without crashing', () => {
    const { container } = testRender(<App />)
    expect(container).toHaveTextContent("Learn React")
})
