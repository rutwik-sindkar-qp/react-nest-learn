import {
  render,
  screen,
  waitForElementToBeRemoved,
  type RenderResult,
} from '@testing-library/react'
import {AppProviders} from '../providers/AppProviders'
import type {ReactElement} from 'react'

const GLOBAL_ROUTE_PREFIX = ''

export const testUtil = {
  waitForLoadingToFinish: (): Promise<void> =>
    waitForElementToBeRemoved(
      () => [
        ...screen.queryAllByTestId('spinner'),
        ...screen.queryAllByLabelText(/loading/i),
        ...screen.queryAllByText(/loading/i),
      ],
      {timeout: 10000},
    ),
  renderWithRoute: async function renderWithRoute(
    ui: ReactElement,
    {
      route = '/todos',

      ...renderOptions
    }: {route?: string; rest?: unknown[]} = {},
    waitForLoadingToFinish = true,
  ): Promise<RenderResult> {
    // remove the leading slash
    route = route.replace(/^\//, '')
    window.history.pushState({}, 'Test page', `/${GLOBAL_ROUTE_PREFIX}${route}`)
    const returnValue = {
      ...render(ui, {
        wrapper: AppProviders,
        ...renderOptions,
      }),
    }

    if (waitForLoadingToFinish) await testUtil.waitForLoadingToFinish()

    return returnValue
  },
} as const
