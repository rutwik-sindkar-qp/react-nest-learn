import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { TodoService } from '../services/TodoService';
import { TodoDto, UpdateTodoDto } from '../dtos/TodoDto';
import { NotFoundException } from '@nestjs/common';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))

  async createTodo(@Body() todoDto: TodoDto) {
    return await this.todoService.createTodo(todoDto.title);
  }




@Get(':id')
async getTodo(@Param('id', ParseIntPipe) id: number) {
  const todo = await this.todoService.getTodoById(id);
  if (!todo) {
  throw new NotFoundException('Todo not found');
}
  return todo;
}

  @Get()
  async getAllTodos() {
    return await this.todoService.getAllTodos();
  }

@Put(':id')
@UsePipes(new ValidationPipe({ whitelist: true }))
async updateTodo(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateTodoDto: UpdateTodoDto
) {

  const updated = await this.todoService.updateTodo(id, updateTodoDto);
  if (!updated) {
    return { message: `Todo with ID ${id} not found` };
  }
  return updated;
}

@Delete(':id')
async deleteTodo(@Param('id', ParseIntPipe) id: number) {
  const deleted = await this.todoService.deleteTodo(id);
  if (!deleted) {
    throw new NotFoundException(`Todo with ID ${id} not found`);
  }
  return { message: `Todo with ID ${id} deleted successfully` };
}

}
