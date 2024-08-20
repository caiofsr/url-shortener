import { response } from 'express';
import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile();

    controller = unit;
    authService = unitRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto = {
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    authService.createUser = jest.fn().mockImplementation(() => {
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
    };

    authService.signin.mockResolvedValue({
      tokenPayload: {
        userId: signinUserDto.id,
      },
    });

    expect(await controller.signin(signinUserDto, response)).toEqual({
      tokenPayload: {
        userId: signinUserDto.id,
      },
    });
  });
});
