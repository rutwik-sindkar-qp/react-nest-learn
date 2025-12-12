import {INestApplication, Logger} from '@nestjs/common'
import {Test, TestingModule} from '@nestjs/testing'

import {AppModule} from '@src/App.module'
import {runSharedInitializationWithTest} from '@src/sharedAppInitializationWithTests'

export interface ITestApp {
  app: INestApplication
  moduleRef: TestingModule
}

export const testSetupUtil = {
  startTestApp: async (): Promise<ITestApp> => {
    const logger = new Logger()

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .setLogger(logger)
      .compile()

    const app = moduleRef.createNestApplication()
    app.useLogger(['error', 'warn'])

    await runSharedInitializationWithTest(app)
    await app.init()

    return {app, moduleRef}
  },

  closeApp: async (testApp: ITestApp): Promise<void> => {
    await testApp.app.close()
  },
}
