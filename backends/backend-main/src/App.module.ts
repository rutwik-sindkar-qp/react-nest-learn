import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { TodoModule } from './modules/todo/TodoModule';
import { InfraModule } from './modules/infra/InfraModule';
import { loadAppConfig } from './config/loadAppConfig';

// Debug: show exact env file path being used
console.log(
  "ENV FILE PATH:",
  resolve(process.cwd(), 'src/config', `.env.${process.env.ENVIRONMENT || 'development'}`)
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), 'src/config', `.env.${process.env.ENVIRONMENT || 'development'}`),
      load: [loadAppConfig],
    }),
    TodoModule,
    InfraModule,
  ],
})
export class AppModule {}
