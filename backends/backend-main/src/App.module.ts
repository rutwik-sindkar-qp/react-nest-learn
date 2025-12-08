import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { resolve } from 'path'
import { TodoModule } from './modules/todo/TodoModule'
import { InfraModule } from './modules/infra/InfraModule'
import { loadAppConfig } from './config/loadAppConfig'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, './config/.env.' + (process.env.ENVIRONMENT || 'development'))],
      load: [loadAppConfig],
    }),
    TodoModule,
    InfraModule,
  ],
})
export class AppModule {}
