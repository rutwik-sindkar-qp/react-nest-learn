import {afterEach} from 'vitest'
import {cleanup} from '@testing-library/react'
import * as ResizeObserverModule from 'resize-observer-polyfill'

import '@testing-library/dom'
import {mswTestServer} from '../msw/mswTestServer'
import '@testing-library/jest-dom/vitest'
import {todosMockDb} from '../msw/mockDbs/todosMockDb'

beforeAll(() => {
  // https://stackoverflow.com/a/72543616/8596140
  // This is required by wick-ui-lib WuModal component
  window.ResizeObserver = ResizeObserverModule.default
  HTMLElement.prototype.scrollIntoView = vi.fn()
  mswTestServer.listen()
})

beforeEach(() => {})

const originalConsoleError = console.error
afterEach(() => {
  // Reset all request handlers
  mswTestServer.resetHandlers()
  cleanup()
  console.error = originalConsoleError
  todosMockDb.reset()
})

afterAll(() => {
  mswTestServer.close()
})
