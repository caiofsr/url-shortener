import { Response } from 'express';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { UsersService } from 'src/users/users.service';
import { CurrentUser } from './ current-user.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create an user' })
  @ApiResponse({ status: 201, description: 'User created' })
  signup(@Body() body: SignupDto) {
    return this.usersService.createUser(body);
  }

  @Post('signin')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignupDto })
  @ApiOperation({ summary: 'Signin an user' })
  @ApiResponse({
    status: 200,
    description: 'User signed in',
    headers: {
      'Set-Cookie': {
        example: 'Authentication=token',
        description: 'Authentication cookie',
      },
    },
  })
  signin(@CurrentUser() user: User, @Res({ passthrough: true }) response: Response) {
    return this.authService.signin(user, response);
  }
}
