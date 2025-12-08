import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoEntity } from '../../domain/entities/TodoEntity';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async createTodo(title: string): Promise<TodoEntity> {
    const todo = new TodoEntity();
    todo.title = title;
    return await this.todoRepository.createTodo(todo);
  }

  async getTodoById(id: number): Promise<TodoEntity | null> {
    return await this.todoRepository.getTodoById(id);
  }
}
