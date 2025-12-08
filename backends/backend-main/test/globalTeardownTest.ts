import { stopDockerContainer } from './TestDatabaseUtil'

export default async (): Promise<void> => {
  console.log('🏁 GLOBAL TEARDOWN START')
  await stopDockerContainer()
  console.log('✅ GLOBAL TEARDOWN END')
}
