import {setupWorker} from 'msw/browser'
import {mswDevHandlers} from './handlers/mswDevHandlers'

export const mswDevServer = setupWorker(...mswDevHandlers)
