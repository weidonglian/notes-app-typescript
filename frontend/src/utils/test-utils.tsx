import React, { ReactNode, ReactElement } from 'react'
import { render, RenderOptions, Queries } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '../store'

const TestAppProvider: React.FC = props => {
    const { children } = props
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

type RenderParameters = Parameters<typeof render>

const customRender = (ui: RenderParameters[0], options?: RenderParameters[1]) =>
    render(ui, { wrapper: TestAppProvider, ...options })


// re-export everything
export * from '@testing-library/react'
export * from '@testing-library/jest-dom/extend-expect'

// override render method
export { customRender as testRender }