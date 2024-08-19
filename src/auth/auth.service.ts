import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

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
