import {NestFactory} from '@nestjs/core'
import {AppModule} from './App.module'
import {runSharedInitializationWithTest} from './sharedAppInitializationWithTests'
import {AllExceptionsFilter} from './common/filters/AllExceptionsFilter'
import {HttpAdapterHost} from '@nestjs/core' // correct
import {Logger} from '@nestjs/common'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  // Logger for application startup
  const logger = new Logger('Bootstrap')

  // Run shared initialization (ValidationPipe, etc.)
  await runSharedInitializationWithTest(app)

  // Apply global exception filter
  const httpAdapter = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  // Start the application
  const port = process.env.PORT ?? 3000
  await app.listen(port)

  // Log that the application has started successfully
  logger.log(`Application started successfully on port ${port}`)
}

bootstrap()
