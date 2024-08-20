import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/auth/dtos/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });
  }

  async createUser(data: SignupDto) {
    return await this.prismaService.user.create({
      data: {
        ...data,
        password: await bcrypt.hash(data.password, 10),
      },
      select: {
        email: true,
        id: true,
      },
    });
  }
}
