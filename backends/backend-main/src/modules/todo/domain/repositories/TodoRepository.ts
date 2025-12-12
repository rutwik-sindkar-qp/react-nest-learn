import {DataSource, Repository} from 'typeorm'
import {TodoEntity} from '../entities/TodoEntity'
import {Inject, Injectable, Logger} from '@nestjs/common'

export const todoRepositoryProvider = [
  {
    provide: 'TODO_REPOSITORY',
    useFactory: (dataSource: DataSource): Repository<TodoEntity> =>
      dataSource.getRepository(TodoEntity),
    inject: ['DATA_SOURCE'],
  },
]

@Injectable()
export class TodoRepository {
  private logger = new Logger(TodoRepository.name)
  constructor(
    @Inject('TODO_REPOSITORY')
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async createTodo(todoEntity: TodoEntity): Promise<TodoEntity> {
    return await this.todoRepository.save(todoEntity)
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    return await this.todoRepository.findOne({where: {id}})
  }

  async getAllTodos(page: number, limit: number): Promise<TodoEntity[]> {
    const take = limit
    const skip = (page - 1) * limit

    this.logger.warn(typeof limit, typeof page, limit, page)
    this.logger.warn('skip value is ', skip)

    return await this.todoRepository.find({
      order: {id: 'ASC'},
      skip,
      take,
    })
  }

  async deleteAllTodos(): Promise<void> {
    await this.todoRepository.clear()
  }

  async testingOnlyCreateTodos(todos: TodoEntity[]): Promise<TodoEntity[]> {
    return await this.todoRepository.save(todos)
  }

  async updateTodo(todoEntity: TodoEntity): Promise<TodoEntity> {
    return await this.todoRepository.save(todoEntity)
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoRepository.delete(id)
  }
}
