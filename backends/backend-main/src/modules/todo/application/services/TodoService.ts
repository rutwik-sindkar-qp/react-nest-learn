import {Injectable, Logger} from '@nestjs/common'
import {TodoRepository} from '../../domain/repositories/TodoRepository'
import {TodoEntity} from '../../domain/entities/TodoEntity'
import {UpdateTodoDto} from '../dtos/TodoDto'

@Injectable()
export class TodoService {
  private readonly logger = new Logger(TodoService.name)

  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(title: string): Promise<TodoEntity> {
    this.logger.log(`Creating todo in DB with title: ${title}`)
    const todo = new TodoEntity()
    todo.title = title
    const created = await this.todoRepository.createTodo(todo)
    this.logger.log(`Todo created in DB with ID: ${created.id}`)
    return created
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    this.logger.log(`Fetching todo from DB with ID: ${id}`)
    return await this.todoRepository.getTodoById(id)
  }

  async getAllTodos(page: number, limit: number): Promise<TodoEntity[]> {
    this.logger.log(
      `Fetching all todos from DB - page: ${page}, limit: ${limit}`,
    )
    return await this.todoRepository.getAllTodos(page, limit)
  }

  async updateTodo(
    id: number,
    updateData: UpdateTodoDto,
  ): Promise<TodoEntity | null> {
    this.logger.log(`Updating todo in DB with ID: ${id}`)
    const todo = await this.todoRepository.getTodoById(id)

    if (!todo) {
      this.logger.warn(`Todo not found in DB for update. ID: ${id}`)
      return null
    }

    if (updateData.title !== undefined) {
      todo.title = updateData.title
    }

    const updated = await this.todoRepository.updateTodo(todo)
    this.logger.log(`Todo updated in DB with ID: ${id}`)
    return updated
  }

  async deleteTodo(id: number): Promise<boolean> {
    this.logger.log(`Deleting todo from DB with ID: ${id}`)
    const todo = await this.todoRepository.getTodoById(id)
    if (!todo) {
      this.logger.warn(`Todo not found in DB for delete. ID: ${id}`)
      return false
    }
    await this.todoRepository.deleteTodo(id)
    this.logger.log(`Todo deleted from DB with ID: ${id}`)
    return true
  }
}
