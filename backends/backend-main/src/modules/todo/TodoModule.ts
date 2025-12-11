import {Module} from '@nestjs/common'
import {TodoController} from './application/controllers/TodoController'
import {TodoService} from './application/services/TodoService'
import {InfraModule} from '@modules/infra/InfraModule'
import {DatabaseModule} from '@modules/infra/database/DatabaseModule'
import {
  TodoRepository,
  todoRepositoryProvider,
} from './domain/repositories/TodoRepository'

@Module({
  imports: [InfraModule, DatabaseModule],
  controllers: [TodoController],
  providers: [TodoService, ...todoRepositoryProvider, TodoRepository],
})
export class TodoModule {}
