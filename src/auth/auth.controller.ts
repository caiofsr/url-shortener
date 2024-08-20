import { Response } from 'express';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { CurrentUser } from './ current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.createUser(body);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  signin(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    return this.authService.signin(user, response);
  }
}
