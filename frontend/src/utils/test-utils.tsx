import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createStoreWith } from '../store'
import { initialAppState, AppState } from '../reducers'

interface TestAppProviderProps {
    initState: AppState
}

const TestApp: React.FC<TestAppProviderProps> = props => {
    const { children, initState } = props
    return (
        <Provider store={createStoreWith(initState)}>
            {children}
        </Provider>
    )
}

type RenderParameters = Parameters<typeof render>

export const renderWithState = (ui: RenderParameters[0], initState: AppState = initialAppState, options?: RenderParameters[1]) =>
    render(<TestApp initState={initState}>{ui}</TestApp>, options)


// re-export everything
export * from '@testing-library/react'
