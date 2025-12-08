import { NestFactory } from '@nestjs/core';
import { AppModule } from './App.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // Enable global validation for DTOs
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
  
  
}
bootstrap();



// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap():Promise<void> {
//   const app = await NestFactory.create(AppModule);



//  const port = process.env.PORT || 3350


//   await app.listen(port)
//   console.log(`Application is running on : https://localhost:${port}`);
  
// }
// bootstrap();



