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
  NotFoundException,
} from '@nestjs/common'
import {TodoService} from '../services/TodoService'
import {TodoDto, UpdateTodoDto} from '../dtos/TodoDto'
import {TodoEntity} from '@modules/todo/domain/entities/TodoEntity'
import {PagerDto} from '../dtos/PagerDto'
import {pager as Pager} from '../decorators/Pager.decorator'

import {Logger} from '@nestjs/common'

@Controller('todos')
export class TodoController {
  private readonly logger = new Logger(TodoController.name)

  constructor(private readonly todoService: TodoService) {}

  @Post()
  async createTodo(
    @Body() todoDto: TodoDto,
  ): Promise<{id: number; title: string}> {
    this.logger.log(`Creating todo with title: ${todoDto.title}`)
    const result = await this.todoService.createTodo(todoDto.title)
    this.logger.log(`Todo created successfully with ID: ${result.id}`)
    return result
  }

  @Get(':id')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{id: number; title: string}> {
    this.logger.log(`Fetching todo with ID: ${id}`)
    const todo = await this.todoService.getTodoById(id)
    if (!todo) {
      this.logger.warn(`Todo not found with ID: ${id}`)
      throw new NotFoundException('Todo not found')
    }
    return todo
  }

  @Get()
  async getAllTodos(@Pager() pager: PagerDto): Promise<TodoEntity[]> {
    this.logger.log(
      `Fetching all todos - page: ${pager.page}, limit: ${pager.limit}`,
    )
    return this.todoService.getAllTodos(pager.page, pager.limit)
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({whitelist: true}))
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ): Promise<TodoEntity> {
    this.logger.log(`Updating todo with ID: ${id}`)
    const updated = await this.todoService.updateTodo(id, updateTodoDto)
    if (!updated) {
      this.logger.warn(`Todo update failed. ID not found: ${id}`)
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
    this.logger.log(`Todo updated successfully. ID: ${id}`)
    return updated
  }

  @Delete(':id')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{message: string}> {
    this.logger.log(`Deleting todo with ID: ${id}`)
    const deleted = await this.todoService.deleteTodo(id)
    if (!deleted) {
      this.logger.warn(`Todo delete failed. ID not found: ${id}`)
      throw new NotFoundException(`Todo with ID ${id} not found`)
    }
    this.logger.log(`Todo deleted successfully. ID: ${id}`)
    return {message: `Todo with ID ${id} deleted successfully`}
  }
}
