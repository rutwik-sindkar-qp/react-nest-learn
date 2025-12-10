import { Injectable } from '@nestjs/common';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoEntity } from '../../domain/entities/TodoEntity';
import { TodoDto, UpdateTodoDto } from '../dtos/TodoDto';
import { NotFoundException } from '@nestjs/common';

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






  async getAllTodos(): Promise<TodoEntity[]> {
    return await this.todoRepository.getAllTodos(); // max 10
  }




  
 async updateTodo(id: number, updateData: UpdateTodoDto): Promise<TodoEntity> {
  const todo = await this.todoRepository.getTodoById(id);
  
  if (!todo) {
    throw new NotFoundException('Todo not found'); 
  }

  if (updateData.title !== undefined) {
    todo.title = updateData.title;
  }

  return await this.todoRepository.updateTodo(todo);
}


  async deleteTodo(id: number): Promise<boolean> {
    const todo = await this.todoRepository.getTodoById(id);
    if (!todo) return false;
    await this.todoRepository.deleteTodo(id);
    return true;
  }
}



