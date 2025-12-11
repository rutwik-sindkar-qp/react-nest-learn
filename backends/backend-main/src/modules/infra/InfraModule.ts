import {Module} from '@nestjs/common'
import {DatabaseModule} from './database/DatabaseModule'

@Module({
  imports: [DatabaseModule],
  exports: [DatabaseModule],
})
export class InfraModule {}
