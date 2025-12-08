import { DATA_SOURCE } from '@modules/infra/database/constants/DatabaseConstants'
import { TodoEntity } from '../entities/TodoEntity'
import { DataSource, Repository } from 'typeorm'

export const TodoRepositoryProvider = {
  provide: 'TODO_REPOSITORY',
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource) => {
    return dataSource.getRepository(TodoEntity) as Repository<TodoEntity>
  },
}
