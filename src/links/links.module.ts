import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { LinksService } from './links.service';
import { UsersModule } from 'src/users/users.module';
import { LinksController } from './links.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  exports: [LinksService],
  providers: [LinksService],
  controllers: [LinksController],
  imports: [PrismaModule, UsersModule, ConfigModule],
})
export class LinksModule {}
