import { response } from 'express';
import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    controller = unit;
    authService = unitRef.get<AuthService>(AuthService);
    usersService = unitRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto = {
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    usersService.createUser = jest.fn().mockImplementation(() => {
      return {
        email: createUserDto.email,
        id: 1,
      };
    });

    expect(await controller.signup(createUserDto)).toEqual({
      email: createUserDto.email,
      id: 1,
    });
  });

  it('should signin an user', async () => {
    const signinUserDto = {
      id: 1,
      email: 'testing@example.com',
      password: 'Testing@123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    authService.signin.mockResolvedValue({
      tokenPayload: {
        userId: signinUserDto.id,
        email: signinUserDto.email,
      },
    });

    expect(await controller.signin(signinUserDto, response)).toEqual({
      tokenPayload: {
        userId: signinUserDto.id,
        email: signinUserDto.email,
      },
    });
  });
});
