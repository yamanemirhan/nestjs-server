import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  providers: [UsersService],
  imports: [DatabaseModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
