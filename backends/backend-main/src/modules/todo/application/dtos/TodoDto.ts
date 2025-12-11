import {IsString, MaxLength, IsNotEmpty, IsOptional} from 'class-validator'

export class TodoDto {
  @IsString({message: 'title must be a string'})
  @MaxLength(255, {message: 'title must be shorter'})
  @IsNotEmpty({message: 'title should not be empty'})
  title: string
}

export class UpdateTodoDto {
  @IsOptional()
  @IsString({message: 'Title must be a string'})
  @MaxLength(255, {message: 'Title must be at most 255 characters'})
  title?: string
}
