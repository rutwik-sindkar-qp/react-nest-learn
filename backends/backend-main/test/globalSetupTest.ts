import {ensureDockerContainerRunning} from './TestDatabaseUtil'
import {testEnvLoader} from './utils/TestEnvLoader'

testEnvLoader.loadTestEnvironment()

module.exports = async (): Promise<void> => {
  console.log('\n🚀 GLOBAL SETUP START')

  if (!process.env.SKIP_TEST_DOCKER_SETUP) {
    const containerRunning = await ensureDockerContainerRunning()
    if (!containerRunning) {
      throw new Error('❌ Failed to start MySQL Docker container')
    }
  }

  console.log('✅ GLOBAL SETUP END')
}
