import {INestApplication, ValidationPipe} from '@nestjs/common'

export const runSharedInitializationWithTest = async (
  app: INestApplication,
): Promise<void> => {
  // Enable global validation for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {enableImplicitConversion: false},
    }),
  )
}
