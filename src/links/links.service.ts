import { nanoid } from 'nanoid';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { Link, Prisma, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { CreateLinkDto } from './dtos/shorten-link.dto';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LinksService {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly prismaService: PrismaService,
    protected readonly configService: ConfigService,
  ) {}

  async deleteLink({ id, user }: { id: number; user: TokenPayload }) {
    const link = await this.prismaService.link.findUnique({
      where: { id },
    });
    if (!link) {
      throw new NotFoundException('Link not found');
    }

    if (link.userId !== user.userId) {
      throw new UnauthorizedException('You are not allowed to perform this action');
    }

    if (link.deletedAt) {
      throw new BadRequestException('Link already deleted');
    }

    await this.prismaService.link.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return;
  }

  async getLinks(user: TokenPayload) {
    return await this.prismaService.link.findMany({
      where: { userId: user.userId, deletedAt: null },
    });
  }

  async getLink(filter: Prisma.LinkWhereUniqueInput) {
    return await this.prismaService.link.findUniqueOrThrow({ where: { ...filter, deletedAt: null } });
  }

  async updateClicksCount(link: Link) {
    await this.prismaService.link.update({
      where: { id: link.id },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });
  }

  async createLink({ url, user }: CreateLinkDto) {
    let userExists: User | undefined;
    if (user) {
      userExists = await this.usersService.getUser({ id: user.userId });
    }

    const link = await this.prismaService.link.create({
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

    const host = this.configService.getOrThrow('HOST');

    return { link: `${host}/${link.slug}` };
  }
}
