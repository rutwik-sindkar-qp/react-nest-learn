/* eslint-disable no-restricted-exports */
import {stopDockerContainer} from './TestDatabaseUtil'

const teardown = async (): Promise<void> => {
  console.log('🏁 GLOBAL TEARDOWN START')
  await stopDockerContainer()
  console.log('✅ GLOBAL TEARDOWN END')
}

export default teardown
