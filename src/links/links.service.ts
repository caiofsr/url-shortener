import { nanoid } from 'nanoid';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Link, Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { CreateLinkDto } from './dtos/shorten-link.dto';

@Injectable()
export class LinksService {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly prismaService: PrismaService,
  ) {}

  async getLinks(user: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.link.findMany({
      where: { userId: user.id },
    });
  }

  async getLink(filter: Prisma.LinkWhereUniqueInput) {
    return await this.prismaService.link.findUniqueOrThrow({ where: filter });
  }

  async updateClicksCount(link: Link) {
    await this.prismaService.link.update({
      where: { id: link.id },
      data: {
        clicks: link.clicks + 1,
      },
    });
  }

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
