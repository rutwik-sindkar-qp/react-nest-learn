import {DataSource} from 'typeorm'
import {DATA_SOURCE} from '../constants/DatabaseConstants'
import {ConfigService} from '@nestjs/config'
import {IAppConfig} from '@src/config/IAppConfig'
import {TodoEntity} from '@modules/todo/domain/entities/TodoEntity'

export const databaseProviders = [
  {
    provide: DATA_SOURCE,
    useFactory: async (configService: ConfigService): Promise<DataSource> => {
      const databaseConfig =
        configService.get<IAppConfig['database']>('database')
      if (!databaseConfig) {
        throw new Error('Database configuration is not defined')
      }

      const dataSource = new DataSource({
        type: 'mysql',
        host: databaseConfig.host,
        port: databaseConfig.port,
        username: databaseConfig.username,
        password: databaseConfig.password,
        database: databaseConfig.databaseName,
        //entities: [__dirname + '/../../**/*Entity{.ts,.js}'],
        entities: [TodoEntity],

        synchronize: true,
      })

      return dataSource.initialize()
    },
    inject: [ConfigService],
  },
]
