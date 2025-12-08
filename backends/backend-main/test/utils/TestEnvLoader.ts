import * as dotenv from 'dotenv'
import { join } from 'path'

let isLoaded = false

export function loadTestEnvironment(): void {
  if (isLoaded) return

  const environment = process.env.ENVIRONMENT || 'test'
  const envFilePath = join(__dirname, '..', '..', 'src', 'config', `.env.${environment}`)
  console.log(`🔧 Loading environment from: ${envFilePath}`)
  dotenv.config({ path: envFilePath })
  isLoaded = true
}

export const testEnvLoader = { loadTestEnvironment }
