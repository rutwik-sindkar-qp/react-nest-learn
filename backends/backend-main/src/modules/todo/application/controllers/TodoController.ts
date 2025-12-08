import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TodoService } from '../services/TodoService';
import { TodoDto } from '../dtos/TodoDto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get(':id')
  async getTodo(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todoService.getTodoById(id);
    if (!todo) {
      return { id, title: `Todo with ID ${id} not found` };
    }
    return todo;
  }

  @Post()
  async createTodo(@Body() todoDto: TodoDto) {
    return await this.todoService.createTodo(todoDto.title);
  }
}
