import {BadRequestException, Injectable} from '@nestjs/common'
import {TodoRepository} from '../../domain/repositories/TodoRepository'
import {TodoEntity} from '../../domain/entities/TodoEntity'
import {UpdateTodoDto} from '../dtos/TodoDto'

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(title: string): Promise<TodoEntity> {
    const todo = new TodoEntity()
    todo.title = title
    return await this.todoRepository.createTodo(todo)
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    return await this.todoRepository.getTodoById(id)
  }

  async getAllTodos(page?: string, limit?: string): Promise<TodoEntity[]> {
    const pageNum = Number(page)
    const limitNum = Number(limit)

    const finalPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum
    const finalLimit = isNaN(limitNum) || limitNum < 1 ? 10 : limitNum

    if (!isNaN(pageNum) && pageNum < 1) {
      throw new BadRequestException('Page must be >= 1')
    }

    if (!isNaN(limitNum) && limitNum <= 0) {
      throw new BadRequestException('Limit must be > 0')
    }

    return await this.todoRepository.getAllTodos(finalPage, finalLimit)
  }

  async updateTodo(
    id: number,
    updateData: UpdateTodoDto,
  ): Promise<TodoEntity | null> {
    const todo = await this.todoRepository.getTodoById(id)

    if (!todo) {
      return null
    }

    if (updateData.title !== undefined) {
      todo.title = updateData.title
    }

    return await this.todoRepository.updateTodo(todo)
  }

  async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.todoRepository.getTodoById(id)
    if (!todo) return false
    await this.todoRepository.deleteTodo(id)
    return true
  }
}
