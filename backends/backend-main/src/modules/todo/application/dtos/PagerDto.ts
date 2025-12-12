import {IsNumber, IsPositive} from 'class-validator'

export class PagerDto {
  @IsNumber()
  @IsPositive()
  page: number

  @IsNumber()
  @IsPositive()
  limit: number
}
