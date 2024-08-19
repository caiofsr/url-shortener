import { TestBed } from '@automock/jest';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile();

    service = unit;
    prismaService = unitRef.get<PrismaService>(PrismaService);
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
});
