import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common'
import {PagerDto} from '../dtos/PagerDto'

export const pager = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PagerDto => {
    const request = ctx.switchToHttp().getRequest()
    const query = request.query

    let page = Number(query.page)
    let limit = Number(query.limit)

    if (isNaN(page) || page < 1) page = 1
    if (isNaN(limit) || limit < 1) limit = 10

    if (query.page !== undefined && Number(query.page) < 1) {
      throw new BadRequestException('Page must be >= 1')
    }
    if (query.limit !== undefined && Number(query.limit) <= 0) {
      throw new BadRequestException('Limit must be > 0')
    }

    return {page, limit}
  },
)
