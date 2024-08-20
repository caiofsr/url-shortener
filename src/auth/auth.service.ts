import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { User } from '@prisma/client';
import { SignupDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt/dist';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signin(user: User, response: Response) {
    const expires = new Date();
    expires.setMilliseconds(expires.getMilliseconds() + 1000 * 60 * 60 * 24);

    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      secure: true,
      expires,
    });

    return { tokenPayload };
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userService.getUser({ email });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return user;
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
