import {setupServer} from 'msw/node'
import {mswDevHandlers} from './handlers/mswDevHandlers'

export const mswTestServer = setupServer(...[...mswDevHandlers])

export * from 'msw'
