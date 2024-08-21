import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { LinksService } from './links.service';
import { UsersModule } from 'src/users/users.module';
import { LinksController } from './links.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [LinksController],
  providers: [LinksService],
  exports: [LinksService],
})
export class LinksModule {}
