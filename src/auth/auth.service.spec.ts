import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { TestBed } from '@automock/jest';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe.only('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let userService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    service = unit;
    prismaService = unitRef.get<PrismaService>(PrismaService);
    userService = unitRef.get<UsersService>(UsersService);
    jwtService = unitRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto = {
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    prismaService.user.create = jest.fn().mockImplementation(() => {
      return {
        email: createUserDto.email,
        id: 1,
      };
    });

    const user = await service.createUser({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    expect(user).toEqual({ email: createUserDto.email, id: 1 });
    expect(prismaService.user.create).toHaveBeenCalledTimes(1);
  });

  it('should verify user', async () => {
    const verifyUserDto = {
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    userService.getUser.mockResolvedValue({
      id: 1,
      email: verifyUserDto.email,
      password: verifyUserDto.password,
    });

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    const user = await service.verifyUser(verifyUserDto.email, verifyUserDto.password);

    expect(user).toMatchObject(verifyUserDto);
  });

  it('should not verify user', async () => {
    const verifyUserDto = {
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    userService.getUser.mockResolvedValue({
      id: 1,
      email: verifyUserDto.email,
      password: verifyUserDto.password,
    });

    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);
    await expect(service.verifyUser(verifyUserDto.email, verifyUserDto.password)).rejects.toThrow(
      'Invalid credentials.',
    );
  });

  it('should signin user', async () => {
    const user = {
      id: 1,
      email: 'testing@example.com',
      password: 'Testing@123',
    };

    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    jwtService.sign.mockImplementation(() => 'signedToken');

    expect(await service.signin(user, response)).toEqual({ tokenPayload: { userId: user.id } });
    expect(response.cookie).toHaveBeenCalledTimes(1);
    expect(jwtService.sign).toHaveBeenCalledTimes(1);
  });
});
