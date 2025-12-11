import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common'
import {TodoService} from '../services/TodoService'
import {TodoDto, UpdateTodoDto} from '../dtos/TodoDto'
import {NotFoundException} from '@nestjs/common'
import {TodoEntity} from '@modules/todo/domain/entities/TodoEntity'

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UsePipes(new ValidationPipe({whitelist: true}))
  async createTodo(
    @Body() todoDto: TodoDto,
  ): Promise<{id: number; title: string}> {
    return await this.todoService.createTodo(todoDto.title)
  }

  @Get(':id')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{id: number; title: string}> {
    const todo = await this.todoService.getTodoById(id)
    if (!todo) {
      throw new NotFoundException('Todo not found')
    }
    return todo
  }

  @Get()
  async getAllTodos(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{id: number; title: string}[]> {
    return this.todoService.getAllTodos(page, limit)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({whitelist: true}))
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    const updated = await this.todoService.updateTodo(id, updateTodoDto)
    if (!updated) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
    return updated
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{message: string}> {
    const deleted = await this.todoService.deleteTodo(id)
    if (!deleted) {
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
    return {message: `Todo with ID ${id} deleted successfully`}
  }
}
