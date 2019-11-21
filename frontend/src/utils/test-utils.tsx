import React, { ReactNode, ReactElement } from 'react'
import { render, RenderOptions, Queries } from '@testing-library/react'
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

export const renderWith = (ui: RenderParameters[0], options?: RenderParameters[1]) =>
    render(<TestApp initState={initialAppState}>{ui}</TestApp>, options)

export const renderWithState = (ui: RenderParameters[0], initState: AppState = initialAppState, options?: RenderParameters[1]) =>
    render(<TestApp initState={initState}>{ui}</TestApp>, options)


// re-export everything
export * from '@testing-library/react'
