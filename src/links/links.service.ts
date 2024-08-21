import { nanoid } from 'nanoid';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateLinkDto } from './dtos/shorten-link.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LinksService {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly prismaService: PrismaService,
  ) {}

  async createLink({ url, user }: CreateLinkDto) {
    let userExists: User | undefined;
    if (user) {
      userExists = await this.usersService.getUser({ id: user.userId });
    }

    return await this.prismaService.link.create({
      data: {
        url,
        slug: nanoid(6),
        userId: userExists?.id ?? null,
      },
      select: {
        id: true,
        url: true,
        slug: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
