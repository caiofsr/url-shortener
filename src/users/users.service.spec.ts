import { Prisma } from '@prisma/client';
import { TestBed } from '@automock/jest';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
});
