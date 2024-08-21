import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { UsersModule } from 'src/users/users.module';
import { LinksController } from './links.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
