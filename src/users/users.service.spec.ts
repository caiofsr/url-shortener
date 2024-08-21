import { Prisma } from '@prisma/client';
import { TestBed } from '@automock/jest';
import { PrismaService } from 'nestjs-prisma';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();

    service = unit;
    prismaService = unitRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get user', async () => {
    prismaService.user.findUniqueOrThrow = jest.fn().mockImplementation(() => {
      return {
        email: 'testing@example.com',
        id: 1,
      };
    });

    const user = await service.getUser({ email: 'testing@example.com' });

    expect(user.email).toEqual('testing@example.com');
  });

  it('should throw if user is not found', async () => {
    prismaService.user.findUniqueOrThrow = jest.fn().mockImplementation(() => {
      throw new Prisma.PrismaClientKnownRequestError('User not found', {
        code: 'P2025',
        clientVersion: Prisma.prismaVersion.client,
      });
    });

    await expect(service.getUser({ email: 'testing@example.com' })).rejects.toThrow(
      Prisma.PrismaClientKnownRequestError,
    );
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
});
